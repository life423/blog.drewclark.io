import type { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '../utils/errors.js';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const decoded = await request.jwtVerify<{ userId: string; email: string; role: string }>();
    (request as any).user = decoded;
  } catch (err) {
    throw new UnauthorizedError('Invalid or missing token');
  }
}