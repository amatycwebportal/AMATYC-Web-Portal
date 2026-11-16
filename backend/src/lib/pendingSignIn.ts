import type { Session } from 'express-session';
import type { GoogleSignInIdentity } from '@lib/resolveUnrecognizedSignIn';

/** A Google sign-in waiting on Privacy consent; no account is created or updated until accepted. */
export type PendingSignIn = {
  identity: GoogleSignInIdentity;
  inviteToken?: string;
};

type SessionWithPendingSignIn = Session & {
  pendingSignIn?: PendingSignIn;
};

export function setPendingSignIn(session: Session, pendingSignIn: PendingSignIn): void {
  (session as SessionWithPendingSignIn).pendingSignIn = pendingSignIn;
}

export const getPendingSignIn = (session: Session): PendingSignIn | null =>
  (session as SessionWithPendingSignIn).pendingSignIn ?? null;

export function clearPendingSignIn(session: Session): void {
  delete (session as SessionWithPendingSignIn).pendingSignIn;
}
