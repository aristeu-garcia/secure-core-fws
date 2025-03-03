import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import authDocs from "../docs/authDocs.swagger.js";
import logger from "./logger.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FSW API DOCS",
      version: "1.0.0",
      description: "This is a new api of fsw",
    },
    servers: [
      {
        url:"http://localhost:3000/api",
        description: "Local Base URL for API",
      },
    ],
    paths: {
      ...authDocs.paths,
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use(
    process.env.SWAGGER_BASE_URL,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
  logger.info("Swagger is running on " + process.env.SWAGGER_BASE_URL);
};
