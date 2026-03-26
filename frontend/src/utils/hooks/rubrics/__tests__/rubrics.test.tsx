// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Rubric } from '@shared/types';

const createRubric = (id: string): Rubric => ({
  id,
  title: `Title ${id}`,
  description: `Description ${id}`,
  active: true,
  versions: [{ id: `version-${id}`, versionNum: 1 }],
  scales: [
    {
      id: `scale-${id}`,
      section: 'section',
      prompt: 'prompt',
      orderIndex: 0,
      editable: true,
      isGlobal: true,
      levelDescriptions: {
        1: { label: 'Level 1', description: 'Level 1 description' },
      },
    },
  ],
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  delete (globalThis as any).fetch;
});

describe('useFetchAllRubrics', () => {
  it('fetches rubrics successfully and updates state', async () => {
    const backendUrl = 'http://localhost:4000';
    vi.stubEnv('VITE_BACKEND_URL', backendUrl);

    const mockRubrics: Rubric[] = [createRubric('1'), createRubric('2')];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRubrics,
    });
    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllRubrics } = await import('../useFetchAllRubrics');

    const { result } = renderHook(() => useFetchAllRubrics());

    expect(result.current.isLoadingRubrics).toBe(true);
    expect(result.current.hasRubricsError).toBe(false);
    expect(result.current.rubrics).toEqual([]);

    await waitFor(() => expect(result.current.isLoadingRubrics).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/rubrics/all`, {
      credentials: 'include',
    });
    expect(result.current.hasRubricsError).toBe(false);
    expect(result.current.rubrics).toEqual(mockRubrics);
  });

  it('sets hasRubricsError when response is not ok', async () => {
    const backendUrl = 'http://localhost:4000';
    vi.stubEnv('VITE_BACKEND_URL', backendUrl);

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => [],
    });
    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllRubrics } = await import('../useFetchAllRubrics');

    const { result } = renderHook(() => useFetchAllRubrics());

    await waitFor(() => expect(result.current.isLoadingRubrics).toBe(false));

    expect(fetchMock).toHaveBeenCalled();
    expect(result.current.hasRubricsError).toBe(true);
    expect(result.current.rubrics).toEqual([]);
  });

  it('handles missing backend URL', async () => {
    vi.stubEnv('VITE_BACKEND_URL', '');

    const fetchMock = vi.fn();
    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllRubrics } = await import('../useFetchAllRubrics');

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useFetchAllRubrics());

    await waitFor(() => expect(result.current.isLoadingRubrics).toBe(false));

    expect(errorSpy).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.hasRubricsError).toBe(true);
  });

  it('handles fetch throwing error', async () => {
    const backendUrl = 'http://localhost:4000';
    vi.stubEnv('VITE_BACKEND_URL', backendUrl);

    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'));
    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllRubrics } = await import('../useFetchAllRubrics');

    const { result } = renderHook(() => useFetchAllRubrics());

    await waitFor(() => expect(result.current.isLoadingRubrics).toBe(false));

    expect(fetchMock).toHaveBeenCalled();
    expect(result.current.hasRubricsError).toBe(true);
    expect(result.current.rubrics).toEqual([]);
  });
});

describe('useFetchAssignedRubrics', () => {
  it('fetches assigned rubrics successfully', async () => {
    const backendUrl = 'http://localhost:4000';
    vi.stubEnv('VITE_BACKEND_URL', backendUrl);

    const mockRubrics: Rubric[] = [createRubric('1')];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRubrics,
    });
    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAssignedRubrics } = await import('../useFetchAssignedRubrics');

    const { result } = renderHook(() => useFetchAssignedRubrics('1'));

    await waitFor(() => expect(result.current.isLoadingRubrics).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/rubrics/assigned/1`, {
      credentials: 'include',
    });
    expect(result.current.rubrics).toEqual(mockRubrics);
  });

  it('handles missing backend URL', async () => {
    vi.stubEnv('VITE_BACKEND_URL', '');

    const fetchMock = vi.fn();
    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAssignedRubrics } = await import('../useFetchAssignedRubrics');

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useFetchAssignedRubrics('1'));

    await waitFor(() => expect(result.current.isLoadingRubrics).toBe(false));

    expect(errorSpy).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.hasRubricsError).toBe(true);
  });
});

describe('useFetchRubric', () => {
  it('fetches a single rubric successfully', async () => {
    const backendUrl = 'http://localhost:4000';
    vi.stubEnv('VITE_BACKEND_URL', backendUrl);

    const mockRubric = createRubric('r1');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRubric,
    });
    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const { useFetchRubric } = await import('../useFetchRubric');

    const { result } = renderHook(() => useFetchRubric('r1'));

    await waitFor(() => expect(result.current.isLoadingRubric).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/rubrics/r1`, {
      credentials: 'include',
    });
    expect(result.current.rubric).toEqual(mockRubric);
  });

  it('handles fetch error', async () => {
    const backendUrl = 'http://localhost:4000';
    vi.stubEnv('VITE_BACKEND_URL', backendUrl);

    const fetchMock = vi.fn().mockRejectedValue(new Error());
    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const { useFetchRubric } = await import('../useFetchRubric');

    const { result } = renderHook(() => useFetchRubric('r1'));

    await waitFor(() => expect(result.current.isLoadingRubric).toBe(false));

    expect(result.current.hasRubricError).toBe(true);
  });

  it('refetch works correctly', async () => {
    const backendUrl = 'http://localhost:4000';
    vi.stubEnv('VITE_BACKEND_URL', backendUrl);

    const mockRubric = createRubric('r1');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRubric,
    });
    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const { useFetchRubric } = await import('../useFetchRubric');

    const { result } = renderHook(() => useFetchRubric('r1'));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    result.current.refetchRubric();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });
});
