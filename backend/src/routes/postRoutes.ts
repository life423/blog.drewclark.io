import type { FastifyInstance } from 'fastify';
import { PostController } from '../controllers/postController.js';

const postController = new PostController();

// JSON schemas for validation
const postQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100 },
    published: { type: 'boolean' },
    authorId: { type: 'string' },
    tag: { type: 'string' },
    search: { type: 'string' },
  },
};

const createPostSchema = {
  type: 'object',
  required: ['title', 'content'],
  properties: {
    title: { type: 'string', minLength: 1 },
    content: { type: 'string', minLength: 1 },
    excerpt: { type: 'string' },
    coverImage: { type: 'string' },
    published: { type: 'boolean', default: false },
    tags: {
      type: 'array',
      items: { type: 'string' },
    },
    slug: { type: 'string' },
  },
};

const updatePostSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    content: { type: 'string', minLength: 1 },
    excerpt: { type: 'string' },
    coverImage: { type: 'string' },
    published: { type: 'boolean' },
    tags: {
      type: 'array',
      items: { type: 'string' },
    },
    slug: { type: 'string' },
  },
};

const idParamSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
};

const slugParamSchema = {
  type: 'object',
  required: ['slug'],
  properties: {
    slug: { type: 'string' },
  },
};

export async function postRoutes(fastify: FastifyInstance): Promise<void> {
  // Public routes
  fastify.get('/public', {
    schema: {
      querystring: postQuerySchema,
    },
  }, postController.getPublishedPosts.bind(postController));

  fastify.get('/slug/:slug', {
    schema: {
      params: slugParamSchema,
    },
  }, postController.getPostBySlug.bind(postController));

  // Admin routes (all posts)
  fastify.get('/', {
    schema: {
      querystring: postQuerySchema,
    },
  }, postController.getPosts.bind(postController));

  fastify.get('/:id', {
    schema: {
      params: idParamSchema,
    },
  }, postController.getPostById.bind(postController));

  fastify.post('/', {
    schema: {
      body: createPostSchema,
    },
  }, postController.createPost.bind(postController));

  fastify.put('/:id', {
    schema: {
      params: idParamSchema,
      body: updatePostSchema,
    },
  }, postController.updatePost.bind(postController));

  fastify.delete('/:id', {
    schema: {
      params: idParamSchema,
    },
  }, postController.deletePost.bind(postController));
}
