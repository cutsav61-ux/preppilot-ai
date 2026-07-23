import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface AccessTokenPayload {
  sub: string; // user id
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRY as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET as Secret, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET as Secret) as AccessTokenPayload;
}

export function signRefreshToken(payload: AccessTokenPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRY as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, options);
}

export function verifyRefreshToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET as Secret) as AccessTokenPayload;
}
