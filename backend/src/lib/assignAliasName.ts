import { prisma, type Prisma } from '@lib/prisma';
import { MATHEMATICIAN_ALIASES, buildAliasCandidate } from '@shared/mathematicianAliases';

type TransactionClient = Prisma.TransactionClient;

function hashSeed(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export async function assignAliasName(args: {
  userId: string;
  institutionId?: string | null;
  seed?: string;
  client?: TransactionClient;
}): Promise<string> {
  const client = args.client ?? prisma;
  const existing = await client.user.findUnique({
    where: { id: args.userId },
    select: { aliasName: true, institutionId: true, email: true },
  });
  if (!existing) {
    throw new Error('User not found');
  }
  if (existing.aliasName) {
    return existing.aliasName;
  }

  const institutionId = args.institutionId ?? existing.institutionId ?? null;
  const seed = args.seed ?? existing.email ?? args.userId;
  const startIndex = hashSeed(seed) % MATHEMATICIAN_ALIASES.length;

  for (let offset = 0; offset < MATHEMATICIAN_ALIASES.length * 3; offset += 1) {
    const baseName = MATHEMATICIAN_ALIASES[(startIndex + offset) % MATHEMATICIAN_ALIASES.length]!;
    const attempt = Math.floor(offset / MATHEMATICIAN_ALIASES.length);
    const candidate = buildAliasCandidate(baseName, attempt);

    const clash = await client.user.findFirst({
      where: {
        aliasName: candidate,
        ...(institutionId
          ? { institutionId }
          : { institutionId: null, id: { not: args.userId } }),
        id: { not: args.userId },
      },
      select: { id: true },
    });
    if (clash) {
      continue;
    }

    await client.user.update({
      where: { id: args.userId },
      data: { aliasName: candidate },
    });
    return candidate;
  }

  const fallback = `Mathematician ${args.userId.slice(0, 8)}`;
  await client.user.update({
    where: { id: args.userId },
    data: { aliasName: fallback },
  });
  return fallback;
}
