import type { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/authController.js';

export async function authRoutes(fastify: FastifyInstance) {
  const authController = new AuthController();

  fastify.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'username', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          username: { type: 'string', minLength: 3 },
          password: { type: 'string', minLength: 6 },
          name: { type: 'string' }
        }
      }
    }
  }, authController.register.bind(authController));

  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      }
    }
  }, authController.login.bind(authController));
}