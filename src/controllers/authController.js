import logger from "../config/logger.js";
import ldapService from "../services/ldapService.js";
import { validateSchema } from "../schemas/index.js";
import authSchema from "../schemas/authSchema.js";
import authRepository from "../repositories/authRepository.js";
import userRepository from "../repositories/usersRepository.js";
import {
  createAccessToken,
  createRefreshToken,
  setRefreshCookie,
} from "../services/authService.js";

/**
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the request is handled.
 */
const login = async (req, res) => {
  try {
    const authData = req.body;

    const isValid = validateSchema(authSchema, authData);

    if (!isValid) {
      return res.status(422).send(`Unprocessable Entity | ${isValid.error}`);
    }

    const { user, password } = authData;

    const isAutenticated = await ldapService.authenticate(user, password);

    if (!isAutenticated) return res.status(401).send("Unauthorized");

    const accessToken = createAccessToken({ user });
    const refreshToken = createRefreshToken({ user });

    setRefreshCookie(res, refreshToken);

    res.status(200).json({ accessToken });
  } catch (error) {
    logger.error(`Error occurred while getting health check: ${error.message}`);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @param {any} _ - Unused request object placeholder.
 * @param {Response} res - The response object.
 */
const refreshToken = (_, res) => {
  {
    const username = authRepository.get(res.locals.refreshHash);
    const user = userRepository.findByUsername(username);
    if (!username || !user)
      return res.status(403).send("Could not find user for this refresh token");
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    setRefreshCookie(res, refreshToken);
    res.json({ accessToken });
  }
};

export default { login, refreshToken };
