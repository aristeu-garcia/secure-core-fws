import { z } from "zod";

const stringTransformNumber = () => z.string().regex(/^\d+$/).transform(Number);

const envSchema = z.object({
  PORT: stringTransformNumber(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  LOGS_RETENTION_DAYS: stringTransformNumber(),
  LOGS_MAX_SIZE_MB: stringTransformNumber(),
  LOGS_DIR: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_DURATION_MINUTES: stringTransformNumber(),
  REFRESH_TOKEN_DURATION_MINUTES: stringTransformNumber(),
  DELETE_TOKEN_EXPIRATION_TIME_MINUTES: stringTransformNumber(),
  LDAP_SERVER_URI: z.string(),
  LDAP_SERVER_DOMAIN: z.string(),
  LDAP_SEARCH_BASE: z.string(),
  SWAGGER_BASE_URL: z.string(),
});

export default envSchema;
