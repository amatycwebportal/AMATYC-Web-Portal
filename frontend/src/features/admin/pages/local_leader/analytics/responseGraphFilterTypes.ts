/** Section: all sections in the rubric, uncategorized scales, or a named section string. */
export const RESPONSE_FILTER_ALL_SECTIONS = '__all_sections__';

/** Scale: all scales in the current section scope, or a specific scale id. */
export const RESPONSE_FILTER_ALL_SCALES = '__all_scales__';

/** Scales with no `section` set are grouped under this key internally. */
export const RESPONSE_FILTER_UNCATEGORIZED = '__uncategorized__';

export type ResponseGraphFilterValue = {
  rubricId: string;
  sectionKey: string;
  scaleId: string;
  /** Rubric version row IDs to include. Empty = all versions of the selected rubric. */
  rubricVersionIds: string[];
};

export function createInitialResponseGraphFilter(): ResponseGraphFilterValue {
  return {
    rubricId: '',
    sectionKey: RESPONSE_FILTER_ALL_SECTIONS,
    scaleId: RESPONSE_FILTER_ALL_SCALES,
    rubricVersionIds: [],
  };
}
