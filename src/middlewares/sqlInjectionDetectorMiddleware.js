import sqlstring from "sqlstring";
import logger from "../config/logger.js";

const SQL_PATTERNS = [
  /\bSELECT\b/i,
  /\bINSERT\b/i,
  /\bUPDATE\b/i,
  /\bDELETE\b/i,
  /\bDROP\b/i,
  /\bTABLE\b/i,
  /\bFROM\b/i,
  /\bWHERE\b/i,
  /\bUNION\b/i,
  /--/,
  /;/,
];

/**
 * Checks if the request contains any SQL injection patterns, and if so, sends a 400 status with an error message.
 * @function
 * @param {import("express").Request} req - The Express request object
 * @param {import("express").Response} res - The Express response object
 * @param {import("express").NextFunction} next - The next middleware function
 */
const sqlInjectionDetectorMiddleware = (req, res, next) => {
  const params = { ...req.query, ...req.body };

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      const escaped = sqlstring.escape(value);
      if (escaped !== `'${value}'` && escaped !== value) {
        logger.warn(`Potential SQL injection detected: ${key}=${value}`);
        return res.status(400).json({ error: "Invalid input" });
      }

      if (SQL_PATTERNS.some((pattern) => pattern.test(value))) {
        logger.warn(`Potential SQL injection detected: ${key}=${value}`);
        return res.status(400).json({ error: "Invalid input" });
      }
    }
  }
  next();
};

export default sqlInjectionDetectorMiddleware;
