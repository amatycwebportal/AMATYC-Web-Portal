import nodemailer from 'nodemailer';
import { env } from '@config/env';
import {
  buildInviteEmailContent,
  INVITE_LOGO_CONTENT_ID,
  INVITE_SUPPORT_EMAIL,
  type InviteEmailParams,
} from '@lib/inviteEmailContent';
import { readInviteLogo } from '@lib/inviteLogo';

const MAIL_FROM_NAME = 'AMATYC Web Portal';
const LOGO_FILE_NAME = 'AMATYC-logo.png';

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

function assertMailCredentials(): void {
  if (hasMailCredentials()) {
    return;
  }
  const missingCredentials = getMissingMailCredentials();
  throw new Error(
    `Missing mail credentials: ${missingCredentials.join(', ')}. Set these in backend .env before sending emails.`
  );
}

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

export async function sendInviteEmail(params: InviteEmailParams) {
  assertMailCredentials();

  const logo = readInviteLogo();
  const message = buildInviteEmailContent({
    ...params,
    frontendUrl: env.FRONTEND_URL,
    includeLogo: logo !== null,
  });

  await transporter.sendMail({
    from: `"${MAIL_FROM_NAME}" <${env.GMAIL_USER}>`,
    replyTo: INVITE_SUPPORT_EMAIL,
    to: params.toEmail,
    subject: message.subject,
    text: message.text,
    html: message.html,
    ...(logo
      ? {
          attachments: [
            {
              filename: LOGO_FILE_NAME,
              content: logo,
              cid: INVITE_LOGO_CONTENT_ID,
              contentType: 'image/png',
              contentDisposition: 'inline' as const,
            },
          ],
        }
      : {}),
  });
}

export async function sendReminderEmail(args: {
  toEmail: string;
  rubricTitle: string;
  pathwayName: string;
}) {
  assertMailCredentials();

  const guideUrl = `${env.FRONTEND_URL}/guide`;
  const assignedUrl = `${env.FRONTEND_URL}/rubrics/assigned`;

  await transporter.sendMail({
    from: `"${MAIL_FROM_NAME}" <${env.GMAIL_USER}>`,
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
