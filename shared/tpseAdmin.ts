/** Email allowlist for the profile-linked TPSE Admin tools. */
export const TPSE_ADMIN_EMAIL = 'tpse.web.portal@gmail.com';

export function isTpseAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === TPSE_ADMIN_EMAIL;
}

/** Deletes above these counts require typing a confirmation phrase. */
export const USER_DELETE_HIGH_IMPACT_RESPONSE_COUNT = 25;
export const INSTITUTION_DELETE_HIGH_IMPACT_USER_COUNT = 5;
export const INSTITUTION_DELETE_HIGH_IMPACT_RESPONSE_COUNT = 50;
