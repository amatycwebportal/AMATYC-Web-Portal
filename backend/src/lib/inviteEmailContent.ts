import type { UserRole } from '@shared/types';

export const INVITE_SUPPORT_EMAIL = 'admin@tpsemath.org';
export const INVITE_LOGO_CONTENT_ID = 'tpse-logo';

const PLATFORM_NAME = 'EMBER Self-Assessment Platform';
const ORGANIZATION_NAME = 'TPSE Math';
const EXPIRATION_TIME_ZONE = 'UTC';
const FALLBACK_INVITER_NAME = 'A TPSE Math administrator';

const ROLE_LABELS: Record<UserRole, string> = {
  PROJECT_LEAD: 'project lead',
  LOCAL_LEADER: 'local leader',
  FACULTY: 'faculty member',
  USER: 'participant',
};

export interface InviteEmailParams {
  toEmail: string;
  token: string;
  institutionName: string;
  academicSchoolYear: string;
  role: UserRole;
  invitedByName: string;
  expiresAt: Date;
}

export interface InviteEmailContent {
  subject: string;
  text: string;
  html: string;
}

interface InviteEmailFacts {
  toEmail: string;
  inviteUrl: string;
  institutionName: string;
  academicSchoolYear: string;
  roleLabel: string;
  invitedByName: string;
  expirationLabel: string;
  includeLogo: boolean;
}

function normalizeDisplayText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildInviteUrl(frontendUrl: string, token: string): string {
  const baseUrl = frontendUrl.replace(/\/+$/, '');
  return `${baseUrl}/accept-invite?token=${encodeURIComponent(token)}`;
}

function formatExpirationDate(expiresAt: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeZone: EXPIRATION_TIME_ZONE,
  }).format(expiresAt);
}

function resolveInvitedByName(invitedByName: string): string {
  const normalizedName = normalizeDisplayText(invitedByName);
  return normalizedName.length > 0 ? normalizedName : FALLBACK_INVITER_NAME;
}

function buildInviteEmailFacts(
  params: InviteEmailParams & { frontendUrl: string; includeLogo: boolean }
): InviteEmailFacts {
  return {
    toEmail: params.toEmail.trim(),
    inviteUrl: buildInviteUrl(params.frontendUrl, params.token),
    institutionName: normalizeDisplayText(params.institutionName),
    academicSchoolYear: normalizeDisplayText(params.academicSchoolYear),
    roleLabel: ROLE_LABELS[params.role],
    invitedByName: resolveInvitedByName(params.invitedByName),
    expirationLabel: formatExpirationDate(params.expiresAt),
    includeLogo: params.includeLogo,
  };
}

function buildSubject(facts: InviteEmailFacts): string {
  return `Invitation to the EMBER platform for ${facts.institutionName}`;
}

function buildPlainText(facts: InviteEmailFacts): string {
  return [
    `${ORGANIZATION_NAME} — ${PLATFORM_NAME}`,
    '',
    'Hello,',
    '',
    `${facts.invitedByName} invited you to join the ${PLATFORM_NAME} for ${facts.institutionName}, academic year ${facts.academicSchoolYear}. Your role on the platform will be ${facts.roleLabel}.`,
    '',
    `${ORGANIZATION_NAME} provides the ${PLATFORM_NAME} so participating mathematics departments can evaluate their practices, identify opportunities for improvement, and develop an institutional action plan. The platform collects the account details needed to sign in, responses to self-assessment questions, and limited login activity. It is not used to collect student records, and individual responses are not used for employee performance evaluations.`,
    '',
    `To accept the invitation, open the address below in a browser. You will be asked to review the privacy notice, then sign in with the Google account for ${facts.toEmail}. Use that same email address. An account is created only after you sign in and accept the notice. Participation is voluntary.`,
    '',
    'Accept your invitation:',
    facts.inviteUrl,
    '',
    `This invitation expires on ${facts.expirationLabel}. After that date the link no longer works, and you will need a new invitation from your institution.`,
    '',
    `If you were not expecting this message, you can ignore it. No account will be created unless you sign in. To confirm that this invitation is genuine, contact ${facts.invitedByName} or write to ${INVITE_SUPPORT_EMAIL}.`,
    '',
    ORGANIZATION_NAME,
    PLATFORM_NAME,
    `This message was sent to ${facts.toEmail} because ${facts.invitedByName} invited that address to participate with ${facts.institutionName}.`,
  ].join('\n');
}

function buildLogoMarkup(includeLogo: boolean): string {
  if (!includeLogo) {
    return `<p style="margin:0;font-family:Georgia,Times New Roman,serif;font-size:20px;line-height:1.3;color:#1a1a1a;">${ORGANIZATION_NAME}</p>`;
  }

  return `<img src="cid:${INVITE_LOGO_CONTENT_ID}" alt="${ORGANIZATION_NAME}" width="240" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:240px;" />`;
}

function buildHtml(facts: InviteEmailFacts): string {
  const invitedByName = escapeHtml(facts.invitedByName);
  const institutionName = escapeHtml(facts.institutionName);
  const academicSchoolYear = escapeHtml(facts.academicSchoolYear);
  const toEmail = escapeHtml(facts.toEmail);
  const inviteUrl = escapeHtml(facts.inviteUrl);
  const expirationLabel = escapeHtml(facts.expirationLabel);
  const supportEmail = escapeHtml(INVITE_SUPPORT_EMAIL);

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#f4f6f8;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e2e6ea;">
            <tr>
              <td style="padding:28px 32px 8px 32px;">
                ${buildLogoMarkup(facts.includeLogo)}
                <p style="margin:20px 0 0 0;font-family:Georgia,Times New Roman,serif;font-size:22px;line-height:1.35;color:#1a1a1a;">Invitation to the ${PLATFORM_NAME}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 28px 32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#1f2933;">
                <p style="margin:0 0 16px 0;">Hello,</p>
                <p style="margin:0 0 16px 0;">${invitedByName} invited you to join the ${PLATFORM_NAME} for ${institutionName}, academic year ${academicSchoolYear}. Your role on the platform will be ${facts.roleLabel}.</p>
                <p style="margin:0 0 16px 0;">${ORGANIZATION_NAME} provides the ${PLATFORM_NAME} so participating mathematics departments can evaluate their practices, identify opportunities for improvement, and develop an institutional action plan. The platform collects the account details needed to sign in, responses to self-assessment questions, and limited login activity. It is not used to collect student records, and individual responses are not used for employee performance evaluations.</p>
                <p style="margin:0 0 16px 0;">To accept the invitation, open the address below in a browser. You will be asked to review the privacy notice, then sign in with the Google account for ${toEmail}. Use that same email address. An account is created only after you sign in and accept the notice. Participation is voluntary.</p>
                <p style="margin:24px 0;">
                  <a href="${inviteUrl}" style="color:#384AD3;font-weight:bold;">Accept your invitation</a>
                </p>
                <p style="margin:0 0 16px 0;">Or copy this address into your browser:<br />
                  <a href="${inviteUrl}" style="color:#384AD3;word-break:break-all;">${inviteUrl}</a>
                </p>
                <p style="margin:0 0 16px 0;">This invitation expires on ${expirationLabel}. After that date the link no longer works, and you will need a new invitation from your institution.</p>
                <p style="margin:0;">If you were not expecting this message, you can ignore it. No account will be created unless you sign in. To confirm that this invitation is genuine, contact ${invitedByName} or write to <a href="mailto:${supportEmail}" style="color:#384AD3;">${supportEmail}</a>.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 24px 32px;border-top:1px solid #e2e6ea;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#52606d;">
                <p style="margin:0 0 8px 0;">${ORGANIZATION_NAME}<br />${PLATFORM_NAME}</p>
                <p style="margin:0;">This message was sent to ${toEmail} because ${invitedByName} invited that address to participate with ${institutionName}.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildInviteEmailContent(
  params: InviteEmailParams & { frontendUrl: string; includeLogo: boolean }
): InviteEmailContent {
  const facts = buildInviteEmailFacts(params);

  return {
    subject: buildSubject(facts),
    text: buildPlainText(facts),
    html: buildHtml(facts),
  };
}
