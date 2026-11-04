import { CURRENT_PRIVACY_POLICY_VERSION } from '@shared/privacyPolicy';

export function withPrivacyConsent<T extends Record<string, unknown>>(data: T) {
  return {
    ...data,
    privacyConsentAcceptedAt: new Date(),
    privacyPolicyVersion: CURRENT_PRIVACY_POLICY_VERSION,
  };
}
