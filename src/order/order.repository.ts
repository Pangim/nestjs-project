import { createOrderCode } from 'src/common/ordercode/create-orderCode';
import { CategoryRepository } from 'src/category/category.repository';
import { Category } from 'src/category/schemas/category.schemas';
import { UserRepository } from 'src/user/user.repository';
import { OrderDetail } from './schemas/order.scheams';
import { User } from 'src/user/schemas/user.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  createDtoOrderDetail,
  getDtoOrderDetailAllRefundQuery,
  getDtoOrderDetailOneParam,
  patchDtoOrderRefundParam,
} from './dto/create-order.dto';

const selectRefund = {
  NOTREFUND: 0,
  REFUND: 1,
} as const;

type Refund = typeof selectRefund[keyof typeof selectRefund];

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(OrderDetail.name)
    private readonly orderModel: Model<OrderDetail>,

    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly userRepository: UserRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findOrderProduct(productCode: string) {
    const product = await this.categoryModel
      .findOne({
        'product.productCode': productCode,
      })
      .select(['product.productName', 'product.productPrice', 'product.productCode', '-_id']);

    return product.product;
  }

  async isExistOrderUser(userId: string) {
    return await this.orderModel.exists({ userId });
  }

  async createOrderUser(userId: string, session: object) {
    await this.orderModel.create([{ userId }], { session });
  }

  async createOrderDetail(
    userId: string,
    body: createDtoOrderDetail,
    product: object,
    session: any,
  ) {
    const { receiverName, receiverPhone, receiverAddress, quantity } = body;
    const NOTREFUND: Refund = 0;
    const productDetail = product;
    const productPrice = product['productPrice'];
    const totalPrice = quantity * productPrice;
    const orderCode = createOrderCode();

    await this.orderModel
      .updateOne(
        {
          userId,
        },
        {
          $push: {
            receiverDetail: [
              {
                refund: NOTREFUND,
                orderCode,
                receiverName,
                receiverPhone,
                receiverAddress,
                quantity,
                totalPrice,
                productDetail,
              },
            ],
          },
        },
      )
      .session(session);
  }

  async getUserBalancePoint(_id: string, quantity: number, product: object, type: string) {
    const productPrice = product['productPrice'];
    const totalProductPrice = quantity * productPrice;

    const user = await this.userRepository.findUserById(_id);
    const userBalancePoint = await this.resultUserBalancePoint(user, totalProductPrice, type);

    return userBalancePoint;
  }

  async resultUserBalancePoint(user: { point: number }, totalProductPrice: number, type: string) {
    if (type === 'buy') return user.point - totalProductPrice;
    if (type === 'refund') return user.point + totalProductPrice;
  }

  async updateUserPoint(_id: string, userBalancePoint: number, session: any) {
    await this.userModel
      .updateOne(
        { _id },
        {
          $set: {
            point: userBalancePoint,
          },
        },
      )
      .session(session);
  }

  async updateProductQuantity(quantity: number, productCode: string, type: string, session: any) {
    const productQuantity = await this.getProductQuantity(type, productCode, quantity);

    await this.categoryModel
      .updateOne(
        {
          'product.productCode': productCode,
        },
        {
          $set: {
            'product.productQuantity': productQuantity,
          },
        },
      )
      .session(session);
  }

  async getProductQuantity(type: string, productCode: string, quantity: number) {
    const product = (await this.categoryRepository.findProductOne(productCode)).product;

    if (type === 'refund') {
      const productQuantity = product['productQuantity'] + quantity;

      return productQuantity;
    } else if (type === 'buy') {
      const productQuantity = product['productQuantity'] - quantity;

      return productQuantity;
    }
  }

  async getOrderDetailAll(userId: string, query: getDtoOrderDetailAllRefundQuery) {
    return await this.orderModel.aggregate([
      { $match: { userId } },
      {
        $project: {
          receiverDetail: {
            $filter: {
              input: '$receiverDetail',
              as: 'receiver',
              cond: { $eq: ['$$receiver.refund', query] },
            },
          },
        },
      },
    ]);
  }

  async getOrderDetailOne(
    userId: string,
    param: getDtoOrderDetailOneParam,
  ): Promise<OrderDetail[]> {
    const { orderCode } = param;

    return await this.orderModel.aggregate([
      { $match: { userId } },
      {
        $project: {
          receiverDetail: {
            $filter: {
              input: '$receiverDetail',
              as: 'receiver',
              cond: {
                $eq: ['$$receiver.orderCode', orderCode],
              },
            },
          },
        },
      },
    ]);
  }

  async buyProductQuantityExcced(
    body: createDtoOrderDetail,
    productCode: string,
  ): Promise<boolean> {
    const { quantity } = body;
    const product = (await this.categoryRepository.findProductOne(productCode)).product;

    return product['productQuantity'] - quantity < 0 ? true : false;
  }

  async buyZeroQuantity(body: createDtoOrderDetail): Promise<boolean> {
    const { quantity } = body;

    return quantity <= 0 ? true : false;
  }

  async updateOrderRefund(userId: string, param: patchDtoOrderRefundParam, session: any) {
    const { orderCode } = param;

    const NOTREFUND: Refund = 0;
    const REFUND: Refund = 1;

    return await this.orderModel
      .updateOne(
        {
          userId,
          receiverDetail: {
            $elemMatch: {
              orderCode,
              refund: NOTREFUND,
            },
          },
        },
        { $set: { 'receiverDetail.$.refund': REFUND } },
      )
      .session(session);
  }

  async isAlreadyRefund(userId: string, param: patchDtoOrderRefundParam) {
    const getOrderDetailOne = await this.getOrderDetailOne(userId, param);

    return getOrderDetailOne[0].receiverDetail[0].refund;
  }

  async getRefundProductQuantitiyTotalPrice(userId: string, param: patchDtoOrderRefundParam) {
    const getOrderDetailOne = await this.getOrderDetailOne(userId, param);

    const product = getOrderDetailOne[0].receiverDetail[0];

    return {
      quantity: product.quantity,
      productCode: product.productDetail.productCode,
    };
  }

  async isExistOrder(userId: string, param: patchDtoOrderRefundParam): Promise<boolean> {
    const { orderCode } = param;

    return await this.orderModel.exists({
      userId,
      receiverDetail: {
        $elemMatch: {
          orderCode,
        },
      },
    });
  }
}
