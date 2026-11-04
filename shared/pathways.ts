export const GENERAL_PATHWAY_ID = "30000000-0000-0000-0000-000000000001";
export const STATISTICS_PATHWAY_ID = "30000000-0000-0000-0000-000000000002";
export const QUANTITATIVE_REASONING_PATHWAY_ID = "30000000-0000-0000-0000-000000000003";
export const STEM_PATHWAY_ID = "30000000-0000-0000-0000-000000000004";
export const TEACHER_PREPARATION_PATHWAY_ID = "30000000-0000-0000-0000-000000000005";

export const PATHWAY_GENERAL_KEY = "__general__";

export type PathwayDefinition = {
  id: string;
  name: string;
  sortOrder: number;
};

export const PATHWAYS: readonly PathwayDefinition[] = [
  { id: GENERAL_PATHWAY_ID, name: "General", sortOrder: 0 },
  { id: STATISTICS_PATHWAY_ID, name: "Statistics", sortOrder: 1 },
  { id: QUANTITATIVE_REASONING_PATHWAY_ID, name: "Quantitative Reasoning", sortOrder: 2 },
  { id: STEM_PATHWAY_ID, name: "STEM", sortOrder: 3 },
  { id: TEACHER_PREPARATION_PATHWAY_ID, name: "Teacher Preparation", sortOrder: 4 },
];

const PATHWAY_IDS = new Set(PATHWAYS.map((pathway) => pathway.id));

export function isPathwayId(value: string): boolean {
  return PATHWAY_IDS.has(value);
}

export function isGeneralPathwayId(pathwayId: string): boolean {
  return pathwayId === GENERAL_PATHWAY_ID;
}

/** Missing, blank, or the legacy general token become the General pathway. */
export function resolvePathwayId(value: unknown): string {
  if (typeof value !== "string") {
    return GENERAL_PATHWAY_ID;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed === PATHWAY_GENERAL_KEY) {
    return GENERAL_PATHWAY_ID;
  }
  return trimmed;
}

export function ensureGeneralPathwayId(pathwayIds: readonly string[]): string[] {
  const uniqueIds = [...new Set(pathwayIds.filter((pathwayId) => isPathwayId(pathwayId)))];
  if (!uniqueIds.includes(GENERAL_PATHWAY_ID)) {
    uniqueIds.unshift(GENERAL_PATHWAY_ID);
  }
  return uniqueIds;
}
