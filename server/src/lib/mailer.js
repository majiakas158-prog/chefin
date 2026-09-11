import { Resend } from 'resend';
import { env } from '../config/env.js';

/**
 * Email delivery via Resend (https://resend.com).
 *
 * In development (no RESEND_API_KEY set): emails are printed to the server
 * console — zero config needed for local dev.
 *
 * In production: set RESEND_API_KEY in your .env file.
 */
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const FROM = env.RESEND_FROM ?? 'CheafIn <onboarding@resend.dev>';

export async function sendEmail({ to, subject, html }) {
  // ── Development fallback ──────────────────────────────────────────────
  if (!resend) {
    const link = html.match(/href="([^"]+)"/)?.[1];
    console.log('\n📧 ─────────── DEV EMAIL ───────────');
    console.log(`   To:      ${to}`);
    console.log(`   Subject: ${subject}`);
    if (link) console.log(`   Link:    ${link}`);
    console.log('────────────────────────────────────\n');
    return;
  }

  // ── Production: send via Resend ───────────────────────────────────────
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) {
    console.error('[Resend] Failed to send email:', error);
    throw new Error(error.message);
  }
}

/** Reusable branded HTML wrapper for transactional emails */
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
