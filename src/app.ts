import dotenv from "dotenv";
import express from "express";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import { connectDB } from "./database/connectDB";
import { router as productsRoute } from "./routes/products";

dotenv.config();
const app = express();

//routes
app.get("/", (_req, res) => {
  res.send("<h1>Store API</h1><a href='/api/products'>View Products</a>");
});
const port = process.env.PORT || 3000;

//middleware
app.use("/api/products", productsRoute);
app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(process.env.DB_CONN_STRING as string);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit the process with an error code
  }
};

start();
