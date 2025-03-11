import { genereateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerificationCode(verificationCode, email, res) {
  try {
    const message = genereateVerificationOtpEmailTemplate(verificationCode);
    sendEmail({
      email: email,
      subject: "Verification Code (PK Library Management System)",
      message: message,
    });
    res.status(200).json({
      success: true,
      message: "Verification code sent succesfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Verification code failed to send.",
    });
  }
}
