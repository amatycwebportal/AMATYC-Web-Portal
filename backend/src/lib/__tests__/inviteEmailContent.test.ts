import { describe, expect, test } from 'vitest';
import {
  buildInviteEmailContent,
  buildInviteUrl,
  INVITE_LOGO_CONTENT_ID,
  INVITE_SUPPORT_EMAIL,
} from '../inviteEmailContent';
import { readInviteLogo } from '../inviteLogo';

const FRONTEND_URL = 'https://ember.example.edu';
const TOKEN = 'abc123';
const EXPIRES_AT = new Date('2026-11-01T15:00:00.000Z');

function buildSampleContent(includeLogo: boolean) {
  return buildInviteEmailContent({
    toEmail: 'person@school.edu',
    token: TOKEN,
    institutionName: 'Riverside College',
    academicSchoolYear: '25/26',
    role: 'LOCAL_LEADER',
    invitedByName: 'Alex Rivera',
    expiresAt: EXPIRES_AT,
    frontendUrl: FRONTEND_URL,
    includeLogo,
  });
}

describe('invite email content', () => {
  test('builds a specific subject and a plain-text body with the full invitation address', () => {
    const message = buildSampleContent(true);
    const inviteUrl = buildInviteUrl(FRONTEND_URL, TOKEN);

    expect(message.subject).toBe('Invitation to the AMATYC Assessment Portal for Riverside College');
    expect(message.text).toContain('Alex Rivera invited you to join');
    expect(message.text).toContain('Riverside College');
    expect(message.text).toContain('academic year 25/26');
    expect(message.text).toContain('College lead');
    expect(message.text).not.toContain('/guide');
    expect(message.text).not.toContain('Guide to using the rubrics');
    expect(message.text).toContain('person@school.edu');
    expect(message.text).toContain('November 1, 2026');
    expect(message.text).toContain(INVITE_SUPPORT_EMAIL);
    expect(message.text).toContain(inviteUrl);
    expect(message.text.toLowerCase()).not.toContain('click here');
    expect(message.subject).not.toContain('!');
  });

  test('escapes institution and inviter names in the html part', () => {
    const message = buildInviteEmailContent({
      toEmail: 'person@school.edu',
      token: TOKEN,
      institutionName: 'West <img src=x> College',
      academicSchoolYear: '25/26',
      role: 'USER',
      invitedByName: 'Sam & "Lee"',
      expiresAt: EXPIRES_AT,
      frontendUrl: `${FRONTEND_URL}/`,
      includeLogo: false,
    });

    expect(message.html).toContain('West &lt;img src=x&gt; College');
    expect(message.html).toContain('Sam &amp; &quot;Lee&quot;');
    expect(message.html).not.toContain('<img src=x>');
    expect(message.html).not.toContain(`cid:${INVITE_LOGO_CONTENT_ID}`);
    expect(message.html).toContain('User');
    expect(message.html).not.toContain('/guide');
    expect(message.html).not.toContain('Guide to using the rubrics');
    expect(message.text).toContain(`${FRONTEND_URL}/accept-invite?token=${TOKEN}`);
  });

  test('includes the inline logo when a logo file is available', () => {
    const logo = readInviteLogo();
    const message = buildSampleContent(logo !== null);

    expect(logo).not.toBeNull();
    expect(message.html).toContain(`src="cid:${INVITE_LOGO_CONTENT_ID}"`);
    expect(message.html).toContain('alt="AMATYC"');
  });

  test('uses a fallback inviter name when the stored name is blank', () => {
    const message = buildInviteEmailContent({
      toEmail: 'person@school.edu',
      token: TOKEN,
      institutionName: 'Riverside College',
      academicSchoolYear: '25/26',
      role: 'PROJECT_LEAD',
      invitedByName: '   ',
      expiresAt: EXPIRES_AT,
      frontendUrl: FRONTEND_URL,
      includeLogo: false,
    });

    expect(message.text).toContain('An AMATYC administrator invited you');
    expect(message.text).toContain('Administrator');
  });
});
