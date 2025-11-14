# Migration from Drizzle to Prisma

This document describes the migration from Drizzle ORM to Prisma ORM and the addition of Docker support.

## What Changed

### ORM Migration: Drizzle → Prisma

**Removed:**
- `drizzle-orm` package
- `drizzle-kit` package
- `better-sqlite3` package
- `@types/better-sqlite3` package
- `/db` directory (schema, migrations, seed files)
- `drizzle.config.ts`

**Added:**
- `@prisma/client` package
- `prisma` package (dev dependency)
- `tsx` package (dev dependency for running TypeScript files)
- `/prisma` directory with:
  - `schema.prisma` - Database schema definition
  - `seed.ts` - Database seeding script
- `/lib/prisma.ts` - Prisma Client singleton
- `.env.example` - Environment variables template

### Docker Integration

**Added:**
- `Dockerfile` - Production build configuration
- `docker-compose.yml` - Development environment setup
- `.dockerignore` - Files to exclude from Docker build

### Code Changes

All database queries were updated from Drizzle syntax to Prisma syntax:

**Before (Drizzle):**
```typescript
import { db } from '@/db';
import { meetups } from '@/db/schema';
import { eq } from 'drizzle-orm';

const upcomingMeetup = await db.query.meetups.findFirst({
  where: eq(meetups.isUpcoming, true),
});
```

**After (Prisma):**
```typescript
import { prisma } from '@/lib/prisma';

const upcomingMeetup = await prisma.meetup.findFirst({
  where: { isUpcoming: true },
});
```

### Type Imports

**Before:**
```typescript
import type { Meetup } from '@/db/schema';
```

**After:**
```typescript
import type { Meetup } from '@prisma/client';
```

## Why Prisma?

1. **Better Cross-Platform Support**: Prisma works consistently across all platforms, including NixOS
2. **Type Safety**: Automatic TypeScript types generated from schema
3. **Developer Experience**: Prisma Studio provides a visual database editor
4. **Modern API**: Cleaner, more intuitive query syntax
5. **Better Documentation**: Extensive documentation and community support

## Why Docker?

1. **Consistency**: Same environment for all developers regardless of OS
2. **Isolation**: Dependencies don't conflict with system packages
3. **Easy Setup**: One command to start everything
4. **Production Parity**: Development environment matches production

## Database Schema Comparison

The database schema remains the same, just defined differently:

### Drizzle Schema
```typescript
export const meetups = sqliteTable('meetups', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  // ...
});
```

### Prisma Schema
```prisma
model Meetup {
  id          Int      @id @default(autoincrement())
  title       String
  // ...
  
  @@map("meetups")
}
```

## Running the Application

### With Docker (Recommended)
```bash
docker compose up dev
```

### Without Docker
```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Create database and run migrations
npx prisma db push

# Seed the database
npx prisma db seed

# Start development server
npm run dev
```

## Database Management

### Prisma Studio
Visual database editor:
```bash
npm run db:studio
```

### Prisma CLI Commands
```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Seed the database
npx prisma db seed

# Reset database (caution: deletes all data)
npx prisma db push --force-reset

# View database in browser
npx prisma studio
```

## Troubleshooting

### Prisma Client Not Found
If you see "Cannot find module '@prisma/client'":
```bash
npx prisma generate
```

### Database Out of Sync
If schema changes aren't reflected:
```bash
npx prisma db push
```

### Docker Issues
If Docker container fails to start:
```bash
# View logs
docker compose logs dev

# Rebuild and restart
docker compose down
docker compose up dev --build
```

## Migration Checklist

- [x] Install Prisma packages
- [x] Create Prisma schema matching Drizzle schema
- [x] Create Prisma Client singleton
- [x] Update all database queries to use Prisma
- [x] Update type imports
- [x] Create seed script for Prisma
- [x] Remove Drizzle dependencies
- [x] Add Docker support
- [x] Update documentation
- [x] Test all pages and functionality

## Notes

- The SQLite database file (`sqlite.db`) remains compatible
- All existing data is preserved
- The API and functionality remain unchanged
- Only the ORM layer was replaced
