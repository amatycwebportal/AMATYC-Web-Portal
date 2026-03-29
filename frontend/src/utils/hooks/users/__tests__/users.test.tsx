// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { User } from '@shared/types';

const createUser = (id: string): User => ({
  id,
  googleId: `google-${id}`,
  name: `User ${id}`,
  email: `user-${id}@example.com`,
  role: 'USER',
  userCourseBins: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
});

describe('useFetchAllUsers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    delete (globalThis as unknown as { fetch?: unknown }).fetch;
  });

  it('fetches users successfully and updates state', async () => {
    const backendUrl = 'http://localhost:4000';
    vi.stubEnv('VITE_BACKEND_URL', backendUrl);

    const mockUsers: User[] = [createUser('1'), createUser('2')];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllUsers } = await import('../useFetchAllUsers');

    const { result } = renderHook(() => useFetchAllUsers());
    expect(result.current.isLoadingUsers).toBe(true);
    expect(result.current.hasUsersError).toBe(false);
    expect(result.current.users).toEqual([]);
    expect(typeof result.current.refetchUsers).toBe('function');

    await waitFor(() => expect(result.current.isLoadingUsers).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/users/all`, {
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
    const { useFetchAllUsers } = await import('../useFetchAllUsers');

    const { result } = renderHook(() => useFetchAllUsers());
    await waitFor(() => expect(result.current.isLoadingUsers).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/users/all`, {
      credentials: 'include',
    });
    expect(result.current.hasUsersError).toBe(true);
    expect(result.current.users).toEqual([]);
  });

  it('sets hasUsersError and avoids fetching when VITE_BACKEND_URL is not configured', async () => {
    vi.stubEnv('VITE_BACKEND_URL', '');

    const fetchMock = vi.fn();
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllUsers } = await import('../useFetchAllUsers');

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useFetchAllUsers());

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
    const { useFetchAllUsers } = await import('../useFetchAllUsers');

    const { result } = renderHook(() => useFetchAllUsers());
    await waitFor(() => expect(result.current.isLoadingUsers).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/users/all`, {
      credentials: 'include',
    });
    expect(result.current.hasUsersError).toBe(true);
    expect(result.current.users).toEqual([]);
  });
});
