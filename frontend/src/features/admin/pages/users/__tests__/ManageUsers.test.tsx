// @vitest-environment jsdom
import type { ReactNode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '@shared/types';
import ManageUsers from '../ManageUsers';

const mockUser: User = {
  id: 'editor-1',
  googleId: 'g-editor',
  name: 'Editor',
  email: 'editor@example.com',
  role: 'PROJECT_LEAD',
  institutionId: 'inst-1',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockTarget: User = {
  id: 'target-1',
  googleId: 'g-target',
  name: 'Target User',
  email: 'target@example.com',
  role: 'USER',
  institutionId: 'inst-1',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

vi.mock('@utils/hooks/auth/useFetchUser', () => ({
  useFetchUser: () => ({
    user: mockUser,
    isLoadingUser: false,
    hasUserError: false,
  }),
}));

const refetchUsers = vi.fn();

vi.mock('@utils/hooks/users/useFetchAllUsers', () => ({
  useFetchAllUsers: () => ({
    users: [mockTarget],
    isLoadingUsers: false,
    hasUsersError: false,
    refetchUsers,
  }),
}));

vi.mock('@utils/hooks/institutions/useFetchInstitutions', () => ({
  formatInstitutionLabel: (institution: { name: string }) => institution.name,
  useFetchInstitutions: () => ({
    institutions: [{ id: 'inst-1', name: 'Test Institution' }],
    isLoadingInstitutions: false,
    hasInstitutionsError: false,
  }),
}));

vi.mock('../../../Middleware/auth', () => ({
  AdminAuthGuard: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('ManageUsers', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:4000');
    refetchUsers.mockClear();
    mockUser.role = 'PROJECT_LEAD';
    mockTarget.role = 'USER';
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    delete (globalThis as unknown as { fetch?: unknown }).fetch;
  });

  it('renders user row and submits patch when saving edit dialog', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ...mockTarget, name: 'New Name' }),
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    render(
      <MemoryRouter>
        <ManageUsers />
      </MemoryRouter>
    );

    expect(screen.getByText('Target User')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    const nameField = await screen.findByLabelText(/^Name/);
    fireEvent.change(nameField, { target: { value: 'New Name' } });

    fireEvent.click(screen.getByRole('button', { name: /^Save$/ }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:4000/users/target-1',
        expect.objectContaining({
          method: 'PATCH',
          credentials: 'include',
        })
      );
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toMatchObject({
      name: 'New Name',
      role: 'USER',
      institutionId: 'inst-1',
    });
    expect(refetchUsers).toHaveBeenCalled();
  });

  it('lets a college lead change roles up to college lead', async () => {
    mockUser.role = 'LOCAL_LEADER';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ...mockTarget, role: 'LOCAL_LEADER' }),
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    render(
      <MemoryRouter>
        <ManageUsers />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    fireEvent.mouseDown(await screen.findByLabelText('Role'));
    expect(screen.queryByRole('option', { name: 'Administrator' })).toBeNull();
    fireEvent.click(screen.getByRole('option', { name: 'College lead' }));

    fireEvent.click(screen.getByRole('button', { name: /^Save$/ }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as { role?: string; institutionId?: string };
    expect(body.role).toBe('LOCAL_LEADER');
    expect(body.institutionId).toBeUndefined();
  });

  it('keeps a project lead role locked for another project lead', async () => {
    mockTarget.role = 'PROJECT_LEAD';

    render(
      <MemoryRouter>
        <ManageUsers />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    const roleField = await screen.findByLabelText('Role');
    expect(roleField).toHaveProperty('disabled', true);
    expect(screen.getByText('Administrator roles cannot be changed.')).toBeTruthy();
  });
});
