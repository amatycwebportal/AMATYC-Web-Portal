import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseLogoutResult {
  executeLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

export function useLogout(): UseLogoutResult {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const executeLogout = useCallback(async () => {
    if (isLoggingOut) {
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      // eslint-disable-next-line no-console
      console.error('VITE_BACKEND_URL is not configured.');
      return;
    }

    try {
      setIsLoggingOut(true);

      const response = await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok && response.status !== 204) {
        // eslint-disable-next-line no-console
        console.error('Failed to log out.');
        return;
      }

      navigate('/sign-in');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to log out.', error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, navigate]);

  return {
    executeLogout,
    isLoggingOut,
  };
}

export default useLogout;
