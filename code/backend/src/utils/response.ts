import type { Response } from 'express';

export const sendSuccess = <T>(
  response: Response,
  data: T,
  message = 'Operación realizada correctamente',
  statusCode = 200,
): void => {
  response.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  response: Response,
  message: string,
  statusCode: number,
  details?: unknown,
): void => {
  response.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(details === undefined ? {} : { details }),
    },
  });
};