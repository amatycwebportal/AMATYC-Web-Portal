import { useEffect, useState } from 'react';
import type { User } from '@shared/types';

interface UseFetchAllUsersResult {
  users: User[] | null;
  isLoadingUsers: boolean;
  hasUsersError: boolean;
}

export function useFetchAllUsers(): UseFetchAllUsersResult {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [hasUsersError, setHasUsersError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const executeFetchAllUsers = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
        if (isMounted) {
          setHasUsersError(true);
          setIsLoadingUsers(false);
        }
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/users/all`, {
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

    executeFetchAllUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    users: users ?? [],
    isLoadingUsers,
    hasUsersError,
  };
}
