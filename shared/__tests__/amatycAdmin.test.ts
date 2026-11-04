import { describe, expect, test } from 'vitest';
import { isAmatycAdminEmail, AMATYC_ADMIN_EMAIL } from '../../amatycAdmin';

describe('isAmatycAdminEmail', () => {
  test('matches the allowlisted email case-insensitively', () => {
    expect(isAmatycAdminEmail(AMATYC_ADMIN_EMAIL)).toBe(true);
    expect(isAmatycAdminEmail(AMATYC_ADMIN_EMAIL.toUpperCase())).toBe(true);
    expect(isAmatycAdminEmail(` ${AMATYC_ADMIN_EMAIL} `)).toBe(true);
  });

  test('rejects other emails and empty values', () => {
    expect(isAmatycAdminEmail('other@example.com')).toBe(false);
    expect(isAmatycAdminEmail('')).toBe(false);
    expect(isAmatycAdminEmail(null)).toBe(false);
    expect(isAmatycAdminEmail(undefined)).toBe(false);
  });
});
