import { useCallback, useEffect, useState } from 'react';
import type { Response } from '@shared/types';

interface UseGetUserRubricResponsesResult {
  responses: Response[] | null;
  isLoadingResponses: boolean;
  hasResponsesError: boolean;
  refetch: () => void;
}

export function useGetUserRubricResponses(
  userId: string,
  rubricVersionId: string,
  courseBinId?: string | null,
  predefinedBinId?: string
): UseGetUserRubricResponsesResult {
  const [responses, setResponses] = useState<Response[] | null>(null);
  const [isLoadingResponses, setIsLoadingResponses] = useState(true);
  const [hasResponsesError, setHasResponsesError] = useState(false);
  const [refetchCount, setRefetchCount] = useState(0);

  const refetch = useCallback(() => {
    setRefetchCount((count) => count + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingResponses(true);
    setHasResponsesError(false);

    const executeGetUserRubricResponses = async () => {
      if (!userId) {
        if (isMounted) setResponses([]);
        setIsLoadingResponses(false);
        return;
      }
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
        if (isMounted) {
          setHasResponsesError(true);
          setIsLoadingResponses(false);
        }
        return;
      }

      try {
        const queryParams = new URLSearchParams({
          userId,
          rubricVersionId,
          ...(courseBinId ? { courseBinId } : {}),
          ...(predefinedBinId ? { predefinedBinId } : {}),
        });
        const response = await fetch(`${backendUrl}/rubrics/responses?${queryParams.toString()}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (isMounted) setHasResponsesError(true);
          return;
        }

        const data = await response.json();
        if (isMounted) setResponses(data as Response[]);
      } catch {
        if (isMounted) setHasResponsesError(true);
      } finally {
        if (isMounted) setIsLoadingResponses(false);
      }
    };

    executeGetUserRubricResponses();

    return () => {
      isMounted = false;
    };
  }, [userId, rubricVersionId, courseBinId, predefinedBinId, refetchCount]);

  return {
    responses,
    isLoadingResponses,
    hasResponsesError,
    refetch,
  };
}
