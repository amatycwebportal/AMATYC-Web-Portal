import nodemailer from 'nodemailer';
import { env } from '@config/env';

function hasMailCredentials(): boolean {
  return Boolean(env.GMAIL_USER) && Boolean(env.GMAIL_APP_PASSWORD);
}

function getMissingMailCredentials(): string[] {
  const missingCredentials: string[] = [];

  if (!env.GMAIL_USER) {
    missingCredentials.push('GMAIL_USER');
  }

  if (!env.GMAIL_APP_PASSWORD) {
    missingCredentials.push('GMAIL_APP_PASSWORD');
  }

  return missingCredentials;
}

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

export async function sendInviteEmail(toEmail: string, token: string) {
  if (!hasMailCredentials()) {
    const missingCredentials = getMissingMailCredentials();
    throw new Error(
      `Missing mail credentials: ${missingCredentials.join(', ')}. Set these in backend .env before sending emails.`
    );
  }

  const inviteUrl = `${env.FRONTEND_URL}/accept-invite?token=${token}`;
  const guideUrl = `${env.FRONTEND_URL}/guide`;

  await transporter.sendMail({
    from: `"AMATYC Web Portal" <${env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'You have been invited',
    html: `
      <p>You've been invited to join AMATYC Web Portal.</p>
      <p><a href="${inviteUrl}">Click here to accept your invitation.</a></p>
      <p>This link expires in 7 days.</p>
      <p><a href="${guideUrl}">Guide to using the rubrics</a></p>
    `,
  });
}

export async function sendReminderEmail(args: {
  toEmail: string;
  rubricTitle: string;
  pathwayName: string;
}) {
  if (!hasMailCredentials()) {
    const missingCredentials = getMissingMailCredentials();
    throw new Error(
      `Missing mail credentials: ${missingCredentials.join(', ')}. Set these in backend .env before sending emails.`
    );
  }

  const guideUrl = `${env.FRONTEND_URL}/guide`;
  const assignedUrl = `${env.FRONTEND_URL}/rubrics/assigned`;

  await transporter.sendMail({
    from: `"AMATYC Web Portal" <${env.GMAIL_USER}>`,
    to: args.toEmail,
    subject: 'Reminder: complete your rubric assignment',
    html: `
      <p>This is a reminder to complete your AMATYC Web Portal rubric assignment.</p>
      <p><strong>${args.rubricTitle}</strong> (${args.pathwayName})</p>
      <p><a href="${assignedUrl}">Open your assigned rubrics</a></p>
      <p><a href="${guideUrl}">Guide to using the rubrics</a></p>
    `,
  });
}
