// @vitest-environment jsdom
import type { ReactNode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ManageRubricAssignments from '../ManageRubricAssignments';

const mockRefetchMatrix = vi.fn();

vi.mock('@utils/hooks/rubrics/useFetchAssignmentMatrix', () => ({
  useFetchAssignmentMatrix: () => ({
    matrix: {
      rubrics: [
        {
          id: 'rubric-1',
          title: 'Project EMBER — Rubric 1: Student Success Data',
          rubricNumber: 1,
        },
      ],
      users: [
        {
          id: 'user-1',
          name: 'Alice Example',
          email: 'alice@example.com',
          role: 'USER',
        },
      ],
      assignments: [
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
          status: 'COMPLETED',
        },
      ],
    },
    isLoadingMatrix: false,
    hasMatrixError: false,
    refetchMatrix: mockRefetchMatrix,
  }),
}));

vi.mock('@utils/hooks/rubrics/executeUnassignRubric', () => ({
  executeUnassignRubric: vi.fn(async () => ({
    isSuccess: true,
    message: 'Rubric unassigned successfully',
  })),
}));

vi.mock('../../../../Middleware/auth', () => ({
  LocalLeaderAuthGuard: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('ManageRubricAssignments', () => {
  beforeEach(() => {
    mockRefetchMatrix.mockClear();
  });

  it('renders the assignment matrix and opens the cell dialog', () => {
    render(
      <MemoryRouter>
        <ManageRubricAssignments />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /manage rubric assignments/i })).toBeTruthy();
    expect(screen.getByText('Alice Example')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByText('Alice Example — Rubric 1')).toBeTruthy();
    expect(screen.getByText('General')).toBeTruthy();
    expect(screen.getByText('Calc I')).toBeTruthy();
  });

  it('shows Unassign only for assigned or in-progress rows', () => {
    render(
      <MemoryRouter>
        <ManageRubricAssignments />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getAllByRole('button', { name: 'Unassign' })).toHaveLength(1);
  });

  it('prompts for confirmation before unassigning', async () => {
    render(
      <MemoryRouter>
        <ManageRubricAssignments />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Unassign' }));

    expect(screen.getByRole('heading', { name: /unassign rubric/i })).toBeTruthy();
    expect(screen.getByText(/draft work will remain in the system/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Unassign' }));

    await waitFor(() => {
      expect(mockRefetchMatrix).toHaveBeenCalled();
    });
  });
});
