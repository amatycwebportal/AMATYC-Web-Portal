import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ResponseGraphFilterValue } from './responseGraphFilterTypes';

export type DataDomainTab = 'users' | 'responses';

export type AnalyticsGraphId =
  | 'users-overview'
  | 'users-courses'
  | 'responses-throughput'
  | 'responses-distribution';

export type AnalyticsCarouselSlot = {
  instanceId: string;
  graphId: AnalyticsGraphId;
  /** Snapshot from when the chart was minimized; `null` for user-domain charts. */
  responseFilterSnapshot: ResponseGraphFilterValue | null;
};

function createCarouselSlot(
  graphId: AnalyticsGraphId,
  responseFilterSnapshot: ResponseGraphFilterValue | null
): AnalyticsCarouselSlot {
  return {
    instanceId: crypto.randomUUID(),
    graphId,
    responseFilterSnapshot,
  };
}

export const ANALYTICS_GRAPH_META: Record<
  AnalyticsGraphId,
  { title: string; description: string }
> = {
  'users-overview': {
    title: 'Users overview',
    description: 'Headcount and role mix for your institution.',
  },
  'users-courses': {
    title: 'Users by course bin',
    description: 'Distribution of users across your institution course bins.',
  },
  'responses-throughput': {
    title: 'Response throughput',
    description: 'Submissions over the selected range (metrics wired later).',
  },
  'responses-distribution': {
    title: 'Score distribution',
    description: 'Histogram of rubric scores (metrics wired later).',
  },
};

const GRAPHS_BY_DOMAIN: Record<DataDomainTab, AnalyticsGraphId[]> = {
  users: ['users-overview', 'users-courses'],
  responses: ['responses-distribution', 'responses-throughput'],
};

export function useGraphIdsForDomain(domain: DataDomainTab): AnalyticsGraphId[] {
  return GRAPHS_BY_DOMAIN[domain];
}

type Workspace = {
  activeGraphId: AnalyticsGraphId | null;
  carouselSlots: AnalyticsCarouselSlot[];
};

function initialWorkspace(domain: DataDomainTab): Workspace {
  const ids = GRAPHS_BY_DOMAIN[domain];
  return {
    activeGraphId: ids[0] ?? null,
    carouselSlots: [],
  };
}

export function useAnalyticsGraphWorkspace(domain: DataDomainTab) {
  const graphIds = useMemo(() => GRAPHS_BY_DOMAIN[domain], [domain]);

  const [workspace, setWorkspace] = useState<Workspace>(() => initialWorkspace(domain));

  useEffect(() => {
    setWorkspace(initialWorkspace(domain));
  }, [domain]);

  /**
   * Push the active chart to the carousel. Multiple entries with the same graph type are allowed
   * (e.g. one score distribution per scale). Pass a snapshot of response filters for response charts.
   */
  const sendActiveToCarousel = useCallback(
    (responseFilterSnapshot: ResponseGraphFilterValue | null) => {
      setWorkspace((previous) => {
        const { activeGraphId, carouselSlots } = previous;
        if (!activeGraphId) {
          return previous;
        }
        const slot = createCarouselSlot(activeGraphId, responseFilterSnapshot);
        return {
          activeGraphId: null,
          carouselSlots: [...carouselSlots, slot],
        };
      });
    },
    []
  );

  /**
   * Promote a carousel slot to the playground; current playground chart is appended to the carousel
   * (with `outgoingResponseFilter` when it was a response chart). Returns the promoted slot so the
   * caller can restore rubric/section/scale controls from `responseFilterSnapshot`.
   */
  const restoreGraphToPlayground = useCallback(
    (
      instanceId: string,
      outgoingResponseFilterSnapshot: ResponseGraphFilterValue | null
    ): AnalyticsCarouselSlot | null => {
      let promotedSlot: AnalyticsCarouselSlot | null = null;
      setWorkspace((previous) => {
        const found = previous.carouselSlots.find((slot) => slot.instanceId === instanceId);
        if (!found) {
          return previous;
        }
        promotedSlot = found;
        const nextCarousel = previous.carouselSlots.filter(
          (slot) => slot.instanceId !== instanceId
        );
        if (previous.activeGraphId) {
          nextCarousel.push(
            createCarouselSlot(previous.activeGraphId, outgoingResponseFilterSnapshot)
          );
        }
        return {
          activeGraphId: found.graphId,
          carouselSlots: nextCarousel,
        };
      });
      return promotedSlot;
    },
    []
  );

  /**
   * Focus a metric chart in the playground. The previous playground chart is sent to the carousel
   * with `outgoingResponseFilterSnapshot` when it was a response chart.
   */
  const focusGraphFromMetrics = useCallback(
    (
      graphId: AnalyticsGraphId,
      outgoingResponseFilterSnapshot: ResponseGraphFilterValue | null
    ) => {
      setWorkspace((previous) => {
        if (previous.activeGraphId === graphId) {
          return previous;
        }
        const nextCarousel = [...previous.carouselSlots];
        if (previous.activeGraphId) {
          nextCarousel.push(
            createCarouselSlot(previous.activeGraphId, outgoingResponseFilterSnapshot)
          );
        }
        return {
          activeGraphId: graphId,
          carouselSlots: nextCarousel,
        };
      });
    },
    []
  );

  const removeCarouselSlot = useCallback((instanceId: string) => {
    setWorkspace((previous) => ({
      ...previous,
      carouselSlots: previous.carouselSlots.filter((slot) => slot.instanceId !== instanceId),
    }));
  }, []);

  return {
    graphIds,
    activeGraphId: workspace.activeGraphId,
    carouselSlots: workspace.carouselSlots,
    sendActiveToCarousel,
    restoreGraphToPlayground,
    focusGraphFromMetrics,
    removeCarouselSlot,
  };
}
