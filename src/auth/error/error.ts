import { errorHandlerNest } from '../../common/error/error';

export const AUTH_REQUEST_ERROR = {
  DOES_NOT_EXIST_EMAIL: "Cannot read properties of null (reading 'password')",
  INCORRECT_PASSOWRD: 'requestPasswordIncorrect',
};

const errorHandle = {
  [AUTH_REQUEST_ERROR.DOES_NOT_EXIST_EMAIL]: {
    status: 401,
    id: 'request.signin.data.email.does.not.exist',
    message: '존재하지 않는 유저입니다.',
    errorCode: 'A001',
  },
  [AUTH_REQUEST_ERROR.INCORRECT_PASSOWRD]: {
    status: 401,
    id: 'request.signin.data.password.incorrect',
    message: '비밀번호를 잘못 입력하셨습니다.',
    errorCode: 'A002',
  },
};

export const errorHandlerAuth = (key: string) => {
  return errorHandlerNest('auth', errorHandle, key);
};
