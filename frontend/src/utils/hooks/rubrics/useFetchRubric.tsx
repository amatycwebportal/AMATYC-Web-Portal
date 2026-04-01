import { useEffect, useState } from 'react';
import type { Rubric } from '@shared/types';

interface UseFetchRubricResult {
  rubric: Rubric | null;
  isLoadingRubric: boolean;
  hasRubricError: boolean;
  refetchRubric: () => void;
}

export function useFetchRubric(rubricId: string): UseFetchRubricResult {
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [isLoadingRubric, setIsLoadingRubric] = useState(true);
  const [hasRubricError, setHasRubricError] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  console.log('rubricId', rubricId);
  useEffect(() => {
    let isMounted = true;

    const executeFetchRubric = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
        if (isMounted) {
          setHasRubricError(true);
          setIsLoadingRubric(false);
        }
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/rubrics/${rubricId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          if (isMounted) setHasRubricError(true);
          return;
        }

        const data = await response.json();
        if (isMounted) setRubric(data as Rubric);
      } catch {
        if (isMounted) setHasRubricError(true);
      } finally {
        if (isMounted) setIsLoadingRubric(false);
      }
    };

    executeFetchRubric();

    return () => {
      isMounted = false;
    };
  }, [rubricId, fetchTrigger]);

  return {
    rubric: rubric ?? null,
    isLoadingRubric,
    hasRubricError,
    refetchRubric: () => setFetchTrigger((n) => n + 1),
  };
}
