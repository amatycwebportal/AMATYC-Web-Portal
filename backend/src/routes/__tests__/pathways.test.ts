import request from 'supertest';
import app from '../../app';
import { PATHWAYS } from '@shared/pathways';
import { describe, expect, test } from 'vitest';

describe('pathways routes', () => {
  test('GET /pathways returns pathway catalog', async () => {
    const response = await request(app).get('/api/pathways');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(PATHWAYS.length);

    const pathwayIds = new Set(
      (response.body as Array<{ id: string; name: string }>).map((row) => row.id)
    );
    for (const pathway of PATHWAYS) {
      expect(pathwayIds.has(pathway.id)).toBe(true);
    }
  });
});
