import { Resend } from 'resend'
import { APP_NAME } from '@/lib/app-config'
import { requireEnv } from '@/lib/env'

// Lazy — don't construct the client at import time (env isn't available during
// `next build`, and the template ships without a .env).
let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(requireEnv('RESEND_API_KEY'))
  return _resend
}

const from = () => `${process.env.RESEND_FROM_NAME ?? APP_NAME} <${process.env.RESEND_FROM_EMAIL ?? 'noreply@example.com'}>`

export async function sendVerificationCode(to: string, code: string) {
  return getResend().emails.send({
    from: from(),
    to,
    subject: `Your ${APP_NAME} verification code: ${code}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
        <h2 style="font-size:24px;font-weight:700;margin-bottom:8px;">Verify your email</h2>
        <p style="color:#a0a0a0;margin-bottom:32px;">Enter this code to complete your ${APP_NAME} account setup.</p>
        <div style="background:#0f1318;border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:24px;text-align:center;margin-bottom:32px;">
          <span style="font-size:40px;font-weight:700;letter-spacing:12px;color:#d4d4d8;">${code}</span>
        </div>
        <p style="color:#666b77;font-size:14px;">This code expires in 15 minutes. If you didn't sign up for ${APP_NAME}, ignore this email.</p>
      </div>
    `,
  })
}

export async function sendPasswordReset(to: string, resetUrl: string) {
  return getResend().emails.send({
    from: from(),
    to,
    subject: `Reset your ${APP_NAME} password`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
        <h2 style="font-size:24px;font-weight:700;margin-bottom:8px;">Reset your password</h2>
        <p style="color:#a0a0a0;margin-bottom:32px;">Click the button below to set a new password for your ${APP_NAME} account.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#d4d4d8;color:#0a0a0b;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;">Reset Password</a>
        <p style="color:#666b77;font-size:14px;margin-top:32px;">This link expires in 1 hour. If you didn't request a reset, ignore this email.</p>
      </div>
    `,
  })
}
