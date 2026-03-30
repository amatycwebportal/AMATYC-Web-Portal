import type { RubricLevelDescription } from '@shared/types';

/** One bar: rubric level (numeric score) and how many responses selected it. */
export interface ScaleHistogramBin {
  level: number;
  count: number;
  /** Label for the category axis (from level descriptions or a fallback). */
  label: string;
}

export interface ScaleDistributionHistogramProps {
  /** Shown above the chart. */
  title?: string;
  /** Scale question text; used for accessibility and optional subtitle. */
  scalePrompt?: string;
  /** Pre-computed bins (counts per rubric level). */
  bins: ScaleHistogramBin[];
  /** Total height of the chart SVG in pixels. */
  height?: number;
  /** Y-axis label (frequency). */
  countAxisLabel?: string;
  /** X-axis label (levels / rubric scale). */
  levelAxisLabel?: string;
  /** Legend / series label for the bar series. */
  seriesLabel?: string;
}

/** Minimal scale shape for building bins from raw scores. */
export type ScaleLevelDefinition = {
  levelDescriptions?: Record<number, RubricLevelDescription> | null;
};
