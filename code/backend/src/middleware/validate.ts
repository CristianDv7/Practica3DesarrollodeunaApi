import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';

export const validate = (schema: ZodType, source: 'body' | 'params'): RequestHandler => (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    next(result.error);
    return;
  }

  req[source] = result.data;
  next();
};