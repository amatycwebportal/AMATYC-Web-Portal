import { useEffect, useState } from 'react';

export interface InstitutionSummary {
  id: string;
  name: string;
}

interface UseFetchInstitutionsResult {
  institutions: InstitutionSummary[];
  isLoadingInstitutions: boolean;
  hasInstitutionsError: boolean;
}

export function useFetchInstitutions(isEnabled: boolean): UseFetchInstitutionsResult {
  const [institutions, setInstitutions] = useState<InstitutionSummary[]>([]);
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(false);
  const [hasInstitutionsError, setHasInstitutionsError] = useState(false);

  useEffect(() => {
    if (!isEnabled) {
      setInstitutions([]);
      setIsLoadingInstitutions(false);
      setHasInstitutionsError(false);
      return;
    }

    let isMounted = true;

    const executeFetchInstitutions = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
        if (isMounted) {
          setHasInstitutionsError(true);
          setIsLoadingInstitutions(false);
        }
        return;
      }

      if (isMounted) {
        setIsLoadingInstitutions(true);
        setHasInstitutionsError(false);
      }

      try {
        const response = await fetch(`${backendUrl}/institutions/all`, {
          credentials: 'include',
        });
        if (!response.ok) {
          if (isMounted) setHasInstitutionsError(true);
          return;
        }
        const data = await response.json();
        if (isMounted) setInstitutions(data as InstitutionSummary[]);
      } catch {
        if (isMounted) setHasInstitutionsError(true);
      } finally {
        if (isMounted) setIsLoadingInstitutions(false);
      }
    };

    executeFetchInstitutions();

    return () => {
      isMounted = false;
    };
  }, [isEnabled]);

  return {
    institutions,
    isLoadingInstitutions,
    hasInstitutionsError,
  };
}
