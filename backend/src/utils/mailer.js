import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

function assertSmtpConfig() {
  if (!env.smtp.user || !env.smtp.pass || !env.smtp.from) {
    throw new Error('SMTP is not configured. Set SMTP_USER, SMTP_PASS, and SMTP_FROM in backend/.env.');
  }
}

export async function sendPasswordResetOtp({ to, name, otp }) {
  assertSmtpConfig();

  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });

  await transporter.sendMail({
    from: `"Eventify" <${env.smtp.from}>`,
    to,
    subject: 'Your Eventify password reset OTP',
    text: `Hi ${name || 'there'},\n\nYour Eventify password reset OTP is ${otp}.\n\nThis code expires in 10 minutes. If you did not request it, you can ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f6fbff;padding:24px;color:#0f274a">
        <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #dbe5f2;border-radius:14px;padding:28px">
          <h1 style="margin:0 0 10px;font-size:24px;color:#12305f">Eventify Password Reset</h1>
          <p style="margin:0 0 18px;color:#526783">Hi ${name || 'there'}, use this OTP to reset your password.</p>
          <div style="font-size:32px;font-weight:800;letter-spacing:8px;text-align:center;background:#eef7ff;border-radius:12px;padding:18px;color:#2563eb">
            ${otp}
          </div>
          <p style="margin:18px 0 0;color:#526783">This code expires in 10 minutes.</p>
          <p style="margin:10px 0 0;color:#8a9bb3;font-size:13px">If you did not request a password reset, ignore this email.</p>
        </div>
      </div>
    `,
  });
}
