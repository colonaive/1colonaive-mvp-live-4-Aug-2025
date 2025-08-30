import nodemailer from "nodemailer";

export async function handler(event) {
  const { subject, message } = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NOTIFY_USER,
      pass: process.env.NOTIFY_PASS,
    },
  });

  await transporter.sendMail({
    from: "no-reply@colonaive.ai",
    to: "info@colonaive.ai",
    subject,
    text: message,
  });

  return { statusCode: 200, body: "Sent" };
}
