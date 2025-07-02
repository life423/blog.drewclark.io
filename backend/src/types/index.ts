// Shared types for the application
export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  authorId: string;
  author?: User;
  comments?: Comment[];
  tags?: Tag[];
}

export interface Comment {
  id: string;
  content: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
  postId: string;
  authorId: string;
  parentId?: string;
  author?: User;
  replies?: Comment[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR'
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Query parameters
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PostQuery extends PaginationQuery {
  published?: boolean;
  authorId?: string;
  tag?: string;
  search?: string;
}

// Request bodies
export interface CreatePostBody {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
  tags?: string[];
  slug?: string;
}

export interface UpdatePostBody extends Partial<CreatePostBody> {}

export interface CreateCommentBody {
  content: string;
  postId: string;
  parentId?: string;
}
