// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CourseBin } from '@shared/types';

const createCourseBin = (id: string): CourseBin => ({
  id,
  displayName: `Bin ${id}`,
  predefinedBinId: `predefined-${id}`,
  institutionId: `institution-${id}`,
});

describe('useFetchAllCourseBins', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (process.env as Record<string, string | undefined>).VITE_BACKEND_URL;
    delete (globalThis as unknown as { fetch?: unknown }).fetch;
  });

  it('fetches course bins successfully and updates state', async () => {
    const backendUrl = 'http://localhost:4000';
    process.env.VITE_BACKEND_URL = backendUrl;

    const mockCourseBins: CourseBin[] = [createCourseBin('1'), createCourseBin('2')];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockCourseBins,
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllCourseBins } = await import('../useFetchAllCourseBins');

    const { result } = renderHook(() => useFetchAllCourseBins());
    expect(result.current.isLoadingCourseBins).toBe(true);
    expect(result.current.hasCourseBinsError).toBe(false);
    expect(result.current.courseBins).toEqual([]);

    await waitFor(() => expect(result.current.isLoadingCourseBins).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/course-bins/all`, {
      credentials: 'include',
    });
    expect(result.current.hasCourseBinsError).toBe(false);
    expect(result.current.courseBins).toEqual(mockCourseBins);
  });

  it('sets hasCourseBinsError when the response is not ok', async () => {
    const backendUrl = 'http://localhost:4000';
    process.env.VITE_BACKEND_URL = backendUrl;

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => [],
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllCourseBins } = await import('../useFetchAllCourseBins');

    const { result } = renderHook(() => useFetchAllCourseBins());
    await waitFor(() => expect(result.current.isLoadingCourseBins).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/course-bins/all`, {
      credentials: 'include',
    });
    expect(result.current.hasCourseBinsError).toBe(true);
    expect(result.current.courseBins).toEqual([]);
  });

  it('sets hasCourseBinsError and avoids fetching when VITE_BACKEND_URL is not configured', async () => {
    const fetchMock = vi.fn();
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllCourseBins } = await import('../useFetchAllCourseBins');

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useFetchAllCourseBins());

    await waitFor(() => expect(result.current.isLoadingCourseBins).toBe(false));

    expect(errorSpy).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.hasCourseBinsError).toBe(true);
    expect(result.current.courseBins).toEqual([]);
  });

  it('sets hasCourseBinsError when fetch throws', async () => {
    const backendUrl = 'http://localhost:4000';
    process.env.VITE_BACKEND_URL = backendUrl;

    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'));
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchAllCourseBins } = await import('../useFetchAllCourseBins');

    const { result } = renderHook(() => useFetchAllCourseBins());
    await waitFor(() => expect(result.current.isLoadingCourseBins).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/course-bins/all`, {
      credentials: 'include',
    });
    expect(result.current.hasCourseBinsError).toBe(true);
    expect(result.current.courseBins).toEqual([]);
  });
});

describe('useFetchInstitutionCourseBins', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (process.env as Record<string, string | undefined>).VITE_BACKEND_URL;
    delete (globalThis as unknown as { fetch?: unknown }).fetch;
  });

  it('does not fetch and returns empty bins when institutionId is undefined', async () => {
    process.env.VITE_BACKEND_URL = 'http://localhost:4000';
    const fetchMock = vi.fn();
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchInstitutionCourseBins } = await import('../useFetchInstitutionCourseBins');

    const { result } = renderHook(() => useFetchInstitutionCourseBins(undefined));
    await waitFor(() => expect(result.current.isLoadingCourseBins).toBe(false));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.courseBins).toEqual([]);
    expect(result.current.hasCourseBinsError).toBe(false);
  });

  it('fetches institution course bins successfully and updates state', async () => {
    const backendUrl = 'http://localhost:4000';
    const institutionId = 'institution-test-uuid';
    process.env.VITE_BACKEND_URL = backendUrl;

    const mockCourseBins: CourseBin[] = [createCourseBin('1'), createCourseBin('2')];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockCourseBins,
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.spyOn(console, 'log').mockImplementation(() => {});

    vi.resetModules();
    const { useFetchInstitutionCourseBins } = await import('../useFetchInstitutionCourseBins');

    const { result } = renderHook(() => useFetchInstitutionCourseBins(institutionId));
    expect(result.current.isLoadingCourseBins).toBe(true);
    expect(result.current.hasCourseBinsError).toBe(false);

    await waitFor(() => expect(result.current.isLoadingCourseBins).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(
      `${backendUrl}/course-bins/institution/${institutionId}`,
      {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    expect(result.current.hasCourseBinsError).toBe(false);
    expect(result.current.courseBins).toEqual(mockCourseBins);
  });

  it('sets hasCourseBinsError when the response is not ok', async () => {
    const backendUrl = 'http://localhost:4000';
    const institutionId = 'institution-test-uuid';
    process.env.VITE_BACKEND_URL = backendUrl;

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => [],
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.spyOn(console, 'log').mockImplementation(() => {});

    vi.resetModules();
    const { useFetchInstitutionCourseBins } = await import('../useFetchInstitutionCourseBins');

    const { result } = renderHook(() => useFetchInstitutionCourseBins(institutionId));
    await waitFor(() => expect(result.current.isLoadingCourseBins).toBe(false));

    expect(result.current.hasCourseBinsError).toBe(true);
    expect(result.current.courseBins).toEqual([]);
  });

  it('sets hasCourseBinsError and avoids fetching when VITE_BACKEND_URL is not configured', async () => {
    const fetchMock = vi.fn();
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchInstitutionCourseBins } = await import('../useFetchInstitutionCourseBins');

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useFetchInstitutionCourseBins('some-institution-id'));

    await waitFor(() => expect(result.current.isLoadingCourseBins).toBe(false));

    expect(errorSpy).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.hasCourseBinsError).toBe(true);
    expect(result.current.courseBins).toEqual([]);
  });

  it('sets hasCourseBinsError when fetch throws', async () => {
    const backendUrl = 'http://localhost:4000';
    const institutionId = 'institution-test-uuid';
    process.env.VITE_BACKEND_URL = backendUrl;

    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'));
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.spyOn(console, 'log').mockImplementation(() => {});

    vi.resetModules();
    const { useFetchInstitutionCourseBins } = await import('../useFetchInstitutionCourseBins');

    const { result } = renderHook(() => useFetchInstitutionCourseBins(institutionId));
    await waitFor(() => expect(result.current.isLoadingCourseBins).toBe(false));

    expect(result.current.hasCourseBinsError).toBe(true);
    expect(result.current.courseBins).toEqual([]);
  });

  it('refetchCourseBins triggers another request', async () => {
    const backendUrl = 'http://localhost:4000';
    const institutionId = 'institution-test-uuid';
    process.env.VITE_BACKEND_URL = backendUrl;

    const mockCourseBins: CourseBin[] = [createCourseBin('1')];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockCourseBins,
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.spyOn(console, 'log').mockImplementation(() => {});

    vi.resetModules();
    const { useFetchInstitutionCourseBins } = await import('../useFetchInstitutionCourseBins');

    const { result } = renderHook(() => useFetchInstitutionCourseBins(institutionId));
    await waitFor(() => expect(result.current.isLoadingCourseBins).toBe(false));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    result.current.refetchCourseBins();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${backendUrl}/course-bins/institution/${institutionId}`,
      {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  });
});
