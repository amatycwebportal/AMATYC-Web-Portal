import { randomUUID } from 'crypto';
import request from 'supertest';
import app from '../../app';
import { prisma } from '@lib/prisma';
import { afterAll, describe, expect, test } from 'vitest';

describe('institution routes — create', () => {
  const createdInstitutionIds: string[] = [];

  afterAll(async () => {
    if (createdInstitutionIds.length > 0) {
      await prisma.institution.deleteMany({
        where: { id: { in: createdInstitutionIds } },
      });
    }
  });

  test('POST /institutions/create persists institution when name is provided', async () => {
    const name = `Test institution ${randomUUID()}`;
    const response = await request(app)
      .post('/institutions/create')
      .send({ name });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });

    const row = await prisma.institution.findFirst({ where: { name } });
    expect(row).toBeDefined();
    if (!row) return;

    createdInstitutionIds.push(row.id);
    expect(row.name).toBe(name);
  });

  test('POST /institutions/create returns 400 when name is missing', async () => {
    const response = await request(app)
      .post('/institutions/create')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Missing required fields' });
  });
});
