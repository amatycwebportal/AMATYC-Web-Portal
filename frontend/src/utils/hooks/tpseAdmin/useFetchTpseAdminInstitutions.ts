import { useCallback, useEffect, useState } from 'react';

export type TpseAdminInstitutionRow = {
  id: string;
  name: string;
  academicSchoolYear: string;
  createdAt: string;
  _count: { users: number; courseBins: number };
};

interface UseFetchTpseAdminInstitutionsResult {
  institutions: TpseAdminInstitutionRow[];
  isLoadingInstitutions: boolean;
  hasInstitutionsError: boolean;
  refetchInstitutions: () => void;
}

export function useFetchTpseAdminInstitutions(
  shouldFetch: boolean
): UseFetchTpseAdminInstitutionsResult {
  const [institutions, setInstitutions] = useState<TpseAdminInstitutionRow[]>([]);
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(shouldFetch);
  const [hasInstitutionsError, setHasInstitutionsError] = useState(false);
  const [fetchVersion, setFetchVersion] = useState(0);

  const refetchInstitutions = useCallback(() => {
    setFetchVersion((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!shouldFetch) {
      setInstitutions([]);
      setIsLoadingInstitutions(false);
      setHasInstitutionsError(false);
      return;
    }

    let isMounted = true;

    const executeFetchInstitutions = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
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
        const response = await fetch(`${backendUrl}/tpse-admin/institutions`, {
          credentials: 'include',
        });
        if (!response.ok) {
          if (isMounted) setHasInstitutionsError(true);
          return;
        }
        const data = (await response.json()) as TpseAdminInstitutionRow[];
        if (isMounted) setInstitutions(data);
      } catch {
        if (isMounted) setHasInstitutionsError(true);
      } finally {
        if (isMounted) setIsLoadingInstitutions(false);
      }
    };

    void executeFetchInstitutions();

    return () => {
      isMounted = false;
    };
  }, [shouldFetch, fetchVersion]);

  return { institutions, isLoadingInstitutions, hasInstitutionsError, refetchInstitutions };
}
