# blog.drewclark.io

A modern, high-performance blog platform built with TypeScript, React, and PostgreSQL.

## 🏗️ Architecture

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Fastify + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **Deployment**: Docker + Docker Compose
- **Monorepo**: Turborepo + pnpm workspaces

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 14+
- Docker (optional)

### Development Setup

```bash
# Clone repository
git clone https://github.com/username/blog.drewclark.io.git
cd blog.drewclark.io

# Install dependencies
pnpm install

# Setup database
cp backend/.env.example backend/.env
# Edit DATABASE_URL in backend/.env

# Run database migrations
pnpm --filter backend db:migrate

# Start development servers
pnpm dev
```

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Database Studio: `pnpm --filter backend db:studio`

### Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📁 Project Structure

```
├── backend/                 # Fastify API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── config/          # Configuration
│   │   └── types/           # TypeScript definitions
│   ├── prisma/              # Database schema & migrations
│   └── package.json
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Route components
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utilities
│   │   └── types/           # TypeScript definitions
│   └── package.json
├── turbo.json              # Turborepo configuration
├── pnpm-workspace.yaml     # Workspace configuration
└── docker-compose.yml      # Container orchestration
```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev                    # Start all services
pnpm --filter backend dev   # Backend only
pnpm --filter frontend dev  # Frontend only

# Building
pnpm build                  # Build all packages
pnpm preview               # Preview production build

# Database
pnpm --filter backend db:migrate    # Run migrations
pnpm --filter backend db:push       # Push schema changes
pnpm --filter backend db:studio     # Open Prisma Studio

# Code Quality
pnpm lint                   # Lint all packages
pnpm format                # Format code
pnpm test                  # Run tests

# Security
pnpm audit                 # Audit dependencies
pnpm security             # Security scan
```

### API Endpoints

#### Posts
- `GET /api/posts` - List posts (with pagination, filtering)
- `GET /api/posts/published` - List published posts
- `GET /api/posts/:id` - Get post by ID
- `GET /api/posts/slug/:slug` - Get post by slug
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

#### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search in title/content
- `tag` - Filter by tag slug
- `authorId` - Filter by author

## 🗄️ Database Schema

### Core Entities
- **Users** - Authors and commenters
- **Posts** - Blog articles with metadata
- **Comments** - Nested comments with approval system
- **Tags** - Categorization system
- **PostTags** - Many-to-many relationship

### Key Features
- Soft deletes with cascade
- Full-text search capabilities
- Optimized indexes for performance
- CUID-based primary keys

## 🚢 Deployment

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
PORT=3000
NODE_ENV=production
```

#### Frontend
```env
VITE_API_URL=https://api.yourdomain.com
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Docker Deployment

```bash
# Build images
docker-compose build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuration

### Code Quality
- **Biome** - Fast linting and formatting
- **TypeScript** - Strict type checking
- **Vitest** - Unit testing framework

### Performance Optimizations
- **SWC** - 70% faster React builds
- **Brotli compression** - Optimized asset delivery
- **Code splitting** - Vendor chunk optimization
- **Database indexing** - Query optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Write tests for new features
- Use conventional commits
- Ensure all checks pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/username/blog.drewclark.io/issues)
- **Discussions**: [GitHub Discussions](https://github.com/username/blog.drewclark.io/discussions)
- **Email**: support@drewclark.io

---

Built with ❤️ by [Drew Clark](https://drewclark.io)
