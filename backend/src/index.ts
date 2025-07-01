import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const fastify = Fastify({
  logger: true
});

// Register CORS
await fastify.register(cors, {
  origin: process.env.NODE_ENV === "production" 
    ? "https://blog.drewclark.io" 
    : true
});

// Health check route
fastify.get("/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port: Number(port), host: "0.0.0.0" });
    console.log(`Server running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
