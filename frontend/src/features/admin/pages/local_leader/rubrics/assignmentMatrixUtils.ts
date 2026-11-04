import type { AssignmentMatrixEntry } from '@shared/types';

export function buildAssignmentCellKey(userId: string, rubricId: string): string {
  return `${userId}:${rubricId}`;
}

export function buildCountMap(assignments: AssignmentMatrixEntry[]): Map<string, number> {
  const countMap = new Map<string, number>();
  for (const assignment of assignments) {
    const key = buildAssignmentCellKey(assignment.userId, assignment.rubricId);
    countMap.set(key, (countMap.get(key) ?? 0) + 1);
  }
  return countMap;
}

export function filterAssignmentsForCell(
  userId: string,
  rubricId: string,
  assignments: AssignmentMatrixEntry[]
): AssignmentMatrixEntry[] {
  return assignments.filter(
    (assignment) => assignment.userId === userId && assignment.rubricId === rubricId
  );
}

export function buildAssignmentContextLabel(assignment: AssignmentMatrixEntry): string {
  if (assignment.isGeneralPathway || !assignment.pathwayName) {
    return 'General';
  }
  return assignment.pathwayName;
}

export function formatAssignmentStatusLabel(status: AssignmentMatrixEntry['status']): string {
  if (status === 'ASSIGNED') {
    return 'Assigned';
  }
  if (status === 'IN_PROGRESS') {
    return 'In progress';
  }
  return 'Submitted';
}

export function canUnassignAssignment(status: AssignmentMatrixEntry['status']): boolean {
  return status === 'ASSIGNED' || status === 'IN_PROGRESS';
}
