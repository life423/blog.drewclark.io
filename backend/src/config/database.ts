import { PrismaClient } from '@prisma/client';

// Global database instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Create Prisma client with proper configuration
export const prisma = global.prisma || new PrismaClient({
  log: process.env['NODE_ENV'] === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

// Prevent multiple instances in development
if (process.env['NODE_ENV'] === 'development') {
  global.prisma = prisma;
}

// Database connection helper
export const connectToDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('🗄️  Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Graceful shutdown
export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
  }
};
