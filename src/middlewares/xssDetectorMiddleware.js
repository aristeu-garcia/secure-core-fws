import xss from "xss"
import logger from "../config/logger.js"

/**
 * This middleware detects potential XSS attacks in the request body and query parameters.
 * If a potential attack is detected, it will log a warning and send a 422 status response.
 *
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @param {import("express").NextFunction} next - The next middleware in the chain.
 */
const xssDetectorMiddleware = (req, res, next) => {
  const params = { ...req.query, ...req.body }

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      const sanitized = xss(value)
      if (sanitized !== value) {
        logger.warn(`Potential XSS attack detected: ${key}=${value}`)
        res.status(422).send("Invalid request")
        return
      }
    }
  }

  next()
}

export default xssDetectorMiddleware