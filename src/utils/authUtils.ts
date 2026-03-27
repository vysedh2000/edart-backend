import bcrypt from 'bcrypt';
import { hashPassword } from '../common/utils/session.utils';

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
