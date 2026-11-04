# Anonymity rules

This document describes how names and emails appear across the AMATYC Web Portal.

## Real identity vs alias

| Field | Purpose |
| --- | --- |
| `User.name` | Real name from Google sign-in. Used for the person’s own profile and by Administrators. |
| `User.email` | Real email from Google sign-in. Used for invitations, reminders, and Administrator tools. |
| `User.aliasName` | Stable display name drawn from a list of mathematicians. Unique within an institution. Assigned on first sign-in and when missing. |

## Who sees what

| Surface | Standard user | College lead | Administrator (`PROJECT_LEAD`) | AMATYC admin allowlist |
| --- | --- | --- | --- | --- |
| Own profile | Real name and email | Real name and email | Real name and email | Real name and email |
| Manage users / invite lists | — | Alias only (no email) | Real name and email | Real name and email |
| Manage rubric assignments | — | Alias only | Real name and email | — |
| Response CSV export | — | Alias as respondent name; email blank | Real name and email | — |
| Aggregate charts and heatmaps | No names | No names | No names | — |
| Reminder emails | Receives email at real address | Can send; API returns `{ sent: true }` only | Can send; may see alias in confirmation | — |

## Department and consensus views

Full-department and consensus overview screens show counts and heatmaps. They do not list respondent names for any role.

## Reminder contact without revealing identity

College leads can send a “please complete” reminder from Manage rubric assignments. The server looks up the real email and sends the message. The college lead response does not include the recipient address or real name.

## Invitation email

Invitation emails include a link to accept the invite and a link to `/guide` (Guide to using the rubrics).

## Notes for implementers

- Internal role value for administrators remains `PROJECT_LEAD`.
- Aggregate analytics must never join response rows to names for college lead viewers.
- When a college lead exports response data, fill `respondent_name` with `aliasName` and leave `respondent_email` empty.
