# Invitation System Design

## Overview

When an institution is created, an administrator designates a `local_leader` by email. Since that person does not yet have an account, we cannot create a `users` row immediately. Instead, we record the intent as an **invitation** — a pre-authorized slot tied to a secure token. When the invitee authenticates (via Google OAuth or email), the system reconciles their identity against the invitation and promotes them to a real user with the correct role and institution association.

---

## Database Schema

### `institutions`
Already exists. Referenced by invitations and users.

### `invitations`

```sql
CREATE TABLE invitations (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT        NOT NULL,
  institution_id  UUID        NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  role            TEXT        NOT NULL DEFAULT 'local_leader',
  token           TEXT        NOT NULL UNIQUE,
  invited_by      UUID        REFERENCES users(id) ON DELETE SET NULL,
  accepted_at     TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '7 days',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_email ON invitations(email);
```

---

## Token Generation

Tokens must be cryptographically random and URL-safe. They are the sole secret granting access to an invite link, so weak tokens are a security vulnerability.

**Recommended approach (Node.js):**

```ts
import crypto from 'crypto';

function generateInviteToken(): string {
  return crypto.randomBytes(32).toString('hex'); // 64-char hex string
}
```

Tokens are stored in plaintext in the `invitations` table since they are single-use and expire. 

---

## Invitation Lifecycle

```
PENDING → ACCEPTED
       ↘ EXPIRED (implicit, via expires_at check)
```

There is no explicit `status` column — state is derived:

| Condition | State |
|---|---|
| `accepted_at IS NULL` AND `expires_at > now()` | Pending |
| `accepted_at IS NOT NULL` | Accepted |
| `accepted_at IS NULL` AND `expires_at <= now()` | Expired |

---

## Full Flow

### 1. Admin Creates Institution + Invites Local Leader

```
POST /institutions
{
  "name": "Riverside Academy",
  "local_leader_email": "jane@example.com"
}
```

Server actions:
1. `INSERT` into `institutions`
2. Generate a secure token
3. `INSERT` into `invitations` with the email, institution ID, role `local_leader`, and token
4. Send invite email to `jane@example.com` containing the link:
   `https://yourapp.com/invite/accept?token=<token>`

---

### 2. Invitee Receives Email and Clicks Link

The invite page (`/invite/accept?token=...`) should:

1. Look up the invitation by token
2. Validate it is pending (not accepted, not expired)
3. If invalid or expired — show an appropriate error and optionally offer to resend
4. If valid — show a prompt to sign in or create an account, preserving the token (in the URL or a short-lived cookie/session)

---

### 3. Invitee Authenticates

The token must survive the OAuth redirect round-trip. Two safe approaches:

- **Pass token through OAuth `state` param** — encode it in the `state` value sent to Google; Google returns it on callback
- **Store token in a short-lived server session** before redirecting to OAuth

After OAuth callback, you will have the authenticated user's email and the original token.

---

### 4. Reconciliation on Callback

```ts
async function handleInviteCallback(token: string, oauthEmail: string) {
  const invitation = await db.query(`
    SELECT * FROM invitations
    WHERE token = $1
      AND accepted_at IS NULL
      AND expires_at > now()
  `, [token]);

  if (!invitation) {
    throw new Error('Invitation is invalid or has expired.');
  }

  if (invitation.email.toLowerCase() !== oauthEmail.toLowerCase()) {
    throw new Error('This invitation was sent to a different email address.');
  }

  // Check if user already exists (e.g., invited to a second institution)
  const existingUser = await db.query(`
    SELECT id FROM users WHERE email = $1
  `, [oauthEmail]);

  if (existingUser) {
    // Attach to institution and role — handle per your multi-institution rules
    await db.query(`
      UPDATE users SET institution_id = $1, role = $2 WHERE id = $3
    `, [invitation.institution_id, invitation.role, existingUser.id]);
  } else {
    // Create new user
    await db.query(`
      INSERT INTO users (email, institution_id, role)
      VALUES ($1, $2, $3)
    `, [oauthEmail, invitation.institution_id, invitation.role]);
  }

  // Mark invitation accepted
  await db.query(`
    UPDATE invitations SET accepted_at = now() WHERE token = $1
  `, [token]);
}
```

---

## Security Considerations

| Concern | Mitigation |
|---|---|
| Token guessing | 32 bytes of entropy (64-char hex) makes brute force infeasible |
| Token reuse | `accepted_at IS NULL` check ensures one-time use |
| Email spoofing | Always assert OAuth email matches `invitations.email` |
| Expired links | `expires_at` enforced in every token lookup query |
| Token in logs | Treat invite URLs as secrets; avoid logging full URLs |

---

## Resending / Expiry UX

If an invitation is expired or the user lost the email, the admin should be able to trigger a resend. The cleanest approach is to **invalidate the old token and issue a new invitation row** rather than updating in place — this keeps a clean audit trail.

```ts
async function resendInvitation(originalInvitationId: string) {
  // Expire the old one immediately
  await db.query(`
    UPDATE invitations SET expires_at = now() WHERE id = $1
  `, [originalInvitationId]);

  // Issue a fresh invitation
  const newToken = generateInviteToken();
  await db.query(`
    INSERT INTO invitations (email, institution_id, role, token, invited_by)
    SELECT email, institution_id, role, $1, invited_by
    FROM invitations WHERE id = $2
  `, [newToken, originalInvitationId]);

  // Send new email...
}
```

---

## Open Questions

- **Closed vs. open signup** — should unauthenticated users (no invite) be able to create accounts at all? If yes, they just skip the reconciliation step. If no, every signup must pass through an invitation.
- **Multiple institutions** — if a user can belong to more than one institution, the `users` table needs a join table (`user_institutions`) rather than a single `institution_id` column.
