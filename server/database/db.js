import mongoose from "mongoose";

export const connectDB = () => {
  return mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "LIBRARY_MANAGEMENT_SYSTEM",
    })
    .then(() => {
      console.log("Database Connected Successfully.");
    })
    .catch((err) => {
      console.error(`Error connecting to the database: ${err}`);
      process.exit(1); // Exit the process if DB connection fails
    });
};
