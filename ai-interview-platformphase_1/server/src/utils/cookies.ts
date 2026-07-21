import type { Response } from "express";
import ms from "ms";
import { env, isProduction } from "../config/env";
import { REFRESH_TOKEN_COOKIE_NAME } from "../config/constants";

function getMaxAgeMs(): number {
  const parsed = ms(env.JWT_REFRESH_EXPIRY as Parameters<typeof ms>[0]);
  return typeof parsed === "number" ? parsed : 30 * 24 * 60 * 60 * 1000;
}

export function setRefreshTokenCookie(res: Response, token: string) {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/v1/auth",
    maxAge: getMaxAgeMs(),
    signed: true,
  });
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/v1/auth",
    signed: true,
  });
}
