import * as nodemailer from "nodemailer";
import type { MailOptions } from "nodemailer/lib/smtp-transport";

// Normalize env vars
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const secure = process.env.SMTP_PORT === "465"; // true for 465, false for other ports

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port,
	secure,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
	from: process.env.SMTP_FROM_EMAIL,
} as MailOptions);

// // Wrap in an async IIFE so we can use await.
// (async () => {
//   const info = await transporter.sendMail({
//     from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
//     to: "bar@example.com, baz@example.com",
//     subject: "Hello ✔",
//     text: "Hello world?", // plain‑text body
//     html: "<b>Hello world?</b>", // HTML body
//   });

//   console.log("Message sent:", info.messageId);
// })();

export { transporter };
