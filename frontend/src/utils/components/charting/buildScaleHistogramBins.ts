import type { RubricLevelDescription } from '@shared/types';
import type { ScaleHistogramBin, ScaleLevelDefinition } from './scaleHistogramTypes';

const DEFAULT_RUBRIC_LEVEL_BINS = [0, 1, 2, 3, 4] as const;

function sortUniqueNumbers(values: readonly number[]): number[] {
  return [...new Set(values)].sort((a, b) => a - b);
}

function resolveOrderedLevels(scale: ScaleLevelDefinition, scores: readonly number[]): number[] {
  const fromDescriptions = scale.levelDescriptions
    ? Object.keys(scale.levelDescriptions)
        .map((key) => Number(key))
        .filter((n) => Number.isFinite(n))
    : [];
  if (fromDescriptions.length > 0) {
    return sortUniqueNumbers(fromDescriptions);
  }
  if (scores.length > 0) {
    return [...DEFAULT_RUBRIC_LEVEL_BINS];
  }
  return [];
}

function formatLevelLabel(
  level: number,
  levelDescriptions: ScaleLevelDefinition['levelDescriptions']
): string {
  const entry = levelDescriptions?.[level];
  if (entry?.label?.trim()) {
    return entry.label.trim();
  }
  return `Level ${level}`;
}

/**
 * Aggregates raw rubric scores into histogram bins using the scale’s level keys
 * (from `levelDescriptions` when present, otherwise distinct values in `scores`).
 */
export function buildScaleHistogramBinsFromScores(
  scores: readonly number[],
  scale: ScaleLevelDefinition
): ScaleHistogramBin[] {
  const levels = resolveOrderedLevels(scale, scores);
  if (levels.length === 0) {
    return [];
  }

  const counts = new Map<number, number>();
  for (const level of levels) {
    counts.set(level, 0);
  }

  const levelSet = new Set(levels);
  for (const score of scores) {
    if (!levelSet.has(score)) {
      continue;
    }
    counts.set(score, (counts.get(score) ?? 0) + 1);
  }

  return levels.map((level) => ({
    level,
    count: counts.get(level) ?? 0,
    label: formatLevelLabel(level, scale.levelDescriptions),
  }));
}

/**
 * Builds bins from an explicit map of level → count (e.g. from an API aggregate).
 * Levels are sorted numerically; labels come from `levelDescriptions` when provided.
 */
export function buildScaleHistogramBinsFromCounts(
  countsByLevel: Readonly<Record<number, number>>,
  levelDescriptions?: Record<number, RubricLevelDescription> | null
): ScaleHistogramBin[] {
  const levels = sortUniqueNumbers(
    Object.keys(countsByLevel)
      .map((key) => Number(key))
      .filter((n) => Number.isFinite(n))
  );
  return levels.map((level) => ({
    level,
    count: countsByLevel[level] ?? 0,
    label: formatLevelLabel(level, levelDescriptions ?? null),
  }));
}
