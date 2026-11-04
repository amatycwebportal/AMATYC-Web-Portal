const INVITE_ERROR_DESCRIPTIONS: Record<string, string> = {
  'User already exists':
    'This address already belongs to an account. They can sign in instead of receiving a new invite.',
  'User is already assigned to another institution':
    'This person is already linked to a different institution. An administrator can reassign them from Manage users.',
  'User is already a College lead at this institution':
    'This person is already the College lead for your institution.',
  'Cannot invite an existing project lead':
    'Administrators cannot be added through this invite flow.',
  'Cannot invite an existing Administrator':
    'Administrators cannot be added through this invite flow.',
  'A pending invitation already exists for this email.':
    'An invitation is already pending for this address. Wait for it to be accepted or to expire, or ask an administrator for help.',
  'An invitation already exists for this email.':
    'This address already has an invitation on file. You cannot send another until that record is cleared.',
  Forbidden: 'You do not have permission to send this invite.',
  'College leads can only invite USER role':
    'As a College lead, you can only invite people in the User role.',
  'College leads can only invite users to their own institution.':
    'You can only invite users to your own institution.',
  'Institution not found': 'The selected institution is missing or no longer available.',
  'Email is required': 'Email is required.',
  'Role is required': 'Role is required.',
  'Institution ID is required': 'Institution is required.',
  'Not authenticated': 'Your session expired. Sign in again and retry.',
};

export function describeInviteApiError(apiError: string | undefined, httpStatus: number): string {
  const trimmed = apiError?.trim();
  if (trimmed && INVITE_ERROR_DESCRIPTIONS[trimmed]) {
    return INVITE_ERROR_DESCRIPTIONS[trimmed];
  }
  if (trimmed) {
    return trimmed;
  }
  if (httpStatus === 401) {
    return 'Your session expired. Sign in again and retry.';
  }
  if (httpStatus === 403) {
    return 'You do not have permission to send this invite.';
  }
  if (httpStatus >= 500) {
    return 'The server had a problem. Try again in a moment.';
  }
  return `The invite could not be sent (${httpStatus}).`;
}
