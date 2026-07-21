import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

type RequestPart = "body" | "query" | "params";

/**
 * Validates `req[part]` against a Zod schema and replaces it with the
 * parsed (and type-coerced) result. Throws ZodError on failure, which
 * `errorHandler` formats into a 422 response.
 */
export function validate(schema: ZodSchema, part: RequestPart = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    req[part] = schema.parse(req[part]);
    next();
  };
}
