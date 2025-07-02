import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const fastify = Fastify({
  logger: true
});

// Register CORS plugin
await fastify.register(cors, {
  origin: process.env['NODE_ENV'] === 'production'
    ? 'https://blog.drewclark.io'
    : true
});

// Health check route
fastify.get("/", async (request, reply) => {
  return { status: "ok, from the root route", timestamp: new Date().toISOString() };
});
fastify.get("/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// Test POST route - accepts JSON and logs it
fastify.post("/api/test", async (request, reply) => {
  // Fastify automatically parses JSON bodies
  const body = request.body;
  
  // Log to console
  console.log("Received POST data:", body);
  
  // Send back what we received
  return { 
    message: "Data received successfully",
    receivedData: body,
    timestamp: new Date().toISOString()
  };
});
// Start server
const start = async (): Promise<void> => {
  try {
    // Accessing PORT via bracket notation to satisfy TypeScript’s index signature
    const port = Number(process.env['PORT'] ?? 3000);

    // Launch Fastify on the resolved port and host
    await fastify.listen({ port, host: 'localhost' });
    console.log(`Server running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};


start();
