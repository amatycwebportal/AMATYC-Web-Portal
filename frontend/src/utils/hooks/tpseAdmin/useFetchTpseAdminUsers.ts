import { useCallback, useEffect, useState } from 'react';

export type TpseAdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  institutionId: string | null;
  avatarUrl: string | null;
  createdAt: string;
  institution: { name: string } | null;
};

interface UseFetchTpseAdminUsersResult {
  users: TpseAdminUserRow[];
  isLoadingUsers: boolean;
  hasUsersError: boolean;
  refetchUsers: () => void;
}

export function useFetchTpseAdminUsers(shouldFetch: boolean): UseFetchTpseAdminUsersResult {
  const [users, setUsers] = useState<TpseAdminUserRow[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(shouldFetch);
  const [hasUsersError, setHasUsersError] = useState(false);
  const [fetchVersion, setFetchVersion] = useState(0);

  const refetchUsers = useCallback(() => {
    setFetchVersion((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!shouldFetch) {
      setUsers([]);
      setIsLoadingUsers(false);
      setHasUsersError(false);
      return;
    }

    let isMounted = true;

    const executeFetchUsers = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        if (isMounted) {
          setHasUsersError(true);
          setIsLoadingUsers(false);
        }
        return;
      }

      if (isMounted) {
        setIsLoadingUsers(true);
        setHasUsersError(false);
      }

      try {
        const response = await fetch(`${backendUrl}/tpse-admin/users`, {
          credentials: 'include',
        });
        if (!response.ok) {
          if (isMounted) setHasUsersError(true);
          return;
        }
        const data = (await response.json()) as TpseAdminUserRow[];
        if (isMounted) setUsers(data);
      } catch {
        if (isMounted) setHasUsersError(true);
      } finally {
        if (isMounted) setIsLoadingUsers(false);
      }
    };

    void executeFetchUsers();

    return () => {
      isMounted = false;
    };
  }, [shouldFetch, fetchVersion]);

  return { users, isLoadingUsers, hasUsersError, refetchUsers };
}
