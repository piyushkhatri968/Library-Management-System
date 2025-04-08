import mongoose from "mongoose";
import { Borrow } from "./borrowModel.js";
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure only Admin users create books
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const bookId = this._id;
    await Borrow.deleteMany({ "book.id": bookId });
    next();
  }
);

export const Book = mongoose.model("Book", bookSchema);
