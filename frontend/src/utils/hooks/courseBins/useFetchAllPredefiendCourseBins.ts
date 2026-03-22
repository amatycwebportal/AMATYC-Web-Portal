import { useEffect, useState } from 'react';
import type { PredefinedCourseBin } from '@shared/types';

interface UseFetchAllPredefiendCourseBinsResult {
  predefinedCourseBins: PredefinedCourseBin[] | null;
  isLoadingPredefinedCourseBins: boolean;
  hasPredefinedCourseBinsError: boolean;
  refetchPredefinedCourseBins: () => void;
}

export function useFetchAllPredefiendCourseBins(): UseFetchAllPredefiendCourseBinsResult {
  const [predefinedCourseBins, setPredefinedCourseBins] = useState<PredefinedCourseBin[] | null>(
    null
  );
  const [isLoadingPredefinedCourseBins, setIsLoadingPredefinedCourseBins] = useState(true);
  const [hasPredefinedCourseBinsError, setHasPredefinedCourseBinsError] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  useEffect(() => {
    let isMounted = true;

    const executeFetchAllPredefiendCourseBins = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
        if (isMounted) {
          setHasPredefinedCourseBinsError(true);
          setIsLoadingPredefinedCourseBins(false);
        }
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/predefined-course-bins/all`, {
          credentials: 'include',
        });

        if (!response.ok) {
          if (isMounted) setHasPredefinedCourseBinsError(true);
          return;
        }

        const data = await response.json();
        if (isMounted) setPredefinedCourseBins(data as PredefinedCourseBin[]);
      } catch {
        if (isMounted) setHasPredefinedCourseBinsError(true);
      } finally {
        if (isMounted) setIsLoadingPredefinedCourseBins(false);
      }
    };

    executeFetchAllPredefiendCourseBins();

    return () => {
      isMounted = false;
    };
  }, [fetchTrigger]);

  return {
    predefinedCourseBins: predefinedCourseBins ?? [],
    isLoadingPredefinedCourseBins,
    hasPredefinedCourseBinsError,
    refetchPredefinedCourseBins: () => setFetchTrigger((n) => n + 1),
  };
}
