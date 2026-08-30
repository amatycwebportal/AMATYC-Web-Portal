import type { Session } from 'express-session';
import { CURRENT_PRIVACY_POLICY_VERSION } from '@shared/privacyPolicy';

export type PendingPrivacyConsent = {
  acceptedAt: string;
  version: string;
};

type SessionWithPendingPrivacyConsent = Session & {
  pendingPrivacyConsent?: PendingPrivacyConsent;
};

export function setPendingPrivacyConsent(session: Session): void {
  const sessionWithPending = session as SessionWithPendingPrivacyConsent;
  sessionWithPending.pendingPrivacyConsent = {
    acceptedAt: new Date().toISOString(),
    version: CURRENT_PRIVACY_POLICY_VERSION,
  };
}

export function getPendingPrivacyConsent(session: Session): PendingPrivacyConsent | null {
  const pending = (session as SessionWithPendingPrivacyConsent).pendingPrivacyConsent;
  if (!pending || pending.version !== CURRENT_PRIVACY_POLICY_VERSION) {
    return null;
  }
  return pending;
}

export function clearPendingPrivacyConsent(session: Session): void {
  delete (session as SessionWithPendingPrivacyConsent).pendingPrivacyConsent;
}

export function buildConsentDataFromPending(pending: PendingPrivacyConsent) {
  return {
    privacyConsentAcceptedAt: new Date(pending.acceptedAt),
    privacyPolicyVersion: pending.version,
  };
}
