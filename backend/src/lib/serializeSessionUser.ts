import type { UserRole } from '@shared/types';
import { hasAcceptedPrivacyConsent } from '@shared/privacyPolicy';

type SessionUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  role: UserRole;
  institutionId?: string | null;
  aliasName?: string | null;
  privacyConsentAcceptedAt?: Date | string | null;
  privacyPolicyVersion?: string | null;
};

function formatConsentTimestamp(value: Date | string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
}

export function serializeSessionUser(user: SessionUser) {
  const {
    id,
    email,
    name,
    avatarUrl,
    role,
    institutionId,
    aliasName,
    privacyConsentAcceptedAt,
    privacyPolicyVersion,
  } = user;

  const formattedConsentTimestamp = formatConsentTimestamp(privacyConsentAcceptedAt);

  return {
    id,
    email,
    name,
    avatarUrl,
    role,
    institutionId,
    aliasName: aliasName ?? null,
    privacyConsentAcceptedAt: formattedConsentTimestamp,
    privacyPolicyVersion: privacyPolicyVersion ?? null,
    hasAcceptedPrivacyConsent: hasAcceptedPrivacyConsent({
      privacyConsentAcceptedAt: formattedConsentTimestamp,
      privacyPolicyVersion: privacyPolicyVersion ?? null,
    }),
  };
}
