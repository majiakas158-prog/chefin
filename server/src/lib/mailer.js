import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

/**
 * In development: prints the email to the server console (no real sending).
 * In production:  sends via SMTP using env vars SMTP_HOST / SMTP_PORT /
 *                 SMTP_USER / SMTP_PASS / SMTP_FROM.
 */
function createTransport() {
  if (env.NODE_ENV !== 'production') {
    // Console-only transport — zero config needed for local dev
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const transport = createTransport();
const FROM = process.env.SMTP_FROM ?? 'CheafIn <noreply@cheafin.com>';

export async function sendEmail({ to, subject, html }) {
  if (env.NODE_ENV !== 'production') {
    // Extract the first href from the html so it's easy to copy in dev
    const link = html.match(/href="([^"]+)"/)?.[1];
    console.log('\n📧 ─────────── DEV EMAIL ───────────');
    console.log(`   To:      ${to}`);
    console.log(`   Subject: ${subject}`);
    if (link) console.log(`   Link:    ${link}`);
    console.log('────────────────────────────────────\n');
    return;
  }

  await transport.sendMail({ from: FROM, to, subject, html });
}

/** Reusable HTML wrapper for all transactional emails */
export function emailTemplate({ heading, body, ctaLabel, ctaUrl }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:sans-serif;background:#f8fafc;padding:40px 0;margin:0">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:40px;box-shadow:0 2px 12px rgba(0,0,0,.07)">
    <h1 style="font-size:22px;color:#0f172a;margin:0 0 16px">${heading}</h1>
    <p style="color:#475569;line-height:1.6;margin:0 0 28px">${body}</p>
    ${ctaUrl ? `<a href="${ctaUrl}" style="display:inline-block;padding:14px 28px;background:#f97316;color:#fff;font-weight:600;text-decoration:none;border-radius:8px">${ctaLabel}</a>` : ''}
    <p style="color:#94a3b8;font-size:12px;margin:32px 0 0">If you didn't request this, you can safely ignore this email.</p>
  </div>
</body>
</html>`;
}
