import logger from "../config/logger.js";
/**
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} _ - The response object (not used).
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 */
const requestMiddleware = (req, __, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};

export default requestMiddleware;

