import nodemailer, { type Transporter } from "nodemailer";
import { env } from "../config/env";
import { logger } from "./logger";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!env.SMTP_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT ?? 587,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Sends transactional email. If SMTP isn't configured (no SMTP_HOST in env),
 * falls back to logging the message so the flow is still testable locally
 * without real credentials.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailInput): Promise<void> {
  const client = getTransporter();

  if (!client) {
    logger.info({ to, subject, text }, "SMTP not configured — logging email instead of sending");
    return;
  }

  await client.sendMail({ from: env.EMAIL_FROM, to, subject, html, text });
}

export function buildPasswordResetEmail(resetUrl: string) {
  return {
    subject: "Reset your AI Interview Platform password",
    text: `Reset your password: ${resetUrl}\n\nThis link expires in 30 minutes. If you didn't request this, ignore this email.`,
    html: `
      <p>Someone requested a password reset for your AI Interview Platform account.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a>. This link expires in 30 minutes.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  };
}
