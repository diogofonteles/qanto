# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**qanto** is a price comparison platform for supermarkets in Brazil. It connects supermarkets that want to advertise their products with consumers looking to save money on groceries. The system allows consumers to create shopping lists and compare prices across multiple supermarkets.

## Tech Stack

- **Monorepo**: Nx workspace with npm workspaces
- **Backend**: NestJS + Prisma + PostgreSQL + Redis
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Infrastructure**: Docker (PostgreSQL, Redis)
- **Node**: >=20.0.0, npm >=10.0.0

## Essential Commands

### Initial Setup (First Time Only)
```bash
./setup.sh
```
This script:
1. Installs all dependencies
2. Starts Docker services (PostgreSQL + Redis)
3. Runs Prisma migrations
4. Seeds the database with initial data (plans, categories)

### Development

Start both frontend and backend in development mode:
```bash
./dev.sh
```

Or run separately:
```bash
# Terminal 1 - Backend (runs on port 4000)
cd apps/backend && npm run dev

# Terminal 2 - Frontend (runs on port 3000)
cd apps/frontend && npm run dev
```

### Database Operations

```bash
# Generate Prisma client after schema changes
cd apps/backend && npx prisma generate

# Create and apply new migration
cd apps/backend && npx prisma migrate dev --name <migration_name>

# Open Prisma Studio (visual database editor)
cd apps/backend && npx prisma studio

# Reset database (drops all data)
cd apps/backend && npx prisma migrate reset

# Run seeds manually
cd apps/backend && npm run prisma:seed
```

### Testing

```bash
# Run all tests
npm run test

# Run tests for specific app
cd apps/backend && npm run test
cd apps/frontend && npm run test

# Run tests in watch mode
cd apps/backend && npm run test:watch

# Run with coverage
cd apps/backend && npm run test:cov

# Run e2e tests
cd apps/backend && npm run test:e2e
```

### Linting and Formatting

```bash
# Lint all projects
npm run lint

# Lint specific app
cd apps/backend && npm run lint
cd apps/frontend && npm run lint

# Format code
npm run format
```

### Docker Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Reset everything (removes volumes)
docker-compose down -v
```

### Build

```bash
# Build all projects
npm run build

# Build specific app
cd apps/backend && npm run build
cd apps/frontend && npm run build
```

## Architecture Overview

### Backend (NestJS)

The backend follows a modular architecture with feature-based modules:

```
apps/backend/src/
├── modules/
│   ├── auth/           # Authentication & JWT
│   ├── users/          # User management (consumers)
│   ├── supermarkets/   # Supermarket management
│   ├── products/       # Product CRUD & CSV upload
│   ├── lists/          # Shopping lists
│   └── comparisons/    # Price comparison logic
├── common/
│   ├── decorators/     # Custom decorators (e.g., @CurrentUser)
│   ├── guards/         # Auth guards, role guards
│   └── pipes/          # Validation pipes
├── database/
│   └── seeds/          # Database seed scripts
└── main.ts             # Application entry point
```

**Key patterns:**
- Each module follows NestJS structure: controller, service, module
- DTOs for request/response validation using `class-validator`
- Guards for authentication and authorization (role-based)
- Prisma ORM for database access
- Swagger/OpenAPI documentation at `/api/docs`

### Frontend (Next.js)

Uses Next.js 14 App Router with TypeScript:

```
apps/frontend/src/
├── app/
│   ├── (auth)/         # Auth routes (login, register)
│   ├── dashboard/      # Consumer dashboard
│   ├── supermarket/    # Supermarket dashboard
│   ├── profile/        # User profile
│   └── layout.tsx      # Root layout
├── components/
│   ├── ui/             # shadcn/ui components
│   └── csv-upload.tsx  # Feature components
├── lib/
│   ├── api.ts          # API client functions
│   ├── utils.ts        # Utility functions
│   ├── validations.ts  # Form validation schemas (Zod)
│   └── cookies.ts      # Cookie management
└── types/              # TypeScript type definitions
```

**Key patterns:**
- Server Components by default
- API calls from client components using fetch
- Form validation with react-hook-form + Zod
- shadcn/ui for UI components
- Tailwind CSS for styling

### Database Schema (Prisma)

The database uses PostgreSQL with the following main entities:

- **User**: Consumers and supermarket users (role-based)
- **Plan**: Subscription plans (consumer/supermarket types)
- **Supermarket**: Supermarket profiles with geolocation
- **Product**: Products with prices, categories, promotions
- **Category/Subcategory**: Product categorization
- **ShoppingList**: User shopping lists
- **ListItem**: Items in shopping lists
- **Comparison**: Price comparison records
- **PriceHistory**: Historical price data
- **UserEvent**: Analytics/tracking events

**Important schema notes:**
- Prices are stored in cents (integer) to avoid floating-point issues
- Geolocation uses Decimal(10,8) for lat and Decimal(11,8) for lng
- User roles: `consumer`, `supermarket`, `admin`
- All timestamps in UTC

## Development Workflow

### Adding a New Feature

1. **Backend:**
   - Create/update DTOs in the module
   - Add service methods with business logic
   - Create controller endpoints
   - Add validation using `class-validator`
   - Update Swagger documentation with decorators
   - Write tests

2. **Database Changes:**
   ```bash
   # Edit apps/backend/prisma/schema.prisma
   cd apps/backend
   npx prisma migrate dev --name <feature_name>
   npx prisma generate
   ```

3. **Frontend:**
   - Create API client functions in `lib/api.ts`
   - Add validation schemas in `lib/validations.ts`
   - Create/update components
   - Add routes in `app/` directory

### Authentication Flow

- JWT-based authentication
- Tokens stored in httpOnly cookies (managed via `lib/cookies.ts`)
- `@CurrentUser()` decorator extracts user from JWT
- `@UseGuards(JwtAuthGuard)` protects routes
- Role-based access control via `@Roles()` decorator

### API Structure

Base URL: `http://localhost:4000/api/v1`

Key endpoints:
- `/auth/*` - Authentication (login, register)
- `/users/*` - User management
- `/supermarkets/*` - Supermarket operations
- `/products/*` - Product CRUD, CSV upload
- `/lists/*` - Shopping list management
- `/comparisons/*` - Price comparison

All endpoints documented at: `http://localhost:4000/api/docs`

## Data Seeding

The database is seeded with:
- **6 Plans**: 3 for consumers (Free, Basic R$9.90, Premium R$29.90) and 3 for supermarkets (Free, Growth R$99.90, Enterprise R$299)
- **10 Categories** with 60+ subcategories (Hortifruti, Mercearia, Açougue, etc.)

Seeds are located in `apps/backend/src/database/seeds/`

## Environment Variables

Backend requires `.env` file (see `.env.example`):
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing
- `REDIS_URL`: Redis connection string (for caching/sessions)
- `PORT`: Backend port (default: 4000)
- `FRONTEND_URL`: Frontend URL for CORS

## Common Issues

**Port already in use:**
```bash
# Kill process on port 4000 (backend)
lsof -ti:4000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

**Docker services not starting:**
```bash
docker-compose down
docker-compose up -d
# Wait a few seconds for services to be ready
```

**Prisma Client out of sync:**
```bash
cd apps/backend && npx prisma generate
```

**Database connection issues:**
- Ensure Docker containers are running: `docker-compose ps`
- Check DATABASE_URL in `.env` matches docker-compose.yml credentials

## Important Conventions

- **Commits**: Use Conventional Commits format
- **Branches**: Feature branches from main
- **API Versioning**: All routes under `/api/v1/`
- **Currency**: Always work with cents (integer), never floating-point
- **Dates**: Store in UTC, convert to America/Sao_Paulo for display
- **Files**: camelCase for variables/functions, PascalCase for classes/components

## Testing Notes

- Backend tests use Jest
- Test files: `*.spec.ts`
- E2E tests: `test/*.e2e-spec.ts`
- Mock Prisma client in tests using jest mocks

## URLs During Development

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000/api/v1 |
| API Docs (Swagger) | http://localhost:4000/api/docs |
| Prisma Studio | http://localhost:5555 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

## Additional Documentation

- Full project specification: `docs/qanto-spec.md`
- Complete documentation: `docs/DOCUMENTATION.md`
- README: `README.md`
