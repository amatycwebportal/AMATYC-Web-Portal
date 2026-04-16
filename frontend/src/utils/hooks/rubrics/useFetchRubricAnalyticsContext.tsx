import { useEffect, useState } from 'react';

type LocalLeaderAnalyticsContextRow = {
  rubricVersionId: string;
  courseBinId: string | null;
  courseBinDisplayName: string | null;
  predefinedBinId: string | null;
  predefinedBinName: string | null;
  isGlobalAssignment: boolean;
};

type ProjectLeadAnalyticsContextGroup = {
  predefinedBinId: string | null;
  predefinedBinName: string;
  courseBins: {
    courseBinId: string;
    courseBinDisplayName: string;
  }[];
};

type RawAnalyticsContextResponse = {
  mode: string;
  rubricId: string;
  rubricVersionId?: string | null;
  contexts?: LocalLeaderAnalyticsContextRow[];
  groups?: ProjectLeadAnalyticsContextGroup[];
};

export type UseFetchRubricAnalyticsContextResult = {
  mode: string | null;
  rubricVersionIdForProjectLead: string | null;
  localLeaderContexts: LocalLeaderAnalyticsContextRow[];
  projectLeadGroups: ProjectLeadAnalyticsContextGroup[];
  isLoading: boolean;
  hasError: boolean;
};

export function useFetchRubricAnalyticsContext(
  rubricId: string
): UseFetchRubricAnalyticsContextResult {
  const [mode, setMode] = useState<string | null>(null);
  const [rubricVersionIdForProjectLead, setRubricVersionIdForProjectLead] = useState<string | null>(
    null
  );
  const [localLeaderContexts, setLocalLeaderContexts] = useState<LocalLeaderAnalyticsContextRow[]>(
    []
  );
  const [projectLeadGroups, setProjectLeadGroups] = useState<ProjectLeadAnalyticsContextGroup[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!rubricId) {
      setMode(null);
      setRubricVersionIdForProjectLead(null);
      setLocalLeaderContexts([]);
      setProjectLeadGroups([]);
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
        const params = new URLSearchParams({ rubricId });
        const response = await fetch(
          `${backendUrl}/rubrics/analytics-context?${params.toString()}`,
          {
            credentials: 'include',
          }
        );
        if (!response.ok) {
          if (isMounted) {
            setHasError(true);
          }
          return;
        }
        const data = (await response.json()) as RawAnalyticsContextResponse;
        if (!isMounted) return;

        setMode(data.mode ?? null);
        setRubricVersionIdForProjectLead(data.rubricVersionId ?? null);
        setLocalLeaderContexts(data.contexts ?? []);
        setProjectLeadGroups(data.groups ?? []);
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
  }, [rubricId]);

  return {
    mode,
    rubricVersionIdForProjectLead,
    localLeaderContexts,
    projectLeadGroups,
    isLoading,
    hasError,
  };
}
