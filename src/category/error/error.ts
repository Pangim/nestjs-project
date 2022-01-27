import { errorHandlerNest } from 'src/common/error/error';

export const CATEGORY_REQUEST_ERROR = {
  DOES_NOT_EXIST_PAGE_PRODUCTS: 'requestQueryDoesNotExistDataProducts',
  DOES_NOT_EXIST_PAGE_PRODUCTS_PIPE: 'requestQueryDoesNotExistDataPipe',
  DOES_NOT_EXIST_PAGE_PRODUCT: 'requestQueryDoesNotExistDataProduct',
};

const errorHandle = {
  [CATEGORY_REQUEST_ERROR.DOES_NOT_EXIST_PAGE_PRODUCTS]: {
    status: 404,
    id: 'request.query.page.does.not.exist.data.products',
    message: '존재하지 않는 페이지입니다.',
    errorCode: 'C001',
  },
  [CATEGORY_REQUEST_ERROR.DOES_NOT_EXIST_PAGE_PRODUCTS_PIPE]: {
    status: 404,
    id: 'request.query.page.does.not.exist.data.products.Pipe',
    message: '존재하지 않는 페이지입니다.',
    errorCode: 'C002',
  },
  [CATEGORY_REQUEST_ERROR.DOES_NOT_EXIST_PAGE_PRODUCT]: {
    status: 404,
    id: 'request.query.page.does.not.exist.data.product',
    message: '존재하지 않는 페이지입니다.',
    errorCode: 'C003',
  },
};

export const errorHandlerCategory = (key: string) => {
  return errorHandlerNest('category', errorHandle, key);
};
