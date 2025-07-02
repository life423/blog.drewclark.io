import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError, errorResponse } from '../utils/errors.js';

export const errorHandler = async (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  // Log error for debugging
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
  });

  // Handle custom application errors
  if (error instanceof AppError) {
    await reply
      .status(error.statusCode)
      .send(errorResponse(error.message, 'Application Error'));
    return;
  }

  // Handle Prisma errors
  if (error.code?.startsWith('P')) {
    let message = 'Database error';
    let statusCode = 500;

    switch (error.code) {
      case 'P2002':
        message = 'A record with this information already exists';
        statusCode = 409;
        break;
      case 'P2025':
        message = 'Record not found';
        statusCode = 404;
        break;
      case 'P2003':
        message = 'Invalid reference to related record';
        statusCode = 400;
        break;
      default:
        message = 'Database error occurred';
    }

    await reply
      .status(statusCode)
      .send(errorResponse(message, 'Database Error'));
    return;
  }

  // Handle validation errors
  if (error.validation) {
    await reply
      .status(400)
      .send(errorResponse('Validation failed', 'Validation Error'));
    return;
  }

  // Handle unknown errors
  const statusCode = error.statusCode || 500;
  const message = process.env['NODE_ENV'] === 'production' 
    ? 'Internal server error' 
    : error.message;

  await reply
    .status(statusCode)
    .send(errorResponse(message, 'Server Error'));
};
