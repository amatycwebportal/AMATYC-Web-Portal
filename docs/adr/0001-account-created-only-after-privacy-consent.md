# Accounts are created only after Privacy consent

People sign in with Google first, and the portal asks for Privacy consent before it creates an account or applies an invitation. If they decline, no account is created and their invitation stays unused. Previously, consent was collected before the Google redirect. Asking after sign-in lets returning people who have already consented skip the notice, and it guarantees the portal never stores data about someone who didn't consent.

## Consequences

- Until consent is given, the Google identity exists only in the session, not as a `User` row.
- Existing accounts that have no consent, or consent to an older policy version, keep their data. If those people decline, they are signed out rather than deleted.
