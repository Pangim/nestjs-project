export const createOrderCode = () => {
  const code =
    new Date().toISOString().split('.')[0].replace(/[^\d]/gi, '') +
    Math.floor(Math.random() * 99999);
  return code;
};
