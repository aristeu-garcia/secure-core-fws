import logger from "../config/logger.js";
import { readFileSync } from "fs";

const rawData = readFileSync("./package.json", "utf-8");
const packageJson = JSON.parse(rawData);
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
