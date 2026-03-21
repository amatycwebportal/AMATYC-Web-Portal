import { useEffect, useState } from 'react';
import type { Rubric } from '@shared/types';

interface UseFetchAssignedRubricsResult {
  rubrics: Rubric[] | null;
  isLoadingRubrics: boolean;
  hasRubricsError: boolean;
}

export function useFetchAssignedRubrics(userId: string): UseFetchAssignedRubricsResult {
  const [rubrics, setRubrics] = useState<Rubric[] | null>(null);
  const [isLoadingRubrics, setIsLoadingRubrics] = useState(true);
  const [hasRubricsError, setHasRubricsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const executeFetchAssignedRubrics = async () => {
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
        const response = await fetch(`${backendUrl}/rubrics/assigned/${userId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          if (isMounted) setHasRubricsError(true);
          return;
        }

        const data = await response.json();
        if (isMounted) setRubrics(data as Rubric[]);
      } catch {
        if (isMounted) setHasRubricsError(true);
      } finally {
        if (isMounted) setIsLoadingRubrics(false);
      }
    };

    executeFetchAssignedRubrics();

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
