import { storePrivacyConsentVersion } from './privacyConsentClient';

export async function executeAcceptPrivacyConsent(backendUrl: string) {
  const response = await fetch(`${backendUrl}/auth/privacy-consent`, {
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
