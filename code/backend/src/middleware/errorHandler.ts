import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/response.js';

export const notFoundHandler: RequestHandler = (_req, res) => {
  sendError(res, 'Ruta no encontrada', 404);
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    sendError(
      res,
      'Los datos enviados no son válidos',
      400,
      error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    );
    return;
  }

  if (error instanceof SyntaxError && 'status' in error && error.status === 400) {
    sendError(res, 'El cuerpo de la solicitud contiene JSON inválido', 400);
    return;
  }

  if (error?.name === 'CastError' || error?.name === 'ValidationError') {
    sendError(res, 'Los datos del empleado no son válidos', 400);
    return;
  }

  console.error(error);
  sendError(res, 'Error interno del servidor', 500);
};