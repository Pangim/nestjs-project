import { errorHandlerNest } from '../../common/error/error';

export const USER_REQUEST_ERROR = {
  EXIST_EMAIL: 'requestEmailIsExist',
};

const errorHandle = {
  [USER_REQUEST_ERROR.EXIST_EMAIL]: {
    status: 401,
    id: 'request.signup.data.is.exist',
    message: '이미 존재하는 유저입니다.',
  },
};

export const errorHandlerUser = (key: string) => {
  return errorHandlerNest('user', errorHandle, key);
};
