import type { RubricVersion } from '@shared/types';

const GLOBAL_ASSIGNMENT_LABEL = 'Global';

function buildAssignmentContextLabelFromRubricVersion(rubricVersion: RubricVersion): string {
  if (rubricVersion.isGlobalAssignment || !rubricVersion.courseBinDisplayName) {
    return GLOBAL_ASSIGNMENT_LABEL;
  }

  return rubricVersion.courseBinDisplayName;
}

export function buildWorkingRubricPathFromRubricVersion(rubricVersion: RubricVersion): string {
  const query = new URLSearchParams({
    assignmentContext: buildAssignmentContextLabelFromRubricVersion(rubricVersion),
  });
  if (rubricVersion.courseBinId) {
    query.set('courseBinId', rubricVersion.courseBinId);
  }
  return `/rubrics/${rubricVersion.id}/working?${query.toString()}`;
}

export function buildWorkingRubricPathFromContext(args: {
  rubricVersionId: string;
  assignmentContextLabel: string;
  courseBinId?: string | null;
}): string {
  const query = new URLSearchParams({
    assignmentContext: args.assignmentContextLabel,
  });
  if (args.courseBinId) {
    query.set('courseBinId', args.courseBinId);
  }
  return `/rubrics/${args.rubricVersionId}/working?${query.toString()}`;
}
