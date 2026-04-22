import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@shared/types';

const MAX_USER_CHECK_ATTEMPTS = 2;

interface UseFetchUserResult {
  user: User | null;
  isLoadingUser: boolean;
  hasUserError: boolean;
}

export function useFetchUser(): UseFetchUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [hasUserError, setHasUserError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const executeFetchUser = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
        if (isMounted) {
          setHasUserError(true);
          setIsLoadingUser(false);
        }
        return;
      }

      try {
        let hasCheckedUser = false;

        for (let attemptNumber = 1; attemptNumber <= MAX_USER_CHECK_ATTEMPTS; attemptNumber += 1) {
          const response = await fetch(`${backendUrl}/auth/user`, {
            credentials: 'include',
          });

          if (response.status === 401) {
            continue;
          }

          if (!response.ok) {
            if (isMounted) {
              setHasUserError(true);
            }
            return;
          }

          const data = await response.json();
          if (data.authenticated && data.user) {
            if (isMounted) {
              setUser(data.user as User);
            }
            hasCheckedUser = true;
            break;
          }
        }

        if (!hasCheckedUser && isMounted) {
          navigate('/sign-in');
        }
      } catch (error) {
        console.error('Failed to load user', error);
        if (isMounted) {
          setHasUserError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoadingUser(false);
        }
      }
    };

    executeFetchUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return {
    user,
    isLoadingUser,
    hasUserError,
  };
}

export default useFetchUser;
