// /netlify/functions/notify-admin.js
import nodemailer from "nodemailer";

export async function handler(event) {
  try {
    const { subject, message } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,          // e.g. smtp.office365.com
      port: Number(process.env.SMTP_PORT),  // 587
      secure: false,                        // use STARTTLS (Office365)
      auth: {
        user: process.env.NOTIFY_USER,      // info@colonaive.ai
        pass: process.env.NOTIFY_PASS,      // your Outlook/GoDaddy password or App Password
      },
    });

    await transporter.sendMail({
      from: `"Project COLONAiVE" <${process.env.NOTIFY_USER}>`,
      to: "info@colonaive.ai",              // where notifications are received
      subject: subject || "New Specialist Submission",
      text: message || "A new specialist form was submitted.",
    });

    return { statusCode: 200, body: "Sent" };
  } catch (err) {
    console.error("Email send error:", err);
    return {
      statusCode: 500,
      body: `Error sending email: ${err.message}`,
    };
  }
}
