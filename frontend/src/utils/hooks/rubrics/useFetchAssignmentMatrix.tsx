import { useCallback, useEffect, useState } from 'react';
import type { AssignmentMatrixResponse } from '@shared/types';

interface UseFetchAssignmentMatrixResult {
  matrix: AssignmentMatrixResponse | null;
  isLoadingMatrix: boolean;
  hasMatrixError: boolean;
  refetchMatrix: () => void;
}

export function useFetchAssignmentMatrix(): UseFetchAssignmentMatrixResult {
  const [matrix, setMatrix] = useState<AssignmentMatrixResponse | null>(null);
  const [isLoadingMatrix, setIsLoadingMatrix] = useState(true);
  const [hasMatrixError, setHasMatrixError] = useState(false);
  const [fetchVersion, setFetchVersion] = useState(0);

  const refetchMatrix = useCallback(() => {
    setFetchVersion((value) => value + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const executeFetchAssignmentMatrix = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
        if (isMounted) {
          setHasMatrixError(true);
          setIsLoadingMatrix(false);
        }
        return;
      }

      if (isMounted) {
        setIsLoadingMatrix(true);
        setHasMatrixError(false);
      }

      try {
        const response = await fetch(`${backendUrl}/rubrics/assignment-matrix`, {
          credentials: 'include',
        });

        if (!response.ok) {
          if (isMounted) setHasMatrixError(true);
          return;
        }

        const data = await response.json();
        if (isMounted) setMatrix(data as AssignmentMatrixResponse);
      } catch {
        if (isMounted) setHasMatrixError(true);
      } finally {
        if (isMounted) setIsLoadingMatrix(false);
      }
    };

    executeFetchAssignmentMatrix();

    return () => {
      isMounted = false;
    };
  }, [fetchVersion]);

  return {
    matrix,
    isLoadingMatrix,
    hasMatrixError,
    refetchMatrix,
  };
}
