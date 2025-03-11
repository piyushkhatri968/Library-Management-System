import cron from "node-cron";
import { Borrow } from "../../models/borrowModel.js";
import { User } from "../../models/userModel.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { genereateBookReturnReminderEmailTemplate } from "../../utils/emailTemplates.js";

export const notifyUsers = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      const oneDayDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const borrowers = await Borrow.find({
        dueDate: {
          $lt: oneDayDate,
        },
        returnDate: null,
        notified: false,
      });
      for (const element of borrowers) {
        if (element.user && element.user.email) {
          const dateFormat = element.dueDate.toLocaleDateString("en-us", {
            month: "long",
            day: "2-digit",
            year: "numeric",
          });
          const message = genereateBookReturnReminderEmailTemplate(
            element.user.name,
            dateFormat
          );
          sendEmail({
            email: element.user.email,
            subject: "Book Return Reminder (PK Libraray Management System)",
            message,
          });
          element.notified = true;
          await element.save();
          console.log("Email sent to: ", element.user.email);
        }
      }
    } catch (error) {
      console.log("Error in notifyUsers: ", error);
    }
  });
};
