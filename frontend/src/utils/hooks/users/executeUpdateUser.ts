import type { User, UserRole } from '@shared/types';

export interface UpdateUserPayload {
  name?: string;
  role?: UserRole;
  institutionId?: string | null;
  avatarUrl?: string | null;
  courseBinIds?: string[];
}

export async function executeUpdateUser(
  backendUrl: string,
  userId: string,
  payload: UpdateUserPayload
): Promise<User> {
  const response = await fetch(`${backendUrl}/users/${userId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'error' in data
        ? String((data as { error: unknown }).error)
        : 'Failed to update user';
    throw new Error(message);
  }
  return data as User;
}
