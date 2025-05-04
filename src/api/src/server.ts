import express from "express";
import urlRoutes from "./routes/urlRoutes";
import { redirectToLongUrl } from "./controllers/urlController";
import { apiBaseUrl, NOT_FOUND_HTTP_STATUS_CODE } from "./constants";
import { ResponseHelper } from "./utils/responseHelper";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(apiBaseUrl, urlRoutes);

app.get("/:url_path", redirectToLongUrl);

// middleware to handle non-existing routes
app.use((req, res, next) => {
  const errorMessage = `The requested URL ${req.originalUrl} was not found on this server.`;
  res.status(NOT_FOUND_HTTP_STATUS_CODE).json(ResponseHelper.error(errorMessage));
})



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})