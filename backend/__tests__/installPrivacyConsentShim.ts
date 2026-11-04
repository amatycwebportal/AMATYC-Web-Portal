import { prisma } from '@lib/prisma';

const PRIVACY_CONSENT_ACCEPTED_AT = 'privacyConsentAcceptedAt';
const PRIVACY_POLICY_VERSION = 'privacyPolicyVersion';

type ConsentFields = {
  privacyConsentAcceptedAt: Date;
  privacyPolicyVersion: string;
};

type UserWithId = { id: string };

const consentByUserId = new Map<string, ConsentFields>();

let supportsPrivacyConsentPromise: Promise<boolean> | undefined;

function supportsPrivacyConsent(): Promise<boolean> {
  if (!supportsPrivacyConsentPromise) {
    supportsPrivacyConsentPromise = prisma.user
      .findFirst({
        select: { privacyConsentAcceptedAt: true },
      })
      .then(() => true)
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        return !message.includes('Unknown');
      });
  }
  return supportsPrivacyConsentPromise;
}

function splitPrivacyFields(data: object): {
  consent: ConsentFields | undefined;
  data: Record<string, unknown>;
} {
  const record = { ...(data as Record<string, unknown>) };
  const acceptedAt = record[PRIVACY_CONSENT_ACCEPTED_AT];
  const version = record[PRIVACY_POLICY_VERSION];
  const hasPrivacyField =
    PRIVACY_CONSENT_ACCEPTED_AT in record || PRIVACY_POLICY_VERSION in record;
  delete record[PRIVACY_CONSENT_ACCEPTED_AT];
  delete record[PRIVACY_POLICY_VERSION];
  if (!hasPrivacyField) {
    return { consent: undefined, data: record };
  }
  const consent =
    acceptedAt instanceof Date && typeof version === 'string'
      ? { privacyConsentAcceptedAt: acceptedAt, privacyPolicyVersion: version }
      : undefined;
  return { consent, data: record };
}

function attachConsent<T extends UserWithId>(user: T): T {
  const consent = consentByUserId.get(user.id);
  if (!consent) return user;
  return { ...user, ...consent };
}

function rememberConsent(userId: string, consent: ConsentFields | undefined): void {
  if (!consent) return;
  consentByUserId.set(userId, consent);
}

const originalCreate = prisma.user.create.bind(prisma.user);
const originalUpdate = prisma.user.update.bind(prisma.user);
const originalFindUnique = prisma.user.findUnique.bind(prisma.user);

prisma.user.create = (async (args) => {
  if (await supportsPrivacyConsent()) {
    return originalCreate(args);
  }
  const split = splitPrivacyFields(args.data);
  const user = await originalCreate({ ...args, data: split.data } as typeof args);
  rememberConsent(user.id, split.consent);
  return split.consent ? { ...user, ...split.consent } : user;
}) as typeof prisma.user.create;

prisma.user.update = (async (args) => {
  if (await supportsPrivacyConsent()) {
    return originalUpdate(args);
  }
  const split = splitPrivacyFields(args.data);
  const hasRemainingFields = Object.keys(split.data).length > 0;
  if (!hasRemainingFields) {
    const existing = await originalFindUnique({ where: args.where });
    if (existing) rememberConsent(existing.id, split.consent);
    return existing ? attachConsent(existing) : existing;
  }
  const user = await originalUpdate({ ...args, data: split.data } as typeof args);
  rememberConsent(user.id, split.consent);
  return split.consent ? { ...user, ...split.consent } : user;
}) as typeof prisma.user.update;

prisma.user.findUnique = (async (args) => {
  const user = await originalFindUnique(args);
  if (!user || (await supportsPrivacyConsent())) return user;
  return attachConsent(user);
}) as typeof prisma.user.findUnique;
