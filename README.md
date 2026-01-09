# qanto

> Price Comparison Platform for Supermarkets

A modern web platform that connects supermarkets with consumers, enabling smart price comparisons and helping people save money on their shopping.

## 🎯 Project Overview

**qanto** is a full-stack application that allows:

- **Consumers**: Compare prices across supermarkets, create shopping lists, receive price alerts
- **Supermarkets**: Showcase products, manage pricing, access analytics
- **Platform**: Provide value through data insights and intelligent recommendations

## 🏗️ Architecture

This is a monorepo project built with:

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Query / Zustand

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Cache**: Redis
- **Validation**: class-validator

### Infrastructure
- **Containerization**: Docker
- **Monorepo Tool**: Nx
- **CI/CD**: GitHub Actions
- **Cloud**: AWS (planned)

## 📁 Project Structure

```
qanto/
├── apps/
│   ├── backend/          # NestJS API
│   │   ├── src/
│   │   │   ├── modules/  # Feature modules
│   │   │   ├── common/   # Shared utilities
│   │   │   └── config/   # Configuration
│   │   └── prisma/       # Database schema
│   │
│   └── frontend/         # Next.js application
│       └── src/
│           ├── app/      # App Router pages
│           ├── components/
│           ├── lib/
│           └── types/
│
├── packages/             # Shared packages (future)
├── docs/                 # Documentation
└── docker-compose.yml    # Local development
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker and Docker Compose

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qanto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start infrastructure services**
   ```bash
   docker-compose up -d
   ```

4. **Setup environment variables**

   Backend:
   ```bash
   cd apps/backend
   cp .env.example .env
   ```

   Frontend:
   ```bash
   cd apps/frontend
   cp .env.example .env
   ```

5. **Setup database**
   ```bash
   cd apps/backend
   npm run prisma:migrate
   npm run prisma:seed
   ```

6. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000
   - API Docs: http://localhost:4000/api/docs

## 🛠️ Development

### Available Commands

From the root directory:

```bash
npm run dev        # Start all apps in development mode
npm run build      # Build all apps
npm run test       # Run tests
npm run lint       # Lint all apps
npm run format     # Format code with Prettier
npm run clean      # Clean Nx cache and node_modules
npm run graph      # View project dependency graph
npm run affected   # View affected projects graph
```

### Nx-Specific Commands

```bash
# Run a specific target for a specific project
nx run backend:dev
nx run frontend:build

# Run a target for all projects
nx run-many --target=test --all

# Run a target only for affected projects
nx affected --target=build

# View the project graph
nx graph

# Clear Nx cache
nx reset

# Get help
nx --help
```

### Backend Commands

```bash
# Using Nx (from root)
nx run backend:dev                # Start in watch mode
nx run backend:build              # Build for production
nx run backend:start              # Start production build
nx run backend:prisma-generate    # Generate Prisma Client
nx run backend:prisma-migrate     # Run database migrations
nx run backend:prisma-studio      # Open Prisma Studio
nx run backend:prisma-seed        # Seed database

# Or from backend directory
cd apps/backend
npm run dev
npm run build
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run prisma:seed
```

### Frontend Commands

```bash
# Using Nx (from root)
nx run frontend:dev        # Start development server
nx run frontend:build      # Build for production
nx run frontend:start      # Start production server
nx run frontend:lint       # Run ESLint

# Or from frontend directory
cd apps/frontend
npm run dev
npm run build
npm run start
npm run lint
```

## 📚 Documentation

Detailed documentation is available in the `/docs` folder:

- [Complete System Documentation](./docs/DOCUMENTATION.md) (Portuguese)
- API Documentation: http://localhost:4000/api/docs (when running)

## 🗺️ Development Roadmap

### Phase 1 - MVP (Current)
- [x] Project setup
- [ ] Authentication system
- [ ] User and supermarket registration
- [ ] Product CRUD
- [ ] CSV import
- [ ] Shopping lists
- [ ] Price comparison
- [ ] Basic search

### Phase 2 - Engagement
- [ ] Social login (Google, Apple)
- [ ] Price alerts
- [ ] Price history
- [ ] Subscription plans
- [ ] Basic recommendations

### Phase 3 - Scale
- [ ] API integration
- [ ] Advanced analytics
- [ ] Admin dashboard
- [ ] PWA features
- [ ] Advanced optimizations

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://qanto:qanto123@localhost:5432/qanto
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run backend tests
cd apps/backend && npm test

# Run frontend tests
cd apps/frontend && npm test
```

## 📦 Database

The project uses PostgreSQL with Prisma ORM.

### Database Schema

Key models:
- **User**: Consumers, supermarkets, admins
- **Supermarket**: Store information
- **Product**: Product catalog
- **ShoppingList**: User shopping lists
- **Comparison**: Price comparison results
- **PriceHistory**: Historical pricing data

See `apps/backend/prisma/schema.prisma` for the complete schema.

## 🔧 Tech Stack Details

### Frontend Technologies
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Query (planned)

### Backend Technologies
- NestJS
- Prisma ORM
- PostgreSQL
- Redis
- JWT authentication
- Swagger/OpenAPI
- class-validator

### DevOps
- Docker & Docker Compose
- Nx (monorepo)
- GitHub Actions (planned)
- AWS deployment (planned)

## 🤝 Contributing

This project follows standard Git workflows:

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📝 Code Style

- Use TypeScript for all code
- Follow ESLint rules
- Format with Prettier
- Write descriptive commit messages (Conventional Commits)
- Keep functions small and focused
- Write comments only when necessary

## 📄 License

[Add your license here]

## 👥 Team

[Add team information]

---

Built with ❤️ using modern web technologies
