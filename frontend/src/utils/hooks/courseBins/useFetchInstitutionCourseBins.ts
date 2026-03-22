import { useEffect, useState } from 'react';
import type { CourseBin } from '@shared/types';

interface UseFetchInstitutionCourseBinsResult {
  courseBins: CourseBin[] | null;
  isLoadingCourseBins: boolean;
  hasCourseBinsError: boolean;
  refetchCourseBins: () => void;
}

export function useFetchInstitutionCourseBins(
  institutionId: string | undefined
): UseFetchInstitutionCourseBinsResult {
  const [courseBins, setCourseBins] = useState<CourseBin[] | null>(null);
  const [isLoadingCourseBins, setIsLoadingCourseBins] = useState(true);
  const [hasCourseBinsError, setHasCourseBinsError] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  useEffect(() => {
    let isMounted = true;
    if (!institutionId) {
      setIsLoadingCourseBins(false);
      setCourseBins([]);
      return;
    }
    const executeFetchInstitutionCourseBins = async () => {
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
        console.log('fetching course bins for institution', institutionId);
        const response = await fetch(`${backendUrl}/course-bins/institution/${institutionId}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
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

    executeFetchInstitutionCourseBins();

    return () => {
      isMounted = false;
    };
  }, [institutionId, fetchTrigger]);

  return {
    courseBins: courseBins ?? [],
    isLoadingCourseBins,
    hasCourseBinsError,
    refetchCourseBins: () => setFetchTrigger((n) => n + 1),
  };
}
