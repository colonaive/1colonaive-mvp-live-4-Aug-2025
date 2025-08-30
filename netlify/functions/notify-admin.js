// /netlify/functions/notify-admin.js
import nodemailer from "nodemailer";

export async function handler(event) {
  try {
    const { subject, message } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,          // smtp.sendgrid.net
      port: Number(process.env.SMTP_PORT),  // 587
      secure: false,                        // TLS upgrade
      auth: {
        user: process.env.NOTIFY_USER,      // always "apikey" for SendGrid
        pass: process.env.NOTIFY_PASS,      // your SendGrid API key
      },
    });

    await transporter.sendMail({
      from: `"Project COLONAiVE" <info@colonaive.ai>`,  // verified sender
      to: "info@colonaive.ai",                          // admin inbox
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
