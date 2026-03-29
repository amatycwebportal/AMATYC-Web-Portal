// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('useFetchInstitutions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    delete (globalThis as unknown as { fetch?: unknown }).fetch;
  });

  it('does not fetch when disabled', async () => {
    const fetchMock = vi.fn();
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchInstitutions } = await import('../useFetchInstitutions');

    const { result } = renderHook(() => useFetchInstitutions(false));

    await waitFor(() => expect(result.current.isLoadingInstitutions).toBe(false));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.institutions).toEqual([]);
    expect(result.current.hasInstitutionsError).toBe(false);
  });

  it('fetches institutions when enabled', async () => {
    const backendUrl = 'http://localhost:4000';
    vi.stubEnv('VITE_BACKEND_URL', backendUrl);

    const rows = [{ id: 'i1', name: 'Inst One' }];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => rows,
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    vi.resetModules();
    const { useFetchInstitutions } = await import('../useFetchInstitutions');

    const { result } = renderHook(() => useFetchInstitutions(true));

    await waitFor(() => expect(result.current.isLoadingInstitutions).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(`${backendUrl}/institutions/all`, {
      credentials: 'include',
    });
    expect(result.current.institutions).toEqual(rows);
    expect(result.current.hasInstitutionsError).toBe(false);
  });
});
