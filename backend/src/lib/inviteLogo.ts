import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LOGO_FILE_NAME = 'TPSE-logo.png';

let cachedLogo: Buffer | null | undefined;

function resolveLogoPath(): string | null {
  const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.join(moduleDirectory, '../assets', LOGO_FILE_NAME),
    path.join(moduleDirectory, '../src/assets', LOGO_FILE_NAME),
    path.join(process.cwd(), 'src/assets', LOGO_FILE_NAME),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

export function readInviteLogo(): Buffer | null {
  if (cachedLogo !== undefined) {
    return cachedLogo;
  }

  const logoPath = resolveLogoPath();
  cachedLogo = logoPath ? fs.readFileSync(logoPath) : null;
  return cachedLogo;
}
