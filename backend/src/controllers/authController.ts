import type { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/authService.js';
import { successResponse } from '../utils/errors.js';
import type { LoginRequest, RegisterRequest } from '../types/auth.js';

export class AuthController {
  private authService = new AuthService();

  async register(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as RegisterRequest;
    const user = await this.authService.register(body);
    const token = request.server.jwt.sign({ userId: user.id, email: user.email, role: user.role });
    
    await reply.send(successResponse({ user, token }, 'User registered successfully'));
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as LoginRequest;
    const user = await this.authService.login(email, password);
    const token = request.server.jwt.sign({ userId: user.id, email: user.email, role: user.role });
    
    await reply.send(successResponse({ user, token }, 'Login successful'));
  }
}