import { HttpException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { CategoryRepository } from 'src/category/category.repository';
import {
  createDtoOrderDetail,
  createDtoOrderDetailParam,
  getDtoOrderDetailAllRefundQuery,
  getDtoOrderDetailOneParam,
  patchDtoOrderRefundParam,
} from './dto/create-order.dto';
import { OrderRepository } from './order.repository';

const selectBuyRefundType = {
  buy: 'buy',
  refund: 'refund',
} as const;

type BuyRefundType = typeof selectBuyRefundType[keyof typeof selectBuyRefundType];

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly categoryRepository: CategoryRepository,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async createOrderDetail(
    body: createDtoOrderDetail,
    param: createDtoOrderDetailParam,
    userId: string,
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const { quantity } = body;
      const { productCode } = param;
      const type: BuyRefundType = 'buy';
      const isExistProduct = await this.categoryRepository.isExistProduct(param);
      if (!isExistProduct) throw new HttpException('ERROR NOT FOUND PRODUCT', 404);

      const product = await this.orderRepository.findOrderProduct(productCode);
      const buyProductQuantityExcced = await this.orderRepository.buyProductQuantityExcced(
        body,
        productCode,
      );
      const buyZeroQuantity = await this.orderRepository.buyZeroQuantity(body);
      const userBalancePoint = await this.orderRepository.getUserBalancePoint(
        userId,
        quantity,
        product,
        type,
      );

      if (buyProductQuantityExcced) throw new HttpException('ERROR EXCEED PRODUCT QUANTITY', 400);
      if (buyZeroQuantity) throw new HttpException('ERROR NOT SELECT ZERO QUANTITY', 400);
      if (userBalancePoint < 0) throw new HttpException('ERROR NOT ENOUGH MONEY', 400);

      const isExistOrderUser = await this.orderRepository.isExistOrderUser(userId);
      if (!isExistOrderUser) await this.orderRepository.createOrderUser(userId, session);

      await this.orderRepository.createOrderDetail(userId, body, product, session);
      await this.orderRepository.updateUserPoint(userId, userBalancePoint, session);
      await this.orderRepository.updateProductQuantity(quantity, productCode, type, session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.log(error.message);
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getOrderDetailAll(userId: string, query: getDtoOrderDetailAllRefundQuery) {
    return await this.orderRepository.getOrderDetailAll(userId, query);
  }

  async getOrderDetailOne(userId: string, param: getDtoOrderDetailOneParam) {
    return await this.orderRepository.getOrderDetailOne(userId, param);
  }

  async updateOrderRefund(userId: string, param: patchDtoOrderRefundParam) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const isExistOrder = await this.orderRepository.isExistOrder(userId, param);
      if (!isExistOrder) throw new HttpException('ERROR NOT FOUND ORDER', 404);

      const isAlreadyRefund = await this.orderRepository.isAlreadyRefund(userId, param);
      if (isAlreadyRefund) throw new HttpException('ERROR ALREADY REFUND ORDER!', 400);

      const getOrderItems = await this.orderRepository.getRefundProductQuantitiyTotalPrice(
        userId,
        param,
      );
      const type: BuyRefundType = 'refund';
      const { quantity, productCode } = getOrderItems;
      const product = await this.orderRepository.findOrderProduct(productCode);
      const userBalancePoint = await this.orderRepository.getUserBalancePoint(
        userId,
        quantity,
        product,
        type,
      );
      await this.orderRepository.updateProductQuantity(quantity, productCode, type, session);
      await this.orderRepository.updateUserPoint(userId, userBalancePoint, session);
      await this.orderRepository.updateOrderRefund(userId, param, session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.log(error.message);
      throw error;
    } finally {
      session.endSession();
    }
  }
}
