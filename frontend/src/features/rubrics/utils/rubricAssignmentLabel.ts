import type { RubricVersion } from '@shared/types';

const GLOBAL_ASSIGNMENT_LABEL = 'Global';

export function buildRubricAssignmentContextLabel(rubricVersion: RubricVersion): string {
  if (rubricVersion.isGlobalAssignment || !rubricVersion.courseBinDisplayName) {
    return GLOBAL_ASSIGNMENT_LABEL;
  }

  return rubricVersion.courseBinDisplayName;
}

export function buildRubricTitleWithContext(rubricVersion: RubricVersion): string {
  return `${rubricVersion.rubric.title} (${buildRubricAssignmentContextLabel(rubricVersion)})`;
}
