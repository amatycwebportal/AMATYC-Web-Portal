import { CURRENT_PRIVACY_POLICY_VERSION } from '@shared/privacyPolicy';

const PRIVACY_CONSENT_STORAGE_KEY = 'tpse_privacy_consent_version';

export function getStoredPrivacyConsentVersion(): string | null {
  return localStorage.getItem(PRIVACY_CONSENT_STORAGE_KEY);
}

export function storePrivacyConsentVersion(): void {
  localStorage.setItem(PRIVACY_CONSENT_STORAGE_KEY, CURRENT_PRIVACY_POLICY_VERSION);
}

export function hasStoredPrivacyConsent(): boolean {
  return getStoredPrivacyConsentVersion() === CURRENT_PRIVACY_POLICY_VERSION;
}

export async function executeFetchPendingPrivacyConsent(backendUrl: string): Promise<boolean> {
  const response = await fetch(`${backendUrl}/auth/privacy-consent/pending`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to check privacy consent status.');
  }

  const data = (await response.json()) as { hasPendingConsent?: boolean };
  return Boolean(data.hasPendingConsent);
}

export async function executeAcceptPendingPrivacyConsent(backendUrl: string) {
  const response = await fetch(`${backendUrl}/auth/privacy-consent/pending`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(errorData?.error ?? 'Failed to record privacy consent.');
  }

  storePrivacyConsentVersion();
  return response.json();
}

export async function ensurePendingPrivacyConsent(backendUrl: string): Promise<boolean> {
  const hasPendingConsent = await executeFetchPendingPrivacyConsent(backendUrl);
  if (hasPendingConsent) {
    return true;
  }

  if (!hasStoredPrivacyConsent()) {
    return false;
  }

  await executeAcceptPendingPrivacyConsent(backendUrl);
  return true;
}
