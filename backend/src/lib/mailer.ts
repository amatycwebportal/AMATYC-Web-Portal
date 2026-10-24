import nodemailer from 'nodemailer';
import { env } from '@config/env';
import {
  buildInviteEmailContent,
  INVITE_LOGO_CONTENT_ID,
  INVITE_SUPPORT_EMAIL,
  type InviteEmailParams,
} from '@lib/inviteEmailContent';
import { readInviteLogo } from '@lib/inviteLogo';

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

export async function sendInviteEmail(params: InviteEmailParams) {
  if (!hasMailCredentials()) {
    const missingCredentials = getMissingMailCredentials();
    throw new Error(
      `Missing mail credentials: ${missingCredentials.join(', ')}. Set these in backend .env before sending emails.`
    );
  }

  const logo = readInviteLogo();
  const message = buildInviteEmailContent({
    ...params,
    frontendUrl: env.FRONTEND_URL,
    includeLogo: logo !== null,
  });

  await transporter.sendMail({
    from: `"TPSE Math" <${env.GMAIL_USER}>`,
    replyTo: INVITE_SUPPORT_EMAIL,
    to: params.toEmail,
    subject: message.subject,
    text: message.text,
    html: message.html,
    ...(logo
      ? {
          attachments: [
            {
              filename: 'TPSE-logo.png',
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
