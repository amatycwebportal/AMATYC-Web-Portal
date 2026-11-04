/** Email allowlist for the profile-linked AMATYC Admin tools. */
export const AMATYC_ADMIN_EMAIL = 'amatyc.web.portal@gmail.com';

export function isAmatycAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === AMATYC_ADMIN_EMAIL;
}

/** Deletes above these counts require typing a confirmation phrase. */
export const USER_DELETE_HIGH_IMPACT_RESPONSE_COUNT = 25;
export const INSTITUTION_DELETE_HIGH_IMPACT_USER_COUNT = 5;
export const INSTITUTION_DELETE_HIGH_IMPACT_RESPONSE_COUNT = 50;
