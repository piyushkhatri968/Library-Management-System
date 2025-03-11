import express from "express";
import { getAllUsers, registerNewAdmin } from "../controllers/userContoller.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllUsers);
router.post(
  "/add/new-admin",
  isAuthenticated,
  isAuthorized("Admin"),                    
  registerNewAdmin
);

export default router;
