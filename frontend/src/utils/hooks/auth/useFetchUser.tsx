import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { User } from '@shared/types';
import { hasAcceptedPrivacyConsent } from '@shared/privacyPolicy';

const MAX_USER_CHECK_ATTEMPTS = 2;

interface UseFetchUserOptions {
  skipConsentRedirect?: boolean;
  skipAuthRedirect?: boolean;
}

interface UseFetchUserResult {
  user: User | null;
  isLoadingUser: boolean;
  hasUserError: boolean;
}

export function useFetchUser(options?: UseFetchUserOptions): UseFetchUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [hasUserError, setHasUserError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
        let fetchedUser: User | null = null;

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
            fetchedUser = data.user as User;
            if (isMounted) {
              setUser(fetchedUser);
            }
            hasCheckedUser = true;
            break;
          }
        }

        if (!hasCheckedUser && isMounted && !options?.skipAuthRedirect) {
          navigate('/sign-in');
          return;
        }

        if (
          hasCheckedUser &&
          fetchedUser &&
          !options?.skipConsentRedirect &&
          !hasAcceptedPrivacyConsent(fetchedUser)
        ) {
          const returnTo = encodeURIComponent(`${location.pathname}${location.search}`);
          navigate(`/privacy-consent?returnTo=${returnTo}`, { replace: true });
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
  }, [
    location.pathname,
    location.search,
    navigate,
    options?.skipAuthRedirect,
    options?.skipConsentRedirect,
  ]);

  return {
    user,
    isLoadingUser,
    hasUserError,
  };
}

export default useFetchUser;
