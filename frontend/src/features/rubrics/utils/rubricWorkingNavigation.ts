import type { RubricVersion } from '@shared/types';
import { GENERAL_PATHWAY_ID } from '@shared/pathways';

const GENERAL_ASSIGNMENT_LABEL = 'General';

function buildAssignmentContextLabelFromRubricVersion(rubricVersion: RubricVersion): string {
  if (rubricVersion.isGeneralPathway || !rubricVersion.pathwayName) {
    return GENERAL_ASSIGNMENT_LABEL;
  }

  return rubricVersion.pathwayName;
}

export function buildWorkingRubricPathFromRubricVersion(rubricVersion: RubricVersion): string {
  const query = new URLSearchParams({
    assignmentContext: buildAssignmentContextLabelFromRubricVersion(rubricVersion),
    pathwayId: rubricVersion.pathwayId ?? GENERAL_PATHWAY_ID,
  });
  return `/rubrics/${rubricVersion.id}/working?${query.toString()}`;
}

export function buildWorkingRubricPathFromContext(args: {
  rubricVersionId: string;
  assignmentContextLabel: string;
  pathwayId?: string | null;
}): string {
  const query = new URLSearchParams({
    assignmentContext: args.assignmentContextLabel,
    pathwayId: args.pathwayId || GENERAL_PATHWAY_ID,
  });
  return `/rubrics/${args.rubricVersionId}/working?${query.toString()}`;
}
