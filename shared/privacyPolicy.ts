export const CURRENT_PRIVACY_POLICY_VERSION = '1.0';

export function hasAcceptedPrivacyConsent(user: {
  privacyConsentAcceptedAt?: string | Date | null;
  privacyPolicyVersion?: string | null;
}): boolean {
  return Boolean(
    user.privacyConsentAcceptedAt &&
      user.privacyPolicyVersion === CURRENT_PRIVACY_POLICY_VERSION
  );
}
