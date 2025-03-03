import dotenv from "dotenv";
import { validateSchema } from "../schemas/index.js";
import envSchema from "../schemas/envSchema.js";
/**
 * Validates the environment variables against a Zod schema.
 *
 * Throws an error if any of the environment variables is invalid.
 */
const validateEnv = () => {
  const isValid = validateSchema(envSchema, process.env);

  if (!isValid.success) {
    throw new Error(`Error occurred while validating env: ${isValid.error}`);
  }
};
/**
 * Initializes the environment variables by loading the .env file and validating
 * all the env vars against a Zod schema.
 *
 * Throws an error if any of the environment variables is invalid.
 */
export const init = () => {
  dotenv.config();
  validateEnv();
};

export default { init };
