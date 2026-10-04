import mongoose from "mongoose";

export const connectDB = async (connString: string) => {
  try {
    await mongoose.connect(connString);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
  }
};
