import { describe, expect, test } from 'vitest';
import type { AssignmentMatrixEntry } from '@shared/types';
import {
  buildCountMap,
  canUnassignAssignment,
  filterAssignmentsForCell,
  formatAssignmentStatusLabel,
} from '../assignmentMatrixUtils';

const sampleAssignments: AssignmentMatrixEntry[] = [
  {
    userId: 'user-1',
    rubricId: 'rubric-1',
    courseBinId: null,
    courseBinDisplayName: null,
    isGeneralAssignment: true,
    status: 'ASSIGNED',
  },
  {
    userId: 'user-1',
    rubricId: 'rubric-1',
    courseBinId: 'bin-1',
    courseBinDisplayName: 'Calc I',
    isGeneralAssignment: false,
    status: 'IN_PROGRESS',
  },
  {
    userId: 'user-1',
    rubricId: 'rubric-2',
    courseBinId: null,
    courseBinDisplayName: null,
    isGeneralAssignment: true,
    status: 'COMPLETED',
  },
];

describe('assignmentMatrixUtils', () => {
  test('buildCountMap counts multiple contexts for the same rubric', () => {
    const countMap = buildCountMap(sampleAssignments);
    expect(countMap.get('user-1:rubric-1')).toBe(2);
    expect(countMap.get('user-1:rubric-2')).toBe(1);
  });

  test('filterAssignmentsForCell returns only matching user and rubric rows', () => {
    const rows = filterAssignmentsForCell('user-1', 'rubric-1', sampleAssignments);
    expect(rows).toHaveLength(2);
  });

  test('formatAssignmentStatusLabel maps completed to Submitted', () => {
    expect(formatAssignmentStatusLabel('COMPLETED')).toBe('Submitted');
  });

  test('canUnassignAssignment allows assigned and in progress only', () => {
    expect(canUnassignAssignment('ASSIGNED')).toBe(true);
    expect(canUnassignAssignment('IN_PROGRESS')).toBe(true);
    expect(canUnassignAssignment('COMPLETED')).toBe(false);
  });
});
