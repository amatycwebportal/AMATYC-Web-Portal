import { useEffect, useState } from 'react';
import type { Rubric } from '@shared/types';

interface UseFetchRubricVersionResult {
  rubricVersion: Rubric | null;
  isLoadingRubricVersion: boolean;
  hasRubricVersionError: boolean;
  refetchRubricVersion: () => void;
}

export function useFetchRubricVersion(rubricVersionId: string): UseFetchRubricVersionResult {
  const [rubricVersion, setRubricVersion] = useState<Rubric | null>(null);
  const [isLoadingRubricVersion, setIsLoadingRubricVersion] = useState(true);
  const [hasRubricVersionError, setHasRubricVersionError] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const executeFetchRubric = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!rubricVersionId) {
        if (isMounted) {
          setRubricVersion(null);
          setIsLoadingRubricVersion(false);
        }
        return;
      }
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
        if (isMounted) {
          setHasRubricVersionError(true);
          setIsLoadingRubricVersion(false);
        }
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/rubrics/version/${rubricVersionId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          if (isMounted) setHasRubricVersionError(true);
          return;
        }

        const data = await response.json();
        if (isMounted) setRubricVersion(data as Rubric);
      } catch {
        if (isMounted) setHasRubricVersionError(true);
      } finally {
        if (isMounted) setIsLoadingRubricVersion(false);
      }
    };

    executeFetchRubric();

    return () => {
      isMounted = false;
    };
  }, [rubricVersionId, fetchTrigger]);

  return {
    rubricVersion: rubricVersion ?? null,
    isLoadingRubricVersion,
    hasRubricVersionError,
    refetchRubricVersion: () => setFetchTrigger((n) => n + 1),
  };
}
