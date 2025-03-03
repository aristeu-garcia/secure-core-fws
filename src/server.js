import express from "express";
import requestMiddleware from "./middlewares/requestMiddleware.js";
import routes from "./routes/index.js";
import logger from "./config/logger.js";
import { init } from "./config/init.js";
import cookieParser from "cookie-parser";
import sqlInjectionDetectorMiddleware from "./middlewares/sqlInjectionDetectorMiddleware.js";
import xssDetectorMiddleware from "./middlewares/xssDetectorMiddleware.js";
import { setupSwagger } from "./config/swaggerConfig.js";
init();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(xssDetectorMiddleware);
app.use(sqlInjectionDetectorMiddleware);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(requestMiddleware);
setupSwagger(app);
app.use("/api", routes);

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
