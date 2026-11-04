import { useEffect, useState } from 'react';
import type { RubricVersion } from '@shared/types';

interface UseFetchCompletedRubricsResult {
  rubrics: RubricVersion[] | null;
  isLoadingRubrics: boolean;
  hasRubricsError: boolean;
}

export function useFetchCompletedRubrics(userId: string): UseFetchCompletedRubricsResult {
  const [rubrics, setRubrics] = useState<RubricVersion[] | null>(null);
  const [isLoadingRubrics, setIsLoadingRubrics] = useState(true);
  const [hasRubricsError, setHasRubricsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const executeFetchCompletedRubrics = async () => {
      if (!userId) {
        setIsLoadingRubrics(false);
        return;
      }
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
        if (isMounted) {
          setHasRubricsError(true);
          setIsLoadingRubrics(false);
        }
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/rubrics/completed/${userId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          if (isMounted) setHasRubricsError(true);
          return;
        }

        const data = await response.json();
        if (isMounted) setRubrics(data as RubricVersion[]);
      } catch {
        if (isMounted) setHasRubricsError(true);
      } finally {
        if (isMounted) setIsLoadingRubrics(false);
      }
    };

    executeFetchCompletedRubrics();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return {
    rubrics: rubrics ?? [],
    isLoadingRubrics,
    hasRubricsError,
  };
}
