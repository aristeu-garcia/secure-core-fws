import winston from "winston";
import path from "path";
import fs from "fs";

let logger = null;

/**
 * @param {string} logsDir - A string for the directory path to store log files.
 * @param {string} [logLevel=info] - The level of logging to be used.
 * @param {number} [maxSizeMB=5] - The maximum size of a log file in MB.
 * @param {number} [maxFiles=7] - The maximum number of log files to keep.
 *
 * @returns {Object} - A Winston logger configuration object.
 */
const getLoggerConfig = ({
  logsDir,
  logLevel = "info",
  maxSizeMB = 5,
  maxFiles = 7,
}) => {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  return {
    level: logLevel,
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
          })
        ),
      }),
      new winston.transports.File({
        filename: path.join(logsDir, "app.log"),
        maxsize: maxSizeMB * 1024 * 1024,
        maxFiles: maxFiles,
        format: winston.format.combine(
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
          })
        ),
      }),
    ],
  };
};

const config = { logsDir: "logs" };
logger = winston.createLogger(getLoggerConfig(config));

export default logger;
