import logger from "../config/logger.js";
import packageJson from "../../package.json" assert { type: "json" };

/**
 * @param {import("express").Request} _
 * @param {import("express").Response} res
 */
const get = async (__, res) => {
  try {
    const { author, version, description } = packageJson;
    res.status(200).json({ author, version, description });
  } catch (error) {
    logger.error(`Error occurred while getting health check: ${error.message}`);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export default { get };
