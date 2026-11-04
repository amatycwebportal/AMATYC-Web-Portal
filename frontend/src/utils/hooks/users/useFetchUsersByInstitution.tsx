import { useCallback, useEffect, useState } from 'react';
import type { User } from '@shared/types';

interface UseFetchUsersByInstitutionResult {
  users: User[];
  isLoadingUsers: boolean;
  hasUsersError: boolean;
  refetchUsers: () => void;
}

export function useFetchUsersByInstitution(
  institutionId: string
): UseFetchUsersByInstitutionResult {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [hasUsersError, setHasUsersError] = useState(false);
  const [fetchVersion, setFetchVersion] = useState(0);

  const refetchUsers = useCallback(() => {
    setFetchVersion((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!institutionId) {
      setUsers([]);
      setIsLoadingUsers(false);
      setHasUsersError(false);
      return;
    }

    let isMounted = true;

    const executeFetchUsersByInstitution = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
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
        const response = await fetch(`${backendUrl}/users/by-institution/${institutionId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          if (isMounted) setHasUsersError(true);
          return;
        }

        const data = await response.json();
        if (isMounted) setUsers(data as User[]);
      } catch {
        if (isMounted) setHasUsersError(true);
      } finally {
        if (isMounted) setIsLoadingUsers(false);
      }
    };

    executeFetchUsersByInstitution();

    return () => {
      isMounted = false;
    };
  }, [fetchVersion, institutionId]);

  return {
    users: users ?? [],
    isLoadingUsers,
    hasUsersError,
    refetchUsers,
  };
}
