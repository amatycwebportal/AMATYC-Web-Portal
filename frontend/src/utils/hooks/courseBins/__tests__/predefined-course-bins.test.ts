// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PredefinedCourseBin } from '@shared/types';

const createPredefinedCourseBin = (id: string): PredefinedCourseBin => ({
  id,
  binName: `Predefined bin ${id}`,
});

describe('useFetchAllPredefiendCourseBins', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (process.env as Record<string, string | undefined>).VITE_BACKEND_URL;
    delete (globalThis as unknown as { fetch?: unknown }).fetch;
  });

  it('fetches predefined course bins successfully and updates state', async () => {
    const backendUrl = 'http://localhost:4000';
    process.env.VITE_BACKEND_URL = backendUrl;

    const mockBins: PredefinedCourseBin[] = [
      createPredefinedCourseBin('1'),
      createPredefinedCourseBin('2'),
    ];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockBins,
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllPredefiendCourseBins } = await import('../useFetchAllPredefiendCourseBins');

    const { result } = renderHook(() => useFetchAllPredefiendCourseBins());
    expect(result.current.isLoadingPredefinedCourseBins).toBe(true);
    expect(result.current.hasPredefinedCourseBinsError).toBe(false);
    expect(result.current.predefinedCourseBins).toEqual([]);

    await waitFor(() => expect(result.current.isLoadingPredefinedCourseBins).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/predefined-course-bins/all`, {
      credentials: 'include',
    });
    expect(result.current.hasPredefinedCourseBinsError).toBe(false);
    expect(result.current.predefinedCourseBins).toEqual(mockBins);
  });

  it('sets hasPredefinedCourseBinsError when the response is not ok', async () => {
    const backendUrl = 'http://localhost:4000';
    process.env.VITE_BACKEND_URL = backendUrl;

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => [],
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllPredefiendCourseBins } = await import('../useFetchAllPredefiendCourseBins');

    const { result } = renderHook(() => useFetchAllPredefiendCourseBins());
    await waitFor(() => expect(result.current.isLoadingPredefinedCourseBins).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/predefined-course-bins/all`, {
      credentials: 'include',
    });
    expect(result.current.hasPredefinedCourseBinsError).toBe(true);
    expect(result.current.predefinedCourseBins).toEqual([]);
  });

  it('sets hasPredefinedCourseBinsError and avoids fetching when VITE_BACKEND_URL is not configured', async () => {
    const fetchMock = vi.fn();
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllPredefiendCourseBins } = await import('../useFetchAllPredefiendCourseBins');

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useFetchAllPredefiendCourseBins());

    await waitFor(() => expect(result.current.isLoadingPredefinedCourseBins).toBe(false));

    expect(errorSpy).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.hasPredefinedCourseBinsError).toBe(true);
    expect(result.current.predefinedCourseBins).toEqual([]);
  });

  it('sets hasPredefinedCourseBinsError when fetch throws', async () => {
    const backendUrl = 'http://localhost:4000';
    process.env.VITE_BACKEND_URL = backendUrl;

    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'));
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllPredefiendCourseBins } = await import('../useFetchAllPredefiendCourseBins');

    const { result } = renderHook(() => useFetchAllPredefiendCourseBins());
    await waitFor(() => expect(result.current.isLoadingPredefinedCourseBins).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/predefined-course-bins/all`, {
      credentials: 'include',
    });
    expect(result.current.hasPredefinedCourseBinsError).toBe(true);
    expect(result.current.predefinedCourseBins).toEqual([]);
  });

  it('refetchPredefinedCourseBins triggers another request', async () => {
    const backendUrl = 'http://localhost:4000';
    process.env.VITE_BACKEND_URL = backendUrl;

    const mockBins: PredefinedCourseBin[] = [createPredefinedCourseBin('1')];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockBins,
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllPredefiendCourseBins } = await import('../useFetchAllPredefiendCourseBins');

    const { result } = renderHook(() => useFetchAllPredefiendCourseBins());
    await waitFor(() => expect(result.current.isLoadingPredefinedCourseBins).toBe(false));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    result.current.refetchPredefinedCourseBins();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    expect(fetchMock).toHaveBeenNthCalledWith(2, `${backendUrl}/predefined-course-bins/all`, {
      credentials: 'include',
    });
  });
});
