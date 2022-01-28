import { errorHandlerOrder, ORDER_REQUEST_ERROR } from './error/error';
import { CategoryRepository } from 'src/category/category.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { responseParser } from 'src/common/error/error';
import { OrderRepository } from './order.repository';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {
  createDtoOrderDetail,
  createDtoOrderDetailParam,
  getDtoOrderDetailAllRefundQuery,
  getDtoOrderDetailOneParam,
  patchDtoOrderRefundParam,
} from './dto/create-order.dto';

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
      const {
        NOT_FOUND_PRODUCT,
        EXCEED_PRODUCT_QUANTITY,
        NOT_SELECT_ZERO_QUANTITY,
        NOT_ENOUGH_MONEY,
      } = ORDER_REQUEST_ERROR;
      const type: BuyRefundType = 'buy';
      const { productCode } = param;
      const { quantity } = body;

      const isExistProduct = await this.categoryRepository.isExistProduct(param);
      if (!isExistProduct) throw Error(NOT_FOUND_PRODUCT);

      const product = await this.orderRepository.findOrderProduct(productCode);
      const buyZeroQuantity = await this.orderRepository.buyZeroQuantity(body);
      const buyProductQuantityExcced = await this.orderRepository.buyProductQuantityExcced(
        body,
        productCode,
      );
      const userBalancePoint = await this.orderRepository.getUserBalancePoint(
        userId,
        quantity,
        product,
        type,
      );

      if (buyProductQuantityExcced) throw Error(EXCEED_PRODUCT_QUANTITY);
      if (buyZeroQuantity) throw Error(NOT_SELECT_ZERO_QUANTITY);
      if (userBalancePoint < 0) throw Error(NOT_ENOUGH_MONEY);

      const isExistOrderUser = await this.orderRepository.isExistOrderUser(userId);
      if (!isExistOrderUser) await this.orderRepository.createOrderUser(userId, session);

      await this.orderRepository.createOrderDetail(userId, body, product, session);
      await this.orderRepository.updateUserPoint(userId, userBalancePoint, session);
      await this.orderRepository.updateProductQuantity(quantity, productCode, type, session);

      await session.commitTransaction();

      return responseParser(
        {
          message: 'ORDER SUCCESS!',
        },
        201,
      );
    } catch (error) {
      await session.abortTransaction();
      console.log(error.message);
      throw new BadRequestException(errorHandlerOrder(error.message));
    } finally {
      session.endSession();
    }
  }

  async getOrderDetailAll(userId: string, query: getDtoOrderDetailAllRefundQuery) {
    const { NOT_FOUND_ORDER_INFO } = ORDER_REQUEST_ERROR;

    try {
      const orderDetailAll = await this.orderRepository.getOrderDetailAll(userId, query);
      const orderDetailsData = orderDetailAll[0].receiverDetail[0];

      if (!orderDetailsData) throw Error(NOT_FOUND_ORDER_INFO);

      return orderDetailAll;
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(errorHandlerOrder(error.message));
    }
  }

  async getOrderDetailOne(userId: string, param: getDtoOrderDetailOneParam) {
    const { NOT_FOUND_ORDER_CODE_ONE } = ORDER_REQUEST_ERROR;

    try {
      const orderDetailOne = await this.orderRepository.getOrderDetailOne(userId, param);
      const orderDetailsData = orderDetailOne[0].receiverDetail[0];

      if (!orderDetailsData) throw Error(NOT_FOUND_ORDER_CODE_ONE);

      return orderDetailOne;
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(errorHandlerOrder(error.message));
    }
  }

  async updateOrderRefund(userId: string, param: patchDtoOrderRefundParam) {
    const { NOT_FOUND_ORDER_CODE_REFUND, ALREADY_REFUNDED_OREDR } = ORDER_REQUEST_ERROR;
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const isExistOrder = await this.orderRepository.isExistOrder(userId, param);
      if (!isExistOrder) throw Error(NOT_FOUND_ORDER_CODE_REFUND);

      const isAlreadyRefund = await this.orderRepository.isAlreadyRefund(userId, param);
      if (isAlreadyRefund) throw Error(ALREADY_REFUNDED_OREDR);

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

      return responseParser(
        {
          message: 'REFUND SUCCESS!',
        },
        200,
      );
    } catch (error) {
      await session.abortTransaction();
      console.log(error.message);
      throw new BadRequestException(errorHandlerOrder(error.message));
    } finally {
      session.endSession();
    }
  }
}
