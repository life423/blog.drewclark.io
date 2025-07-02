import type { FastifyRequest, FastifyReply } from 'fastify';
import { PostService } from '../services/postService.js';
import { successResponse, errorResponse } from '../utils/errors.js';
import type { PostQuery, CreatePostBody, UpdatePostBody } from '../types/index.js';

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  async getPosts(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const query = request.query as PostQuery;
      const result = await this.postService.getPosts(query);

      await reply.send(successResponse(result.posts, 'Posts retrieved successfully', {
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        total: result.total,
        totalPages: result.totalPages,
      }));
    } catch (error) {
      throw error; // Let error handler middleware handle it
    }
  }

  async getPublishedPosts(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const query = request.query as Omit<PostQuery, 'published'>;
      const result = await this.postService.getPublishedPosts(query);

      await reply.send(successResponse(result.posts, 'Published posts retrieved successfully', {
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        total: result.total,
        totalPages: result.totalPages,
      }));
    } catch (error) {
      throw error;
    }
  }

  async getPostById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params as { id: string };
      const post = await this.postService.getPostById(id);

      await reply.send(successResponse(post, 'Post retrieved successfully'));
    } catch (error) {
      throw error;
    }
  }

  async getPostBySlug(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { slug } = request.params as { slug: string };
      const post = await this.postService.getPostBySlug(slug);

      await reply.send(successResponse(post, 'Post retrieved successfully'));
    } catch (error) {
      throw error;
    }
  }

  async createPost(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as CreatePostBody;
      // TODO: Get authorId from authenticated user
      const authorId = 'test-author-123'; // This will be replaced with actual auth
      
      const post = await this.postService.createPost(body, authorId);

      await reply.status(201).send(successResponse(post, 'Post created successfully'));
    } catch (error) {
      throw error;
    }
  }

  async updatePost(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as UpdatePostBody;
      
      const post = await this.postService.updatePost(id, body);

      await reply.send(successResponse(post, 'Post updated successfully'));
    } catch (error) {
      throw error;
    }
  }

  async deletePost(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params as { id: string };
      await this.postService.deletePost(id);

      await reply.status(204).send();
    } catch (error) {
      throw error;
    }
  }

}
