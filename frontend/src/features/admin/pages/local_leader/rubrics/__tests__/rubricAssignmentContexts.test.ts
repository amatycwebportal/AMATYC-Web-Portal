import { describe, expect, it } from 'vitest';
import type { User } from '@shared/types';
import {
  buildDefaultUserContextSelection,
  buildPerUserContextAssignments,
  buildUserContextByUserId,
  DEFAULT_USER_CONTEXT_SELECTION,
  resolveMatchingCourseBinIds,
} from '../rubricAssignmentContexts';

function createUser(args: { id: string; courseBinIds?: string[] }): User {
  return {
    id: args.id,
    googleId: `google-${args.id}`,
    name: `User ${args.id}`,
    email: `${args.id}@example.com`,
    role: 'USER',
    institutionId: 'inst-1',
    userCourseBins: (args.courseBinIds ?? []).map((courseBinId) => ({ courseBinId })),
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };
}

describe('rubricAssignmentContexts', () => {
  it('defaults to general when filtering by user name only', () => {
    const user = createUser({ id: 'user-1', courseBinIds: ['bin-a'] });

    expect(
      buildDefaultUserContextSelection({
        user,
        filterModes: new Set(['user']),
        selectedCourseBinIds: [],
        selectedUserIds: ['user-1'],
      })
    ).toEqual(DEFAULT_USER_CONTEXT_SELECTION);
  });

  it('defaults to course-bin-only when filtering by course bin only', () => {
    const user = createUser({ id: 'user-1', courseBinIds: ['bin-a', 'bin-b'] });

    expect(
      buildDefaultUserContextSelection({
        user,
        filterModes: new Set(['coursebin']),
        selectedCourseBinIds: ['bin-a'],
        selectedUserIds: [],
      })
    ).toEqual({
      includeGeneral: false,
      courseBinIds: ['bin-a'],
    });
  });

  it('defaults to general when a user is selected by both name and course bin', () => {
    const user = createUser({ id: 'user-1', courseBinIds: ['bin-a'] });

    expect(
      buildDefaultUserContextSelection({
        user,
        filterModes: new Set(['user', 'coursebin']),
        selectedCourseBinIds: ['bin-a'],
        selectedUserIds: ['user-1'],
      })
    ).toEqual(DEFAULT_USER_CONTEXT_SELECTION);
  });

  it('assigns only matching bins for course-bin-filtered users', () => {
    const user = createUser({ id: 'user-1', courseBinIds: ['bin-a', 'bin-b'] });

    expect(
      resolveMatchingCourseBinIds({
        user,
        selectedCourseBinIds: ['bin-a', 'bin-c'],
      })
    ).toEqual(['bin-a']);
  });

  it('builds per-user assignment rows without general when course bin context is selected', () => {
    const user = createUser({ id: 'user-1', courseBinIds: ['bin-a'] });

    expect(
      buildPerUserContextAssignments({
        users: [user],
        rubricIds: ['rubric-1', 'rubric-2'],
        userContextByUserId: {
          'user-1': {
            includeGeneral: false,
            courseBinIds: ['bin-a'],
          },
        },
      })
    ).toEqual([
      {
        userId: 'user-1',
        rubricId: 'rubric-1',
        includeGeneral: false,
        courseBinIds: ['bin-a'],
      },
      {
        userId: 'user-1',
        rubricId: 'rubric-2',
        includeGeneral: false,
        courseBinIds: ['bin-a'],
      },
    ]);
  });

  it('recomputes auto contexts when selected course bins change', () => {
    const user = createUser({ id: 'user-1', courseBinIds: ['bin-a', 'bin-b'] });

    const firstPass = buildUserContextByUserId({
      affectedUsers: [user],
      filterModes: new Set(['coursebin']),
      selectedCourseBinIds: ['bin-a'],
      selectedUserIds: [],
      previousContexts: {},
      manuallyEditedUserIds: new Set(),
    });

    const secondPass = buildUserContextByUserId({
      affectedUsers: [user],
      filterModes: new Set(['coursebin']),
      selectedCourseBinIds: ['bin-b'],
      selectedUserIds: [],
      previousContexts: firstPass,
      manuallyEditedUserIds: new Set(),
    });

    expect(firstPass['user-1']).toEqual({
      includeGeneral: false,
      courseBinIds: ['bin-a'],
    });
    expect(secondPass['user-1']).toEqual({
      includeGeneral: false,
      courseBinIds: ['bin-b'],
    });
  });

  it('preserves manually edited contexts when filters change', () => {
    const user = createUser({ id: 'user-1', courseBinIds: ['bin-a', 'bin-b'] });
    const manualSelection = {
      includeGeneral: true,
      courseBinIds: ['bin-b'],
    };

    expect(
      buildUserContextByUserId({
        affectedUsers: [user],
        filterModes: new Set(['coursebin']),
        selectedCourseBinIds: ['bin-a'],
        selectedUserIds: [],
        previousContexts: {
          'user-1': manualSelection,
        },
        manuallyEditedUserIds: new Set(['user-1']),
      })
    ).toEqual({
      'user-1': manualSelection,
    });
  });
});
