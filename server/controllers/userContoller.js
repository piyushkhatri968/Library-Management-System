import { Error } from "mongoose";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { sendEmail } from "../utils/sendEmail.js";
import { genereateRegisteredAsAdminEmailTemplate } from "../utils/emailTemplates.js";

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true });

  res.status(200).json({
    success: true,
    users,
  });
});

export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Please upload an image.", 400));
  }
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all the fields.", 400));
  }

  const isRegisterd = await User.findOne({ email, accountVerified: true });
  if (isRegisterd) {
    return next(new ErrorHandler("Account already registered.", 400));
  }

  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters.", 400)
    );
  }

  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("Please upload an image file.", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const cloudinaryResponse = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    {
      folder: "LIBRARY_MANAGEMENT_SYSTEM",
    }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.log(
      "Cloudinary error: ",
      cloudinaryResponse.error || "Unknown cloudinary error."
    );
    return next(new ErrorHandler("Failed to upload avatar.", 500));
  }

  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Admin",
    accountVerified: true,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  const message = genereateRegisteredAsAdminEmailTemplate(
    name,
    email,
    password
  );
  await sendEmail({
    email: admin.email,
    subject: "Account Registered Successfully",
    message,
  });
  res.status(201).json({
    success: true,
    message: "Admin registered successfully.",
    admin,
  });
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }
  if (req.user.email === user.email) {
    return next(new ErrorHandler("You can't delete yourself.", 403));
  }
  if (user.email === "piyushkhatri968@gmail.com") {
    return next(new ErrorHandler("You can't delete the main admin.", 403));
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User deleted successfully.",
  });
});
