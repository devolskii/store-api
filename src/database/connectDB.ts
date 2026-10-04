import mongoose from "mongoose";

export const connectDB = async (connString: string, dbName: string) => {
  try {
    await mongoose.connect(connString, { dbName });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
  }
};
