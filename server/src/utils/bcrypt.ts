import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../config/constants";

export function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, BCRYPT_SALT_ROUNDS);
}

export function comparePassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}
