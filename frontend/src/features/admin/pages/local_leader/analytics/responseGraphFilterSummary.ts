import type { Rubric, RubricScale } from '@shared/types';
import {
  RESPONSE_FILTER_ALL_SCALES,
  RESPONSE_FILTER_ALL_SECTIONS,
  RESPONSE_FILTER_UNCATEGORIZED,
  type ResponseGraphFilterValue,
} from './responseGraphFilterTypes';

function normalizeSectionKey(scale: RubricScale): string {
  const raw = (scale.section ?? '').trim();
  return raw === '' ? RESPONSE_FILTER_UNCATEGORIZED : raw;
}

export function collectSectionKeys(scales: RubricScale[]): string[] {
  const unique = new Set<string>();
  for (const scale of scales) {
    unique.add(normalizeSectionKey(scale));
  }
  return [...unique].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

export function formatSectionMenuLabel(sectionKey: string): string {
  if (sectionKey === RESPONSE_FILTER_UNCATEGORIZED) {
    return 'Uncategorized';
  }
  return sectionKey;
}

export function filterScalesBySection(scales: RubricScale[], sectionKey: string): RubricScale[] {
  if (sectionKey === RESPONSE_FILTER_ALL_SECTIONS) {
    return [...scales].sort((a, b) => a.orderIndex - b.orderIndex);
  }
  return scales
    .filter((scale) => normalizeSectionKey(scale) === sectionKey)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

export function buildResponseFilterSummaryLines(
  rubrics: Rubric[],
  value: ResponseGraphFilterValue
): string[] {
  if (!value.rubricId) {
    return ['Select a rubric to filter response charts.'];
  }
  const rubric = rubrics.find((r) => r.id === value.rubricId);
  if (!rubric) {
    return ['Rubric not found.'];
  }

  const lines: string[] = [`Rubric: ${rubric.title}`];

  if (rubric.versions.length > 1) {
    if (value.rubricVersionIds.length === 0) {
      lines.push('Versions: All time (all versions)');
    } else {
      const labels = [...value.rubricVersionIds]
        .map((id) => rubric.versions.find((v) => v.id === id))
        .filter(Boolean)
        .sort((a, b) => (a!.versionNum ?? 0) - (b!.versionNum ?? 0))
        .map((v) => `v${v!.versionNum}`);
      lines.push(`Versions: ${labels.length > 0 ? labels.join(', ') : 'none matched'}`);
    }
  }

  const sectionLabel =
    value.sectionKey === RESPONSE_FILTER_ALL_SECTIONS
      ? 'All sections'
      : formatSectionMenuLabel(value.sectionKey);
  lines.push(`Section: ${sectionLabel}`);

  if (value.scaleId === RESPONSE_FILTER_ALL_SCALES) {
    lines.push('Scale: All scales in scope');
  } else {
    const scale = rubric.scales.find((s) => s.id === value.scaleId);
    if (scale) {
      const shortPrompt =
        scale.prompt.length > 100 ? `${scale.prompt.slice(0, 97)}…` : scale.prompt;
      lines.push(`Scale: ${shortPrompt}`);
    } else {
      lines.push('Scale: not found');
    }
  }

  return lines;
}
