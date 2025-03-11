import express from "express";
import {
  borrowedBooks,
  getBorrowedBooksForAdmin,
  recordBorrowedBook,
  returnBorrowBook,
} from "../controllers/borrowController.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/record-borrow-book/:id", isAuthenticated, recordBorrowedBook);

router.put(
  "/return-borrowed-book/:bookId",
  isAuthenticated,
  isAuthorized("Admin"),
  returnBorrowBook
);

router.get(
  "/borrowed-books-by-users",
  isAuthenticated,
  isAuthorized("Admin"),
  getBorrowedBooksForAdmin
);

router.get("/my-borrowed-books", isAuthenticated, borrowedBooks);

export default router;
