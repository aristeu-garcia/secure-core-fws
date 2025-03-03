import jwt from "jsonwebtoken";
import { createHmac } from "crypto";
import authRepository from "../repositories/authRepository.js";
import logger from "../config/logger.js";
/**
 * @param {Object} user - The user object containing user details.
 * @param {string} user.user - The user identifier.
 * @returns {string} - A signed JWT access token.
 */

const createAccessToken = (user) => {
  return jwt.sign(
    { sub: user.user, domain: process.env.LDAP_SERVER_DOMAIN },
    process.env.ACCESS_TOKEN_SECRET,
    {
      audience: "urn:jwt:type:access",
      issuer: "urn:system:token-issuer:type:access",
      expiresIn: `${process.env.ACCESS_TOKEN_DURATION_MINUTES}m`,
    }
  );
};

/**
 * @param {Object} user - The user object containing user details.
 * @param {string} user.user - The user identifier.
 * @returns {string} - A signed JWT refresh token.
 * 
 * Creates a JWT refresh token with the user's `username` as payload, and stores
 * a hash of the token in the `authRepository` with a TTL equal to the
 * `DELETE_TOKEN_EXPIRATION_TIME_MINUTES` environment variable. The token is
 * signed with a secret key from the `REFRESH_TOKEN_SECRET` environment variable.
 * 
 * The function returns the refresh token as a string.
 */
const createRefreshToken = (user) => {
  const token = jwt.sign(
    { sub: user.user, domain: process.env.LDAP_SERVER_DOMAIN },
    process.env.ACCESS_TOKEN_SECRET,
    {
      audience: "urn:jwt:type:refresh",
      issuer: "urn:system:token-issuer:type:refresh",
      expiresIn: `${process.env.REFRESH_TOKEN_DURATION_MINUTES}m`,
    }
  );
  const tokenHash = createHmac("sha512", process.env.REFRESH_TOKEN_SECRET)
    .update(token)
    .digest("hex");

  authRepository.set(tokenHash, user.username);

  setTimeout(() => {
    authRepository.delete(tokenHash);
    logger.info(`Refresh token ${tokenHash} expired`);
  }, process.env.DELETE_TOKEN_EXPIRATION_TIME_MINUTES * 60 * 1000);

  return token;
};
/**
 * Sets a refresh token cookie on the response object.
 * 
 * The cookie is set with the following properties:
 * - `httpOnly`: true
 * - `secure`: true
 * - `sameSite`: "strict"
 * - `expires`: a Date object set to the current time plus the number of minutes
 *   specified by the `REFRESH_TOKEN_DURATION_MINUTES` environment variable.
 */
const setRefreshCookie = (res, token) => {
  res.cookie("refresh-token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(
      Date.now() +
        Number(process.env.REFRESH_TOKEN_DURATION_MINUTES) * 60 * 1000
    ),
  });
};
export { createAccessToken, createRefreshToken, setRefreshCookie };
