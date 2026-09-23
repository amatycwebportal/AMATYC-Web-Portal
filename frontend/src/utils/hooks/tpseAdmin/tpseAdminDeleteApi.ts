export type UserDeletionImpact = {
  userId: string;
  name: string;
  email: string;
  role: string;
  institutionId: string | null;
  institutionName: string | null;
  responseCount: number;
  consensusResponseCount: number;
  rubricAssignmentCount: number;
  courseBinLinkCount: number;
  invitationAuthoredCount: number;
  requiresTypedConfirmation: boolean;
  confirmationPhrase: string;
  warnings: string[];
};

export type InstitutionDeletionImpact = {
  institutionId: string;
  name: string;
  academicSchoolYear: string;
  userCount: number;
  courseBinCount: number;
  courseCount: number;
  responseCount: number;
  consensusResponseCount: number;
  rubricAssignmentCount: number;
  userCourseBinLinkCount: number;
  invitationCount: number;
  localLeaderCount: number;
  usersDetachedNotDeleted: boolean;
  requiresTypedConfirmation: boolean;
  confirmationPhrase: string;
  warnings: string[];
};

export async function fetchUserDeletionImpact(userId: string): Promise<UserDeletionImpact> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    throw new Error('Backend URL is not configured.');
  }
  const response = await fetch(`${backendUrl}/tpse-admin/users/${userId}/deletion-impact`, {
    credentials: 'include',
  });
  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error ?? 'Failed to load user deletion impact');
  }
  return (await response.json()) as UserDeletionImpact;
}

export async function executeDeleteTpseAdminUser(params: {
  userId: string;
  confirmationPhrase?: string;
}): Promise<void> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    throw new Error('Backend URL is not configured.');
  }
  const response = await fetch(`${backendUrl}/tpse-admin/users/${params.userId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ confirmationPhrase: params.confirmationPhrase }),
  });
  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error ?? 'Failed to delete user');
  }
}

export async function fetchInstitutionDeletionImpact(
  institutionId: string
): Promise<InstitutionDeletionImpact> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    throw new Error('Backend URL is not configured.');
  }
  const response = await fetch(
    `${backendUrl}/tpse-admin/institutions/${institutionId}/deletion-impact`,
    { credentials: 'include' }
  );
  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error ?? 'Failed to load institution deletion impact');
  }
  return (await response.json()) as InstitutionDeletionImpact;
}

export async function executeDeleteTpseAdminInstitution(params: {
  institutionId: string;
  confirmationPhrase?: string;
}): Promise<void> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    throw new Error('Backend URL is not configured.');
  }
  const response = await fetch(`${backendUrl}/tpse-admin/institutions/${params.institutionId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ confirmationPhrase: params.confirmationPhrase }),
  });
  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error ?? 'Failed to delete institution');
  }
}
