export const responseParser = (data, status) => {
  return {
    statusCode: status,
    data: data,
  };
};

export const errorHandlerNest = (api, errorHandle, message) => {
  const error = errorHandle[message];
  if (!error) {
    return {
      id: `Out.of.control.error`,
      message,
      api,
    };
  }

  return error;
};
