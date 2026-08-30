import { describe, expect, test } from 'vitest';
import {
  CURRENT_PRIVACY_POLICY_VERSION,
  hasAcceptedPrivacyConsent,
} from '../../shared/privacyPolicy';

describe('hasAcceptedPrivacyConsent', () => {
  test('returns false when consent has not been recorded', () => {
    expect(hasAcceptedPrivacyConsent({})).toBe(false);
    expect(
      hasAcceptedPrivacyConsent({
        privacyConsentAcceptedAt: null,
        privacyPolicyVersion: null,
      })
    ).toBe(false);
  });

  test('returns false when policy version does not match', () => {
    expect(
      hasAcceptedPrivacyConsent({
        privacyConsentAcceptedAt: new Date().toISOString(),
        privacyPolicyVersion: '0.9',
      })
    ).toBe(false);
  });

  test('returns true when consent matches current policy version', () => {
    expect(
      hasAcceptedPrivacyConsent({
        privacyConsentAcceptedAt: new Date().toISOString(),
        privacyPolicyVersion: CURRENT_PRIVACY_POLICY_VERSION,
      })
    ).toBe(true);
  });
});
