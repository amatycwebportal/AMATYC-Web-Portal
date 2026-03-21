import { useEffect, useState } from 'react';
import type { CourseBin } from '@shared/types';

interface UseFetchAllCourseBinsResult {
  courseBins: CourseBin[] | null;
  isLoadingCourseBins: boolean;
  hasCourseBinsError: boolean;
}

export function useFetchAllCourseBins(): UseFetchAllCourseBinsResult {
  const [courseBins, setCourseBins] = useState<CourseBin[] | null>(null);
  const [isLoadingCourseBins, setIsLoadingCourseBins] = useState(true);
  const [hasCourseBinsError, setHasCourseBinsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const executeFetchAllCourseBins = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
        if (isMounted) {
          setHasCourseBinsError(true);
          setIsLoadingCourseBins(false);
        }
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/course-bins/all`, {
          credentials: 'include',
        });

        if (!response.ok) {
          if (isMounted) setHasCourseBinsError(true);
          return;
        }

        const data = await response.json();
        if (isMounted) setCourseBins(data as CourseBin[]);
      } catch {
        if (isMounted) setHasCourseBinsError(true);
      } finally {
        if (isMounted) setIsLoadingCourseBins(false);
      }
    };

    executeFetchAllCourseBins();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    courseBins: courseBins ?? [],
    isLoadingCourseBins,
    hasCourseBinsError,
  };
}
