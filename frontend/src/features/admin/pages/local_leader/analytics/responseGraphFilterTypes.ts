/** Section: all sections in the rubric, uncategorized scales, or a named section string. */
export const RESPONSE_FILTER_ALL_SECTIONS = '__all_sections__';

/** Scale: all scales in the current section scope, or a specific scale id. */
export const RESPONSE_FILTER_ALL_SCALES = '__all_scales__';

/** Scales with no `section` set are grouped under this key internally. */
export const RESPONSE_FILTER_UNCATEGORIZED = '__uncategorized__';

/** Matches backend `RESPONSE_EXPORT_GENERAL_CONTEXT_KEY` — responses with no course bin. */
export const RESPONSE_CONTEXT_GENERAL_KEY = '__general__';

/** @deprecated Prefer `RESPONSE_CONTEXT_GENERAL_KEY`; still recognized in saved filter state. */
export const LEGACY_RESPONSE_CONTEXT_GLOBAL_KEY = '__global__';

export type InstitutionResponseContextOption = {
  key: string;
  label: string;
};

export type ResponseGraphFilterValue = {
  rubricId: string;
  sectionKey: string;
  scaleId: string;
  /** Rubric version row IDs to include. Empty = all versions of the selected rubric. */
  rubricVersionIds: string[];
  /**
   * Institution response contexts (general + course bins). `null` = all contexts.
   * A non-null array restricts export/chart data to those keys only; empty = no rows.
   */
  responseContextKeys: string[] | null;
};

export function createInitialResponseGraphFilter(): ResponseGraphFilterValue {
  return {
    rubricId: '',
    sectionKey: RESPONSE_FILTER_ALL_SECTIONS,
    scaleId: RESPONSE_FILTER_ALL_SCALES,
    rubricVersionIds: [],
    responseContextKeys: null,
  };
}
