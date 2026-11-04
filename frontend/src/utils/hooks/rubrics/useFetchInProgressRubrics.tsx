import { useEffect, useState } from 'react';
import type { RubricVersion } from '@shared/types';

interface UseFetchInProgressRubricsResult {
  rubrics: RubricVersion[] | null;
  isLoadingRubrics: boolean;
  hasRubricsError: boolean;
}

export function useFetchInProgressRubrics(userId: string): UseFetchInProgressRubricsResult {
  const [rubrics, setRubrics] = useState<RubricVersion[] | null>(null);
  const [isLoadingRubrics, setIsLoadingRubrics] = useState(true);
  const [hasRubricsError, setHasRubricsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const executeFetchInProgressRubrics = async () => {
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
        const response = await fetch(`${backendUrl}/rubrics/inprogress/${userId}`, {
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

    executeFetchInProgressRubrics();

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
