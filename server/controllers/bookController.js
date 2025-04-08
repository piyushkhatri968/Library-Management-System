import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { Borrow } from "../models/borrowModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";

export const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, description, price, quantity } = req.body;
  if (!title || !author || !description || !price || !quantity) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }
  const book = await Book.create({
    title,
    author,
    description,
    price,
    quantity,
    createdBy: req.user._id, // Assign the Admin's user ID
  });
  res.status(201).json({
    success: true,
    message: "Book added successfully.",
    book,
  });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  // Delete all borrow records related to this book
  await Borrow.deleteMany({ "book.id": id });

  // Remove book from all users' borrowedBooks array
  await User.updateMany(
    { "borrowedBooks.bookId": id },
    { $pull: { borrowedBooks: { bookId: id } } }
  );

  // Delete the book itself
  await book.deleteOne();
  res.status(200).json({
    success: true,
    message: "Book deleted successfully.",
  });
});

export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find().populate("createdBy", "name email");
  res.status(200).json({
    success: true,
    books,
  });
});
