import express, { Request, Response } from "express";
import urlRoutes from "./routes/urlRoutes";
import { redirectToLongUrl } from "./controllers/urlController";
import {
  apiBaseUrl,
  INTERNAL_SERVER_ERROR_HTTP_STATUS_CODE,
  NOT_FOUND_HTTP_STATUS_CODE
} from "./constants";
import { ResponseHelper } from "./utils/responseHelper";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

const app = express();
const PORT = 5000;

// definitions for swagger
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "URL Shortener API",
    version: "1.0.0",
    description: "API for shortening URLs and redirecting to long URLs",
  },
  servers: [
    {
      url: `http://localhost:5000${apiBaseUrl}`,
    },
  ],
};

// swagger-jsdoc options
const options = {
  swaggerDefinition,
  apis: [
    path.resolve(__dirname, "./routes/*.ts"),
    path.resolve(__dirname, "./controllers/*.ts"),
  ],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// swagger UI route
app.use("/:api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(apiBaseUrl, urlRoutes);

app.get("/:url_path", redirectToLongUrl);

// middleware to handle non-existing routes
app.use((req: Request, res: Response): void => {
  const errorMessage = `The requested URL ${req.originalUrl} was not found on this server.`;
  res.status(NOT_FOUND_HTTP_STATUS_CODE).json(ResponseHelper.error(errorMessage));
});

// global error handler for unexpected errors
app.use((err: any, res: Response): void => {
  const errorMessage = err.message || "An unexpected error occurred.";
  res.status(INTERNAL_SERVER_ERROR_HTTP_STATUS_CODE).json(ResponseHelper.error(errorMessage));
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})