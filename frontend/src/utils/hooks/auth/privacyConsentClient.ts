export type PendingSignIn = {
  hasPendingSignIn: boolean;
  email: string | null;
  name: string | null;
};

type AcceptPendingSignInResult = {
  redirectPath: string;
};

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  const errorData = (await response.json().catch(() => null)) as { error?: string } | null;
  return errorData?.error ?? fallback;
}

export async function executeFetchPendingSignIn(backendUrl: string): Promise<PendingSignIn> {
  const response = await fetch(`${backendUrl}/auth/privacy-consent/pending`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to check privacy consent status.');
  }
  return (await response.json()) as PendingSignIn;
}

/** Accepts the notice for a Google sign-in that has no account (or no current consent) yet. */
export async function executeAcceptPendingSignIn(
  backendUrl: string
): Promise<AcceptPendingSignInResult> {
  const response = await fetch(`${backendUrl}/auth/privacy-consent/pending`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Failed to record privacy consent.'));
  }
  return (await response.json()) as AcceptPendingSignInResult;
}

export async function executeDeclinePrivacyConsent(backendUrl: string): Promise<void> {
  const response = await fetch(`${backendUrl}/auth/privacy-consent/decline`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Failed to sign out.'));
  }
}
