# OMNIVOID LABS - Database Setup Guide

This guide walks you through setting up the database system for OMNIVOID LABS.

## Prerequisites

- Node.js 18+ installed
- Neon PostgreSQL database (integrated with Vercel)
- Environment variables configured (see `.env.example`)

## Neon Integration Status

✅ **Neon database is integrated with Vercel project `omnivoidlabs`**

The integration automatically provides:
- `DATABASE_URL` - Pooled connection (for serverless/Prisma Client)
- `DATABASE_URL_UNPOOLED` - Direct connection (for migrations)

### Connection Details
- **Project:** neondb
- **Host:** ep-little-mode-aoc3bpze
- **Region:** ap-southeast-1 (Singapore)

## Quick Start

### 1. Set Up Environment Variables

The `.env` file should already be configured with the Neon connection. Verify it exists:

```bash
cat .env
```

You should see:
```env
DATABASE_URL="postgresql://neondb_owner:***@ep-little-mode-aoc3bpze-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:***@ep-little-mode-aoc3bpze.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

### 2. Configure Authentication

Before running, set your admin password and JWT secret in `.env`:

```bash
# Generate a strong JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Set admin password (minimum 8 characters)
ADMIN_PASSWORD="your-secure-password"
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Run Database Migrations

```bash
npm run db:migrate
```

This creates all the database tables:
- `Edition` - Concert series editions
- `Resource` - Content items (audio, video, posters, etc.)
- `AdminUser` - Admin authentication
- `SiteSettings` - Global configuration

### 5. Create Admin User

```bash
npm run seed:admin
```

This creates the initial admin user with the password from `ADMIN_PASSWORD`.

### 6. (Optional) Migrate Existing Content

If you have existing content in the `public/` folder, migrate it to the database:

```bash
npm run migrate:content
```

## API Endpoints

### Public Endpoints (No Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/editions` | List all active editions |
| GET | `/api/editions/[slug]` | Get edition details with resources |
| GET | `/api/editions/[slug]/[type]` | Get resources by type |

### Admin Endpoints (Requires Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Login and get JWT token |
| GET | `/api/admin/editions` | List all editions |
| POST | `/api/admin/editions` | Create new edition |
| PUT | `/api/admin/editions/[id]` | Update edition |
| DELETE | `/api/admin/editions/[id]` | Delete edition |
| GET | `/api/admin/resources` | List resources |
| POST | `/api/admin/resources` | Create resource |
| PUT | `/api/admin/resources/[id]` | Update resource |
| DELETE | `/api/admin/resources/[id]` | Delete resource |
| GET | `/api/admin/settings` | Get settings |
| PUT | `/api/admin/settings` | Update settings |

## Authentication

All admin endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your-admin-password"}'
```

## Useful Commands

```bash
# Database commands
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Create and apply migrations
npm run db:deploy        # Apply migrations (production)
npm run db:push          # Push schema changes directly
npm run db:studio        # Open Prisma Studio (visual database editor)

# Seed commands
npm run seed:admin       # Create/update admin user
npm run migrate:content  # Migrate static content to database
```

## Project Structure

```
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── config.ts        # Prisma configuration
│   └── migrations/      # Database migrations
├── src/
│   ├── lib/
│   │   ├── prisma.ts    # Prisma client singleton
│   │   └── auth.ts      # Authentication utilities
│   └── api/
│       ├── editions/    # Public edition endpoints
│       └── admin/       # Admin endpoints
├── scripts/
│   ├── seed-admin.ts    # Admin user seed script
│   └── migrate-content.ts # Content migration script
├── .env                 # Environment variables (DO NOT COMMIT)
├── .env.example         # Environment variables template
└── DATABASE.md          # Detailed implementation plan
```

## Vercel Deployment

The Neon integration automatically syncs environment variables to Vercel. When you deploy:

1. Push your code to GitHub
2. Vercel automatically deploys
3. Environment variables are inherited from the integration

### Manual Vercel Environment Setup

If needed, add these to Vercel project settings:
- `DATABASE_URL` (pooled)
- `DATABASE_URL_UNPOOLED` (for migrations)
- `JWT_SECRET`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_API_URL`

## Troubleshooting

### Prisma Client Not Found

If you get errors about PrismaClient not being found:

```bash
npm run db:generate
```

### Database Connection Issues

1. Verify your `DATABASE_URL` is correct
2. Check that your Neon project is active at https://neon.tech
3. Ensure the Vercel-Neon integration is active

### Migration Errors

If migrations fail, try resetting:

```bash
npx prisma migrate reset
npm run db:migrate
```

⚠️ **Warning:** This will delete all data in the database.

### Connection Pooling

- Use `DATABASE_URL` (pooled) for Prisma Client in serverless functions
- Use `DATABASE_URL_UNPOOLED` for migrations and direct database operations

## Support

For issues or questions:
- Check the DATABASE.md file for detailed implementation details
- Prisma documentation: https://pris.ly/d/prisma-schema
- Neon documentation: https://neon.tech/docs
- Vercel-Neon integration: https://vercel.com/docs/storage/neon