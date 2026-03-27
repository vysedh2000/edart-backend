import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import bcrypt from 'bcrypt';

export async function hashPassword(raw: string) {
  const pwSalt = 10;
  return bcrypt.hash(raw, pwSalt);
}

export function generateSession(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}
