const INVITE_ERROR_DESCRIPTIONS: Record<string, string> = {
  'User already exists':
    'This address already belongs to an account. They can sign in instead of receiving a new invite.',
  'User is already assigned to another institution':
    'This person is already linked to a different institution. A project lead can reassign them from Manage users.',
  'User is already a local leader at this institution':
    'This person is already the local leader for your institution.',
  'Cannot invite an existing project lead':
    'Project leads cannot be added through this invite flow.',
  'A pending invitation already exists for this email.':
    'An invitation is already pending for this address. Wait for it to be accepted or to expire, or ask a project lead for help.',
  'An invitation already exists for this email.':
    'This address already has an invitation on file. You cannot send another until that record is cleared.',
  Forbidden: 'You do not have permission to send this invite.',
  'Local leaders can only invite USER role':
    'As a local leader, you can only invite people in the Participant role.',
  'Local leaders can only invite users to their own institution.':
    'You can only invite users to your own institution.',
  'Institution not found': 'The selected institution is missing or no longer available.',
  'Invalid course bin id': 'One of the selected course bins is not valid.',
  'Course bin does not belong to this institution':
    'A selected course bin does not belong to the institution you chose.',
  'Email is required': 'Email is required.',
  'Role is required': 'Role is required.',
  'Institution ID is required': 'Institution is required.',
  'Course bin IDs must be an array of strings': 'Course bin selection is invalid.',
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
