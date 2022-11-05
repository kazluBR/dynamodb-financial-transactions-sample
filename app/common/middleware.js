export const NoAuth = async (req, res, next) => {
  next();
};

export default NoAuth;
