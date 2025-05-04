import express, { Request, Response } from "express";
import urlRoutes from "./routes/urlRoutes";
import { redirectToLongUrl } from "./controllers/urlController";
import { apiBaseUrl, INTERNAL_SERVER_ERROR_HTTP_STATUS_CODE, NOT_FOUND_HTTP_STATUS_CODE } from "./constants";
import { ResponseHelper } from "./utils/responseHelper";

const app = express();
const PORT = 5000;

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