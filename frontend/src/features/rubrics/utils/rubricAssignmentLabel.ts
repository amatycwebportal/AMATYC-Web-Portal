import type { RubricVersion } from '@shared/types';

const GENERAL_ASSIGNMENT_LABEL = 'General';

export function buildRubricAssignmentContextLabel(rubricVersion: RubricVersion): string {
  if (rubricVersion.isGeneralAssignment || !rubricVersion.courseBinDisplayName) {
    return GENERAL_ASSIGNMENT_LABEL;
  }

  return rubricVersion.courseBinDisplayName;
}

export function buildRubricTitleWithContext(rubricVersion: RubricVersion): string {
  return `${rubricVersion.rubric.title} (${buildRubricAssignmentContextLabel(rubricVersion)})`;
}
