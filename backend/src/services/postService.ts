import type { Post, PostQuery, CreatePostBody, UpdatePostBody } from '../types/index.js';
import { PostRepository } from '../repositories/postRepository.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

export class PostService {
  private postRepository: PostRepository;

  constructor() {
    this.postRepository = new PostRepository();
  }

  async getPosts(query: PostQuery): Promise<{ posts: Post[]; total: number; totalPages: number }> {
    const { page = 1, limit = 10 } = query;
    
    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      throw new ValidationError('Invalid pagination parameters');
    }

    const result = await this.postRepository.findMany(query);
    const totalPages = Math.ceil(result.total / limit);

    return {
      ...result,
      totalPages,
    };
  }

  async getPostById(id: string): Promise<Post> {
    if (!id) {
      throw new ValidationError('Post ID is required');
    }

    const post = await this.postRepository.findById(id);
    
    // Increment view count for published posts
    if (post.published) {
      await this.postRepository.incrementViewCount(id);
    }

    return post;
  }

  async getPostBySlug(slug: string): Promise<Post> {
    if (!slug) {
      throw new ValidationError('Post slug is required');
    }

    const post = await this.postRepository.findBySlug(slug);
    
    // Increment view count for published posts
    if (post.published) {
      await this.postRepository.incrementViewCount(post.id);
    }

    return post;
  }

  async createPost(data: CreatePostBody, authorId: string): Promise<Post> {
    // Validate required fields
    if (!data.title?.trim()) {
      throw new ValidationError('Title is required');
    }
    
    if (!data.content?.trim()) {
      throw new ValidationError('Content is required');
    }

    if (!authorId) {
      throw new ValidationError('Author ID is required');
    }

    // Generate slug from title if not provided
    const slug = this.generateSlug(data.title);

    // Create excerpt if not provided
    const excerpt = data.excerpt || this.generateExcerpt(data.content);

    return await this.postRepository.create({
      ...data,
      slug,
      excerpt,
      authorId,
    });
  }

  async updatePost(id: string, data: UpdatePostBody): Promise<Post> {
    if (!id) {
      throw new ValidationError('Post ID is required');
    }

    // Validate fields if provided
    if (data.title !== undefined && !data.title.trim()) {
      throw new ValidationError('Title cannot be empty');
    }
    
    if (data.content !== undefined && !data.content.trim()) {
      throw new ValidationError('Content cannot be empty');
    }

    // Update slug if title changed
    if (data.title) {
      data.slug = this.generateSlug(data.title);
    }

    // Update excerpt if content changed and no explicit excerpt provided
    if (data.content && !data.excerpt) {
      data.excerpt = this.generateExcerpt(data.content);
    }

    return await this.postRepository.update(id, data);
  }

  async deletePost(id: string): Promise<void> {
    if (!id) {
      throw new ValidationError('Post ID is required');
    }

    // Verify post exists before deletion
    await this.postRepository.findById(id);
    
    await this.postRepository.delete(id);
  }

  async getPublishedPosts(query: Omit<PostQuery, 'published'>): Promise<{ posts: Post[]; total: number; totalPages: number }> {
    return this.getPosts({ ...query, published: true });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  private generateExcerpt(content: string, maxLength: number = 200): string {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '');
    
    if (plainText.length <= maxLength) {
      return plainText;
    }

    // Find the last complete word within the limit
    const truncated = plainText.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    return lastSpaceIndex > 0 
      ? `${truncated.substring(0, lastSpaceIndex).trim()}...`
      : `${truncated.trim()}...`;
  }
}
