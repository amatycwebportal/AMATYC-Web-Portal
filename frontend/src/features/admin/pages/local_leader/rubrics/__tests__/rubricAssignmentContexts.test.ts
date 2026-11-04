import { describe, expect, it } from 'vitest';
import { GENERAL_PATHWAY_ID, STATISTICS_PATHWAY_ID } from '@shared/pathways';
import type { User } from '@shared/types';
import {
  buildDefaultUserContextSelection,
  buildPerUserContextAssignments,
  buildUserContextByUserId,
  DEFAULT_USER_CONTEXT_SELECTION,
} from '../rubricAssignmentContexts';

function createUser(id: string): User {
  return {
    id,
    googleId: `google-${id}`,
    name: `User ${id}`,
    email: `${id}@example.com`,
    role: 'USER',
    institutionId: 'inst-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };
}

describe('rubricAssignmentContexts', () => {
  it('defaults each user to the General pathway', () => {
    expect(buildDefaultUserContextSelection()).toEqual(DEFAULT_USER_CONTEXT_SELECTION);
    expect(DEFAULT_USER_CONTEXT_SELECTION.pathwayIds).toEqual([GENERAL_PATHWAY_ID]);
  });

  it('keeps a manually edited pathway selection', () => {
    const user = createUser('user-1');
    const edited = { pathwayIds: [GENERAL_PATHWAY_ID, STATISTICS_PATHWAY_ID] };

    expect(
      buildUserContextByUserId({
        affectedUsers: [user],
        previousContexts: { 'user-1': edited },
        manuallyEditedUserIds: new Set(['user-1']),
      })
    ).toEqual({ 'user-1': edited });
  });

  it('builds per-user assignment rows for each selected rubric', () => {
    const user = createUser('user-1');

    expect(
      buildPerUserContextAssignments({
        users: [user],
        rubricIds: ['rubric-1'],
        userContextByUserId: {
          'user-1': { pathwayIds: [STATISTICS_PATHWAY_ID] },
        },
      })
    ).toEqual([
      {
        userId: 'user-1',
        rubricId: 'rubric-1',
        includeGeneral: false,
        pathwayIds: [STATISTICS_PATHWAY_ID],
      },
    ]);
  });
});
