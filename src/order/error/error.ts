import { errorHandlerNest } from '../../common/error/error';

export const ORDER_REQUEST_ERROR = {
  NOT_FOUND_PRODUCT: 'requestParamProductCodeDataNotFound',
  EXCEED_PRODUCT_QUANTITY: 'requestBodyDataProductQuantityExceed',
  NOT_SELECT_ZERO_QUANTITY: 'requestBodyDataProductQuantityZero',
  NOT_ENOUGH_MONEY: 'requestDataUserPointNotEnough',
  NOT_FOUND_ORDER_INFO: 'requestUserDataNotFoundOrderInfoAtQueryNumber',
  NOT_FOUND_ORDER_CODE_ONE: 'requestParamDataOrderCodeNotFoundOne',
  NOT_FOUND_ORDER_CODE_REFUND: 'requestParamDataOrderCodeNotFound',
  ALREADY_REFUNDED_OREDR: 'requestParamDataOrderCodeAlreadyRefunded',
  BAD_REQUEST_QUERY_REFUND: 'requestBadQueryRefundNot0Or1',
};

const errorHandle = {
  [ORDER_REQUEST_ERROR.NOT_FOUND_PRODUCT]: {
    status: 404,
    id: 'request.param.product.code.data.not.found',
    message: '구매 상품을 찾을 수 없습니다.',
    errorCode: 'O001',
  },
  [ORDER_REQUEST_ERROR.EXCEED_PRODUCT_QUANTITY]: {
    status: 400,
    id: 'request.body.data.product.quantity.exceed',
    message: '재고보다 많은 상품을 선택하였습니다.',
    errorCode: 'O002',
  },
  [ORDER_REQUEST_ERROR.NOT_SELECT_ZERO_QUANTITY]: {
    status: 400,
    id: 'request.body.data.product.quantity.zero',
    message: '1개 이상의 상품을 선택해주세요.',
    errorCode: 'O003',
  },
  [ORDER_REQUEST_ERROR.NOT_ENOUGH_MONEY]: {
    status: 400,
    id: 'request.data.user.point.nog.enough',
    message: '잔액이 부족합니다.',
    errorCode: 'O004',
  },
  [ORDER_REQUEST_ERROR.NOT_FOUND_ORDER_INFO]: {
    status: 404,
    id: 'request.user.data.not.found.order.info.at.query.number',
    message: '조건에 맞는 주문 내역을 찾을 수 없습니다.',
    errorCode: 'O005',
  },
  [ORDER_REQUEST_ERROR.NOT_FOUND_ORDER_CODE_REFUND]: {
    status: 404,
    id: 'request.param.data.order.code.not.found',
    message: '잘못된 주문 코드입니다.',
    errorCode: 'O006',
  },
  [ORDER_REQUEST_ERROR.ALREADY_REFUNDED_OREDR]: {
    status: 400,
    id: 'request.param.data.order.code.already.refunded',
    message: '이미 환불된 주문입니다.',
    errorCode: 'O007',
  },
  [ORDER_REQUEST_ERROR.NOT_FOUND_ORDER_CODE_ONE]: {
    status: 404,
    id: 'request.param.data.order.code.not.found',
    message: '잘못된 주문 코드입니다.',
    errorCode: 'O008',
  },
  [ORDER_REQUEST_ERROR.BAD_REQUEST_QUERY_REFUND]: {
    status: 404,
    id: 'request.bad.qeury.refund.not.0.or.1',
    message: '잘못된 요청입니다.',
    errorCode: 'O009',
  },
};

export const errorHandlerOrder = (key: string) => {
  return errorHandlerNest('order', errorHandle, key);
};
