import { describe, expect, test } from 'vitest';
import { isTpseAdminEmail, TPSE_ADMIN_EMAIL } from '../../tpseAdmin';

describe('isTpseAdminEmail', () => {
  test('matches the allowlisted email case-insensitively', () => {
    expect(isTpseAdminEmail(TPSE_ADMIN_EMAIL)).toBe(true);
    expect(isTpseAdminEmail(TPSE_ADMIN_EMAIL.toUpperCase())).toBe(true);
    expect(isTpseAdminEmail(` ${TPSE_ADMIN_EMAIL} `)).toBe(true);
  });

  test('rejects other emails and empty values', () => {
    expect(isTpseAdminEmail('other@example.com')).toBe(false);
    expect(isTpseAdminEmail('')).toBe(false);
    expect(isTpseAdminEmail(null)).toBe(false);
    expect(isTpseAdminEmail(undefined)).toBe(false);
  });
});
