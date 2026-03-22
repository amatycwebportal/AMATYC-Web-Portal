import nodemailer from 'nodemailer';
import { env } from '@config/env';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

export async function sendInviteEmail(toEmail: string, token: string) {
  const inviteUrl = `${env.FRONTEND_URL}/accept-invite?token=${token}`;

  await transporter.sendMail({
    from: `"My App" <${env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'You have been invited',
    html: `
      <p>You've been invited to join My App.</p>
      <p><a href="${inviteUrl}">Click here to accept your invitation.</a></p>
      <p>This link expires in 7 days.</p>
    `,
  });
}
