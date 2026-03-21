// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Rubric } from '@shared/types';

const createRubric = (id: string): Rubric => ({
  id,
  title: `Title ${id}`,
  description: `Description ${id}`,
  active: true,
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

describe('useFetchAllRubrics', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (process.env as Record<string, string | undefined>).VITE_BACKEND_URL;
    delete (globalThis as unknown as { fetch?: unknown }).fetch;
  });

  it('fetches rubrics successfully and updates state', async () => {
    const backendUrl = 'http://localhost:4000';
    process.env.VITE_BACKEND_URL = backendUrl;

    const mockRubrics: Rubric[] = [createRubric('1'), createRubric('2')];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRubrics,
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

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

  it('sets hasRubricsError when the response is not ok', async () => {
    const backendUrl = 'http://localhost:4000';
    process.env.VITE_BACKEND_URL = backendUrl;

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => [],
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllRubrics } = await import('../useFetchAllRubrics');

    const { result } = renderHook(() => useFetchAllRubrics());
    await waitFor(() => expect(result.current.isLoadingRubrics).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/rubrics/all`, {
      credentials: 'include',
    });
    expect(result.current.hasRubricsError).toBe(true);
    expect(result.current.rubrics).toEqual([]);
  });

  it('sets hasRubricsError and avoids fetching when VITE_BACKEND_URL is not configured', async () => {
    const fetchMock = vi.fn();
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllRubrics } = await import('../useFetchAllRubrics');

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useFetchAllRubrics());

    await waitFor(() => expect(result.current.isLoadingRubrics).toBe(false));

    expect(errorSpy).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.hasRubricsError).toBe(true);
    expect(result.current.rubrics).toEqual([]);
  });

  it('sets hasRubricsError when fetch throws', async () => {
    const backendUrl = 'http://localhost:4000';
    process.env.VITE_BACKEND_URL = backendUrl;

    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'));
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllRubrics } = await import('../useFetchAllRubrics');

    const { result } = renderHook(() => useFetchAllRubrics());
    await waitFor(() => expect(result.current.isLoadingRubrics).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/rubrics/all`, {
      credentials: 'include',
    });
    expect(result.current.hasRubricsError).toBe(true);
    expect(result.current.rubrics).toEqual([]);
  });

  it('fetches assigned rubrics successfully and updates state', async () => {
    const backendUrl = 'http://localhost:4000';
    process.env.VITE_BACKEND_URL = backendUrl;

    const mockRubrics: Rubric[] = [createRubric('1'), createRubric('2')];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRubrics,
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAssignedRubrics } = await import('../useFetchAssignedRubrics');

    const { result } = renderHook(() => useFetchAssignedRubrics('1'));
    expect(result.current.isLoadingRubrics).toBe(true);
    expect(result.current.hasRubricsError).toBe(false);
    expect(result.current.rubrics).toEqual([]);

    await waitFor(() => expect(result.current.isLoadingRubrics).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/rubrics/assigned/1`, {
      credentials: 'include',
    });
    expect(result.current.hasRubricsError).toBe(false);
    expect(result.current.rubrics).toEqual(mockRubrics);
  });

  it('sets hasRubricsError when the response is not ok', async () => {
    const backendUrl = 'http://localhost:4000';
    process.env.VITE_BACKEND_URL = backendUrl;

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => [],
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAssignedRubrics } = await import('../useFetchAssignedRubrics');

    const { result } = renderHook(() => useFetchAssignedRubrics('1'));
    await waitFor(() => expect(result.current.isLoadingRubrics).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/rubrics/assigned/1`, {
      credentials: 'include',
    });
    expect(result.current.hasRubricsError).toBe(true);
    expect(result.current.rubrics).toEqual([]);
  });

  it('sets hasRubricsError and avoids fetching when VITE_BACKEND_URL is not configured', async () => {
    const fetchMock = vi.fn();
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAssignedRubrics } = await import('../useFetchAssignedRubrics');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useFetchAssignedRubrics('1'));
    await waitFor(() => expect(result.current.isLoadingRubrics).toBe(false));
    expect(errorSpy).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.hasRubricsError).toBe(true);
    expect(result.current.rubrics).toEqual([]);
  });
});
