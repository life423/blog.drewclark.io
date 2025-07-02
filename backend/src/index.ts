import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { connectToDatabase, disconnectFromDatabase } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { postRoutes } from './routes/postRoutes.js';

// Load environment variables
dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Register error handler
fastify.setErrorHandler(errorHandler as any);

// Register CORS plugin
await fastify.register(cors, {
  origin: process.env['NODE_ENV'] === 'production'
    ? ['https://blog.drewclark.io', 'https://www.blog.drewclark.io']
    : true,
  credentials: true,
});

// Health check routes
fastify.get('/', async (request, reply) => {
  return { 
    status: 'ok', 
    service: 'Blog API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  };
});

fastify.get('/health', async (request, reply) => {
  return { 
    status: 'healthy', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
});

// API routes
fastify.register(async function (fastify) {
  await fastify.register(postRoutes, { prefix: '/api/posts' });
});

// Test routes (keep for development)
if (process.env['NODE_ENV'] === 'development') {
  fastify.post('/api/test', async (request, reply) => {
    const body = request.body;
    fastify.log.info('Received test data:', body);
    
    return { 
      message: 'Test data received successfully',
      receivedData: body,
      timestamp: new Date().toISOString(),
    };
  });
}

// Graceful shutdown handler
const gracefulShutdown = async (signal: string): Promise<void> => {
  fastify.log.info(`Received ${signal}, shutting down gracefully...`);
  
  try {
    await fastify.close();
    await disconnectFromDatabase();
    fastify.log.info('Server closed successfully');
    process.exit(0);
  } catch (error) {
    fastify.log.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Register shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  fastify.log.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  fastify.log.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
const start = async (): Promise<void> => {
  try {
    // Connect to database first
    await connectToDatabase();

    // Get port from environment
    const port = Number(process.env['PORT']) || 3000;
    const host = process.env['HOST'] || '0.0.0.0';

    // Start server
    await fastify.listen({ port, host });
    
    fastify.log.info(`🚀 Server running on http://${host}:${port}`);
    fastify.log.info(`📚 Blog API is ready to serve requests`);
    
  } catch (error) {
    fastify.log.error('Failed to start server:', error);
    await disconnectFromDatabase();
    process.exit(1);
  }
};

// Start the application
start();
