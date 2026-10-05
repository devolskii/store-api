import dotenv from "dotenv";
import { connectDB } from "./connectDB";
import { Product } from "../models/products";
import jsonProducts from "./seed.json";

dotenv.config();

const populateProducts = async () => {
  try {
    await connectDB(
      process.env.DB_CONN_STRING as string,
      process.env.DB_NAME as string,
    );
    await Product.deleteMany(); // Clear existing products
    await Product.insertMany(jsonProducts); // Insert new products
    console.log("Success at populating products");
    process.exit(0); // Exit the process successfully
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
  }
};

populateProducts();
