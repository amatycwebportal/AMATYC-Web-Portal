import { useEffect, useState } from 'react';
import type { ConsensusContextGroup, ConsensusContextStatus } from '@shared/types';

type UseFetchConsensusContextsResult = {
  rubricVersionId: string | null;
  contexts: ConsensusContextStatus[];
  groups: ConsensusContextGroup[];
  isLoading: boolean;
  hasError: boolean;
};

export function useFetchConsensusContexts(args: {
  rubricId: string;
  institutionId?: string;
}): UseFetchConsensusContextsResult {
  const [rubricVersionId, setRubricVersionId] = useState<string | null>(null);
  const [contexts, setContexts] = useState<ConsensusContextStatus[]>([]);
  const [groups, setGroups] = useState<ConsensusContextGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!args.rubricId) {
      setRubricVersionId(null);
      setContexts([]);
      setGroups([]);
      setIsLoading(false);
      setHasError(false);
      return;
    }

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
        const params = new URLSearchParams({ rubricId: args.rubricId });
        if (args.institutionId) {
          params.set('institutionId', args.institutionId);
        }
        const response = await fetch(`${backendUrl}/consensus/contexts?${params.toString()}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          if (isMounted) {
            setHasError(true);
          }
          return;
        }
        const payload = (await response.json()) as {
          rubricVersionId?: string | null;
          contexts?: ConsensusContextStatus[];
          groups?: ConsensusContextGroup[];
        };
        if (!isMounted) return;
        setRubricVersionId(payload.rubricVersionId ?? null);
        setContexts(payload.contexts ?? []);
        setGroups(payload.groups ?? []);
      } catch {
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void executeFetch();

    return () => {
      isMounted = false;
    };
  }, [args.institutionId, args.rubricId]);

  return {
    rubricVersionId,
    contexts,
    groups,
    isLoading,
    hasError,
  };
}
