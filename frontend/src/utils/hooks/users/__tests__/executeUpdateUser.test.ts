import { afterEach, describe, expect, it, vi } from 'vitest';
import { executeUpdateUser } from '../executeUpdateUser';

describe('executeUpdateUser', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (globalThis as unknown as { fetch?: unknown }).fetch;
  });

  it('returns parsed user on success', async () => {
    const updated = {
      id: 'u1',
      googleId: 'g1',
      name: 'Updated',
      email: 'a@b.com',
      role: 'FACULTY',
      userCourseBins: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => updated,
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    const result = await executeUpdateUser('http://localhost:4000', 'u1', { name: 'Updated' });

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:4000/users/u1', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated' }),
    });
    expect(result).toEqual(updated);
  });

  it('throws with server error message when not ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Invalid role' }),
    });
    (globalThis as unknown as { fetch?: typeof fetchMock }).fetch = fetchMock;

    await expect(
      executeUpdateUser('http://localhost:4000', 'u1', { role: 'USER' })
    ).rejects.toThrow('Invalid role');
  });
});
