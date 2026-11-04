// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  delete (globalThis as { fetch?: unknown }).fetch;
});

describe('useFetchConsensusContexts', () => {
  it('fetches consensus contexts successfully', async () => {
    const backendUrl = 'http://localhost:4000';
    vi.stubEnv('VITE_BACKEND_URL', backendUrl);

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        rubricVersionId: 'rv-1',
        contexts: [
          {
            rubricVersionId: 'rv-1',
            pathwayId: '30000000-0000-0000-0000-000000000001',
            pathwayName: 'General',
            isGeneralPathway: true,
            consensusStatus: 'SUBMITTED',
            hasSubmittedConsensus: true,
          },
        ],
        groups: [
          {
            pathwayId: '30000000-0000-0000-0000-000000000001',
            pathwayName: 'General',
            isGeneralPathway: true,
            contexts: [
              {
                rubricVersionId: 'rv-1',
                pathwayId: '30000000-0000-0000-0000-000000000001',
                pathwayName: 'General',
                isGeneralPathway: true,
                consensusStatus: 'SUBMITTED',
                hasSubmittedConsensus: true,
              },
            ],
          },
        ],
      }),
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    const { useFetchConsensusContexts } = await import('../useFetchConsensusContexts');
    const { result } = renderHook(() =>
      useFetchConsensusContexts({ rubricId: 'rubric-1', institutionId: 'inst-1' })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(
      `${backendUrl}/consensus/contexts?rubricId=rubric-1&institutionId=inst-1`,
      { credentials: 'include' }
    );
    expect(result.current.hasError).toBe(false);
    expect(result.current.rubricVersionId).toBe('rv-1');
    expect(result.current.contexts).toHaveLength(1);
    expect(result.current.groups).toHaveLength(1);
  });
});
