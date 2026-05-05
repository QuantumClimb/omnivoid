# OMNIVOID LABS - Database & API Implementation Plan

**Project:** Dynamic Content Management System for OMNIVOID LABS  
**Database:** Neon PostgreSQL  
**ORM:** Prisma  
**API Hosting:** Vercel Serverless Functions  
**Authentication:** Simple password-based (single admin)  
**Version:** 1.0  
**Date:** May 1, 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication](#authentication)
6. [Data Migration](#data-migration)
7. [Implementation Steps](#implementation-steps)
8. [Environment Variables](#environment-variables)
9. [Deployment](#deployment)

---

## Overview

This document outlines the implementation of a dynamic content management system for OMNIVOID LABS, a concert series platform with multiple editions. The system will allow the admin to:

- Create and manage editions (OMNIVOID 2024, 2025, etc.)
- Add/edit/delete resources (audio, video, posters, documents, links)
- Customize themes and branding per edition
- Manage all content through a simple admin interface

### Current State
- Static content in `public/` folders
- Google Drive integration for some files
- Hardcoded data in JavaScript files
- No content management interface

### Target State
- Dynamic content from Neon PostgreSQL
- Admin dashboard for content management
- Edition-based content organization
- React-based admin UI

---

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Database | Neon PostgreSQL | Serverless PostgreSQL database |
| ORM | Prisma | Type-safe database access |
| API | Next.js API Routes | Serverless API endpoints |
| Hosting | Vercel | API and frontend hosting |
| Auth | bcrypt + JWT | Simple password authentication |
| Frontend | React 19 | Admin dashboard UI |

---

## Database Schema

### Prisma Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// EDITIONS - Concert series editions
// ============================================
model Edition {
  id          String   @id @default(cuid())
  name        String   // "OMNIVOID 2024", "OMNIVOID 2025"
  slug        String   @unique // "2024", "2025" - URL-friendly
  description String?  // Edition description
  logoUrl     String?  // Google Drive URL or local path
  themeColors Json?    // { primary: "#99ccff", secondary: "#336699" }
  isActive    Boolean  @default(false)
  startDate   DateTime?
  endDate     DateTime?
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  resources   Resource[]
  
  @@index([slug])
  @@index([isActive])
}

// ============================================
// RESOURCES - Content items for editions
// ============================================
model Resource {
  id          String   @id @default(cuid())
  editionId   String
  edition     Edition  @relation(fields: [editionId], references: [id], onDelete: Cascade)
  
  type        ResourceType // AUDIO, VIDEO, POSTER, DOCUMENT, LINK, GALLERY
  title       String
  description String?
  
  // For Google Drive or external links
  url         String?  // YouTube URL, Google Drive URL, etc.
  
  // For local files (relative path)
  filePath    String?  // "public/audio/track.mp3"
  
  // Thumbnail preview
  thumbnailUrl String? // Google Drive image URL
  
  // Type-specific metadata
  metadata    Json?    // { duration, artist, youtubeId, mixcloudId, etc. }
  
  sortOrder   Int      @default(0)
  isFeatured  Boolean  @default(false)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([editionId])
  @@index([type])
  @@index([isActive])
}

enum ResourceType {
  AUDIO        // Music files, Mixcloud playlists
  VIDEO        // YouTube videos
  POSTER       // Event posters/flyers
  DOCUMENT     // PDFs, research papers
  LINK         // External links
  GALLERY      // Images
  LOGO         // Edition logos
  TEXT_CONTENT // Text content (replaces .txt files)
}

// ============================================
// ADMIN USER - Simple authentication
// ============================================
model AdminUser {
  id        String   @id @default(cuid())
  email     String   @unique // Admin email/username
  password  String   // Bcrypt hash
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ============================================
// SITE SETTINGS - Global configuration
// ============================================
model SiteSettings {
  id        String   @id @default(cuid())
  key       String   @unique // "currentEdition", "siteTitle", etc.
  value     Json     // Flexible value storage
  updatedAt DateTime @updatedAt
}
```

### Entity Relationship Diagram

```
┌─────────────────┐
│     Edition     │
├─────────────────┤
│ id (PK)         │
│ name            │
│ slug (unique)   │
│ description     │
│ logoUrl         │
│ themeColors     │
│ isActive        │
│ startDate       │
│ endDate         │
│ sortOrder       │
└────────┬────────┘
         │ 1:N
         │
┌────────▼────────┐
│    Resource     │
├─────────────────┤
│ id (PK)         │
│ editionId (FK)  │
│ type            │
│ title           │
│ description     │
│ url             │
│ filePath        │
│ thumbnailUrl    │
│ metadata        │
│ sortOrder       │
│ isFeatured      │
│ isActive        │
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│   AdminUser     │     │  SiteSettings   │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ email (unique)  │     │ key (unique)    │
│ password        │     │ value (JSON)    │
│ isActive        │     │ updatedAt       │
└─────────────────┘     └─────────────────┘
```

---

## API Endpoints

### Public Endpoints (No Authentication)

#### Get All Active Editions
```
GET /api/editions
```
Response:
```json
[
  {
    "id": "xxx",
    "name": "OMNIVOID 2024",
    "slug": "2024",
    "description": "...",
    "logoUrl": "...",
    "themeColors": { "primary": "#99ccff" },
    "isActive": true
  }
]
```

#### Get Edition Details
```
GET /api/editions/[slug]
```
Response:
```json
{
  "id": "xxx",
  "name": "OMNIVOID 2024",
  "slug": "2024",
  "description": "...",
  "logoUrl": "...",
  "themeColors": { "primary": "#99ccff" },
  "resources": [
    {
      "id": "yyy",
      "type": "AUDIO",
      "title": "Summer Mix 2024",
      "url": "https://mixcloud.com/...",
      "metadata": { "duration": 3600 }
    }
  ]
}
```

#### Get Resources by Type
```
GET /api/editions/[slug]/[type]
```
Types: `audio`, `video`, `posters`, `documents`, `gallery`

### Admin Endpoints (Authentication Required)

#### Login
```
POST /api/admin/login
Body: { "password": "admin-password" }
```
Response:
```json
{
  "token": "jwt-token",
  "expiresAt": "2024-01-01T00:00:00Z"
}
```

#### Manage Editions
```
GET    /api/admin/editions          - List all editions
POST   /api/admin/editions          - Create edition
PUT    /api/admin/editions/[id]     - Update edition
DELETE /api/admin/editions/[id]     - Delete edition
```

#### Manage Resources
```
GET    /api/admin/resources?editionId=xxx  - List resources
POST   /api/admin/resources                 - Create resource
PUT    /api/admin/resources/[id]            - Update resource
DELETE /api/admin/resources/[id]            - Delete resource
```

#### Manage Settings
```
GET /api/admin/settings    - Get all settings
PUT /api/admin/settings    - Update settings
```

---

## Authentication

### Simple Password Authentication

1. **Single Admin User**: One admin with a password stored in the database
2. **Password Hashing**: bcrypt for secure password storage
3. **Session Management**: JWT tokens for API authentication
4. **Middleware**: Auth middleware to protect admin routes

### Implementation

```typescript
// lib/auth.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  } catch {
    return null;
  }
}
```

---

## Data Migration

### Current Content → Database

| Current Location | Target Table | Type |
|-----------------|--------------|------|
| `public/links/conundrum.txt` | Resource | TEXT_CONTENT |
| `public/links/contact.txt` | Resource | TEXT_CONTENT |
| `public/links/labs.txt` | Resource | TEXT_CONTENT |
| `public/links/live_transmissions.txt` | Resource | TEXT_CONTENT |
| `public/gallery/*.png` | Resource | GALLERY |
| `public/gigs/*.png` | Resource | POSTER |
| `public/docs/*.pdf` | Resource | DOCUMENT |
| `public/audio/*.mp3` | Resource | AUDIO |
| `public/logos/*.svg` | Resource | LOGO |
| Mixcloud playlists | Resource | AUDIO |
| YouTube links | Resource | VIDEO |

### Migration Script

```typescript
// scripts/migrate-content.ts
import { prisma } from '../lib/prisma';

async function migrateContent() {
  // Create default edition
  const edition = await prisma.edition.create({
    data: {
      name: 'OMNIVOID 2024',
      slug: '2024',
      description: 'Current edition',
      isActive: true,
    }
  });

  // Migrate text content
  const textFiles = ['conundrum', 'contact', 'labs', 'live_transmissions'];
  for (const file of textFiles) {
    const content = await fs.readFile(`public/links/${file}.txt`, 'utf8');
    await prisma.resource.create({
      data: {
        editionId: edition.id,
        type: 'TEXT_CONTENT',
        title: file.replace('_', ' ').toUpperCase(),
        description: content.substring(0, 100),
        metadata: { content },
        isActive: true,
      }
    });
  }

  console.log('Migration complete!');
}
```

---

## Implementation Steps

### Step 1: Set Up Neon Database
1. Create Neon account at https://neon.tech
2. Create new project "omnivoid-labs"
3. Copy DATABASE_URL from connection settings
4. Test connection with psql or pgAdmin

### Step 2: Initialize Prisma
```bash
# Install dependencies
npm install prisma @prisma/client --save-dev
npm install @prisma/client

# Initialize Prisma
npx prisma init

# Create schema.prisma (see Database Schema section)

# Run migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### Step 3: Create API Structure
```
src/
├── app/
│   ├── api/
│   │   ├── editions/
│   │   │   ├── route.ts
│   │   │   └── [slug]/
│   │   │       └── route.ts
│   │   └── admin/
│   │       ├── login/
│   │       │   └── route.ts
│   │       ├── editions/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── resources/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       └── settings/
│   │           └── route.ts
│   └── admin/
│       └── page.tsx
└── lib/
    ├── prisma.ts
    └── auth.ts
```

### Step 4: Implement Authentication
1. Create admin user seed script
2. Implement login endpoint
3. Add auth middleware
4. Test authentication flow

### Step 5: Build Edition Management API
1. GET /api/admin/editions - List all editions
2. POST /api/admin/editions - Create edition
3. PUT /api/admin/editions/[id] - Update edition
4. DELETE /api/admin/editions/[id] - Delete edition

### Step 6: Build Resource Management API
1. GET /api/admin/resources - List resources
2. POST /api/admin/resources - Create resource
3. PUT /api/admin/resources/[id] - Update resource
4. DELETE /api/admin/resources/[id] - Delete resource

### Step 7: Create Admin UI
1. Login page
2. Dashboard with edition list
3. Edition editor form
4. Resource manager
5. Settings panel

---

## Environment Variables

### `.env`
```env
# Database
DATABASE_URL="postgresql://user:password@ep-xxx.aws.neon.tech/neondb?sslaccept=strict"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this"
ADMIN_PASSWORD="change-this-password"

# Application
NEXT_PUBLIC_API_URL="https://your-domain.vercel.app/api"
```

### `.env.example`
```env
# Database - Get from Neon dashboard
DATABASE_URL=""

# Authentication - Generate a strong secret
JWT_SECRET=""
ADMIN_PASSWORD=""

# Application - Your Vercel domain
NEXT_PUBLIC_API_URL=""
```

---

## Deployment

### Vercel Configuration

1. **Connect GitHub Repository**
   - Push code to GitHub
   - Import project in Vercel

2. **Add Environment Variables**
   - DATABASE_URL (from Neon)
   - JWT_SECRET
   - ADMIN_PASSWORD

3. **Deploy**
   - Vercel automatically builds and deploys
   - API routes available at `/api/*`

4. **Run Migrations**
   ```bash
   # After deployment, run migrations
   npx prisma migrate deploy
   npx prisma generate
   ```

### Post-Deployment

1. **Create Admin User**
   ```bash
   # Run seed script
   npm run seed:admin
   ```

2. **Migrate Content**
   ```bash
   npm run migrate:content
   ```

3. **Test API**
   ```bash
   # Test public endpoint
   curl https://your-domain.vercel.app/api/editions
   
   # Test admin login
   curl -X POST https://your-domain.vercel.app/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{"password":"your-password"}'
   ```

---

## Appendix

### Resource Metadata Examples

#### Audio Resource
```json
{
  "duration": 3600,
  "artist": "DJ Name",
  "mixcloudId": "djname/summer-mix-2024",
  "genre": "Electronic"
}
```

#### Video Resource
```json
{
  "youtubeId": "dQw4w9WgXcQ",
  "duration": 180,
  "platform": "youtube"
}
```

#### Text Content Resource
```json
{
  "content": "Full text content here...",
  "format": "markdown"
}
```

### API Response Formats

#### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

#### Error Response
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message"
}
```

---

**Document Version:** 1.0  
**Last Updated:** May 1, 2026  
**Maintained By:** OMNIVOID Labs Development Team