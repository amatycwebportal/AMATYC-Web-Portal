import { useEffect, useState } from 'react';
import type { ConsensusContextStatus } from '@shared/types';

export type ConsensusRubricContextGroup = {
  rubricId: string;
  rubricTitle: string;
  rubricVersionId: string;
  contexts: ConsensusContextStatus[];
};

type UseFetchConsensusContextsGroupedResult = {
  groups: ConsensusRubricContextGroup[];
  isLoading: boolean;
  hasError: boolean;
};

export function useFetchConsensusContextsGrouped(): UseFetchConsensusContextsGroupedResult {
  const [groups, setGroups] = useState<ConsensusRubricContextGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setHasError(false);

      try {
        const response = await fetch(`${backendUrl}/consensus/contexts-grouped`, {
          credentials: 'include',
        });
        if (!response.ok) {
          if (isMounted) setHasError(true);
          return;
        }
        const payload = (await response.json()) as { groups?: ConsensusRubricContextGroup[] };
        if (!isMounted) return;
        setGroups(payload.groups ?? []);
      } catch {
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void executeFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  return { groups, isLoading, hasError };
}
