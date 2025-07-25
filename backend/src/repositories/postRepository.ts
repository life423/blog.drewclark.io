import { prisma } from '../config/database.js'
import type {
    CreatePostBody,
    Post,
    PostQuery,
    UpdatePostBody,
} from '../types/index.js'
import { NotFoundError } from '../utils/errors.js'

export class PostRepository {
    async findMany(
        query: PostQuery
    ): Promise<{ posts: Post[]; total: number }> {
        const { page = 1, limit = 10, published, authorId, tag, search } = query
        const skip = (page - 1) * limit

        const where: any = {}

        if (published !== undefined) {
            where.published = published
        }

        if (authorId) {
            where.authorId = authorId
        }

        if (tag) {
            where.tags = {
                some: {
                    tag: {
                        slug: tag,
                    },
                },
            }
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
            ]
        }

        const [posts, total] = await prisma.$transaction([
            prisma.post.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            avatar: true,
                        },
                    },
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                    _count: {
                        select: {
                            comments: true,
                        },
                    },
                },
            }),
            prisma.post.count({ where }),
        ])

        return {
            posts: posts.map((post: any) => ({
                ...post,
                tags: post.tags.map((pt: any) => pt.tag),
            })) as Post[],
            total,
        }
    }

    async findById(id: string): Promise<Post> {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    },
                },
                tags: {
                    include: {
                        tag: true,
                    },
                },
                comments: {
                    where: { approved: true },
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        })

        if (!post) {
            throw new NotFoundError('Post')
        }

        return {
            ...post,
            tags: post.tags.map((pt: any) => pt.tag),
        } as Post
    }

    async findBySlug(slug: string): Promise<Post> {
        const post = await prisma.post.findUnique({
            where: { slug },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    },
                },
                tags: {
                    include: {
                        tag: true,
                    },
                },
                comments: {
                    where: { approved: true },
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        })

        if (!post) {
            throw new NotFoundError('Post')
        }

        return {
            ...post,
            tags: post.tags.map((pt: any) => pt.tag),
        } as Post
    }

    async create(data: CreatePostBody & { authorId: string }): Promise<Post> {
        const { tags, ...postData } = data

        const post = await prisma.post.create({
            data: {
                ...postData,
                publishedAt: postData.published ? new Date() : null,
                tags: tags
                    ? {
                          create: tags.map(tagId => ({
                              tag: { connect: { id: tagId } },
                          })),
                      }
                    : undefined,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    },
                },
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        })

        return {
            ...post,
            tags: post.tags.map((pt: any) => pt.tag),
        } as Post
    }

    async update(id: string, data: UpdatePostBody): Promise<Post> {
        const { tags, ...postData } = data

        const post = await prisma.post.update({
            where: { id },
            data: {
                ...postData,
                publishedAt:
                    data.published !== undefined
                        ? data.published
                            ? new Date()
                            : null
                        : undefined,
                tags: tags
                    ? {
                          deleteMany: {},
                          create: tags.map(tagId => ({
                              tag: { connect: { id: tagId } },
                          })),
                      }
                    : undefined,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    },
                },
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        })

        return {
            ...post,
            tags: post.tags.map((pt: any) => pt.tag),
        } as Post
    }

    async delete(id: string): Promise<void> {
        await prisma.post.delete({
            where: { id },
        })
    }

    async incrementViewCount(id: string): Promise<void> {
        await prisma.post.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        })
    }
}