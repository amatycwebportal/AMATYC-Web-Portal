import { useEffect, useState } from 'react';
import { PATHWAYS, type PathwayDefinition } from '@shared/pathways';

type UseFetchPathwaysResult = {
  pathways: PathwayDefinition[];
  isLoadingPathways: boolean;
  hasPathwaysError: boolean;
};

export function useFetchPathways(): UseFetchPathwaysResult {
  const [pathways, setPathways] = useState<PathwayDefinition[]>([...PATHWAYS]);
  const [isLoadingPathways, setIsLoadingPathways] = useState(true);
  const [hasPathwaysError, setHasPathwaysError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const executeFetch = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        if (isMounted) {
          setPathways([...PATHWAYS]);
          setIsLoadingPathways(false);
        }
        return;
      }
      setIsLoadingPathways(true);
      setHasPathwaysError(false);
      try {
        const response = await fetch(`${backendUrl}/pathways`, { credentials: 'include' });
        if (!response.ok) {
          if (isMounted) {
            setHasPathwaysError(true);
            setPathways([...PATHWAYS]);
          }
          return;
        }
        const data = (await response.json()) as PathwayDefinition[];
        if (isMounted) {
          setPathways(data.length > 0 ? data : [...PATHWAYS]);
        }
      } catch {
        if (isMounted) {
          setHasPathwaysError(true);
          setPathways([...PATHWAYS]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingPathways(false);
        }
      }
    };
    void executeFetch();
    return () => {
      isMounted = false;
    };
  }, []);

  return { pathways, isLoadingPathways, hasPathwaysError };
}
