import bcrypt from 'bcrypt';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export function decodeToSessionId(token: string): string {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}
