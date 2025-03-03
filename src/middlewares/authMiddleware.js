import { createHmac } from "crypto";
import jwt from "jsonwebtoken";

/**
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {Function} next - The callback function to pass control to the next middleware.
 */

const withRefreshAuth = (req, res, next) => {
  const token = req.cookies["refresh-token"];
  if (!token) return res.status(401).send("Unauthorized");
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      audience: "urn:jwt:type:refresh",
    });
    const tokenHash = createHmac("sha512", process.env.REFRESH_TOKEN_SECRET)
      .update(token)
      .digest("hex");
    res.locals.refreshHash = tokenHash;
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
};

/**
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {Function} next - The callback function to pass control to the next middleware.
 */
const withAccessAuth = (req, res, next) => {
  const token = req.headers["authorization"]?.split("Bearer ")[1];
  if (!token) return res.status(401).send("Unauthorized");
  try {
    const { sub, user, domain } = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      {
        audience: "urn:jwt:type:access",
      }
    );

    res.locals.user = { sub, user, domain };
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
};

export { withRefreshAuth, withAccessAuth };
