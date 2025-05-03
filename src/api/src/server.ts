import express from "express";
import urlRoutes from "./routes/urlRoutes";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use("/api/v1", urlRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})