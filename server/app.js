import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import { connectDB } from "./database/db.js";

import expressfileupload from "express-fileupload";

import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import userRouter from "./routes/userRouter.js";
import { notifyUsers } from "./controllers/services/notifyUsers.js";
import { removeUnverifiedAccount } from "./controllers/services/removeUnverifiedAccount.js";

export const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressfileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// ------------------------------------------

app.get("/", (req, res) => {
  res.send("Server is running...");
});
// ------------------------------------------

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

removeUnverifiedAccount();
notifyUsers();
connectDB();

app.use(errorMiddleware);
