// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { User } from '@shared/types';

const createUser = (id: string, institutionId: string): User => ({
  id,
  googleId: `google-${id}`,
  name: `User ${id}`,
  email: `user-${id}@example.com`,
  role: 'USER',
  institutionId,
  userCourseBins: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
});

describe('useFetchUsersByInstitution', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    delete (globalThis as unknown as { fetch?: unknown }).fetch;
  });

  it('does not fetch when institutionId is empty and returns empty users', async () => {
    vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:4000');
    const fetchMock = vi.fn();
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchUsersByInstitution } = await import('../useFetchUsersByInstitution');

    const { result } = renderHook(() => useFetchUsersByInstitution(''));

    await waitFor(() => expect(result.current.isLoadingUsers).toBe(false));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.users).toEqual([]);
    expect(result.current.hasUsersError).toBe(false);
  });

  it('fetches users for the institution and updates state', async () => {
    const backendUrl = 'http://localhost:4000';
    const institutionId = 'inst-1';
    vi.stubEnv('VITE_BACKEND_URL', backendUrl);

    const mockUsers: User[] = [createUser('1', institutionId), createUser('2', institutionId)];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchUsersByInstitution } = await import('../useFetchUsersByInstitution');

    const { result } = renderHook(() => useFetchUsersByInstitution(institutionId));

    expect(result.current.isLoadingUsers).toBe(true);

    await waitFor(() => expect(result.current.isLoadingUsers).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/users/by-institution/${institutionId}`, {
      credentials: 'include',
    });
    expect(result.current.hasUsersError).toBe(false);
    expect(result.current.users).toEqual(mockUsers);
  });

  it('sets hasUsersError when the response is not ok', async () => {
    const backendUrl = 'http://localhost:4000';
    vi.stubEnv('VITE_BACKEND_URL', backendUrl);

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => [],
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchUsersByInstitution } = await import('../useFetchUsersByInstitution');

    const { result } = renderHook(() => useFetchUsersByInstitution('inst-1'));
    await waitFor(() => expect(result.current.isLoadingUsers).toBe(false));

    expect(result.current.hasUsersError).toBe(true);
    expect(result.current.users).toEqual([]);
  });

  it('sets hasUsersError when VITE_BACKEND_URL is not configured', async () => {
    vi.stubEnv('VITE_BACKEND_URL', '');

    const fetchMock = vi.fn();
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchUsersByInstitution } = await import('../useFetchUsersByInstitution');

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useFetchUsersByInstitution('inst-1'));

    await waitFor(() => expect(result.current.isLoadingUsers).toBe(false));

    expect(errorSpy).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.hasUsersError).toBe(true);
    expect(result.current.users).toEqual([]);
  });

  it('sets hasUsersError when fetch throws', async () => {
    const backendUrl = 'http://localhost:4000';
    vi.stubEnv('VITE_BACKEND_URL', backendUrl);

    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'));
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchUsersByInstitution } = await import('../useFetchUsersByInstitution');

    const { result } = renderHook(() => useFetchUsersByInstitution('inst-1'));
    await waitFor(() => expect(result.current.isLoadingUsers).toBe(false));

    expect(result.current.hasUsersError).toBe(true);
    expect(result.current.users).toEqual([]);
  });
});
