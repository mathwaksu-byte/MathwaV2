# Kyrgyz State University — MATHWA (Official Partner) Website

Production-ready modern webapp with client website, admin dashboard, and API backend.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                                │
│  (Students, Visitors, Admins)                               │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             ▼                            ▼
┌────────────────────────┐   ┌───────────────────────────────┐
│   CLIENT (PUBLIC)      │   │   ADMIN DASHBOARD             │
│   - Remix.run          │   │   - Remix.run                 │
│   - TailwindCSS        │   │   - Protected Routes          │
│   - SEO Optimized      │   │   - Image Uploader            │
│   Cloudflare Pages     │   │   Cloudflare Pages            │
└────────────┬───────────┘   └──────────────┬────────────────┘
             │                              │
             │                              │
             └──────────────┬───────────────┘
                            ▼
                ┌───────────────────────────┐
                │   API BACKEND             │
                │   - Cloudflare Workers    │
                │   - JWT Auth              │
                │   - REST API              │
                └──────────┬────────────────┘
                           │
                           ▼
          ┌────────────────────────────────────┐
          │        SUPABASE                    │
          │  ┌──────────────┐  ┌────────────┐ │
          │  │ PostgreSQL   │  │  Storage   │ │
          │  │ (Prisma)     │  │  Buckets   │ │
          │  └──────────────┘  └────────────┘ │
          │  ┌──────────────┐                 │
          │  │ Auth (JWT)   │                 │
          │  └──────────────┘                 │
          └────────────────────────────────────┘
```

## 📁 Repository Structure

```
MATHWAV2/
├── client/              # Public-facing website (Remix + Cloudflare Pages)
├── admin/               # Admin dashboard (Remix + Cloudflare Pages)
├── api-workers/         # API Backend (Cloudflare Workers)
├── prisma/              # Shared database schema and migrations
└── docs/                # Documentation and deployment guides
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account
- Cloudflare account

### Setup Instructions

1. **Clone and Install**
```bash
# Install dependencies for all projects
cd client && npm install
cd ../admin && npm install
cd ../api-workers && npm install
cd ../prisma && npm install
```

2. **Configure Environment Variables**
```bash
# Copy .env.example to .env in each directory
cp client/.env.example client/.env
cp admin/.env.example admin/.env
cp api-workers/.env.example api-workers/.env
```

3. **Set up Supabase**
```bash
cd prisma
npx prisma generate
npx prisma db push
```

4. **Run Development Servers**
```bash
# Terminal 1 - Client
cd client && npm run dev

# Terminal 2 - Admin
cd admin && npm run dev

# Terminal 3 - API Workers
cd api-workers && npm run dev
```

## 🔐 Authentication Flow

1. User logs in via `/admin/login` or `/api/auth/login`
2. Supabase Auth validates credentials
3. JWT token issued and stored
4. Protected routes verify JWT on each request
5. Admin role required for `/admin/*` routes

## 📦 Tech Stack

- **Frontend**: Remix.run, React, TailwindCSS
- **Backend**: Cloudflare Workers
- **Database**: Supabase PostgreSQL + Prisma ORM
- **Auth**: Supabase Auth (JWT)
- **Storage**: Supabase Storage
- **Deployment**: Cloudflare Pages & Workers

## 📖 Documentation

See `/docs` folder for:
- Deployment guides
- API documentation
- Database schema
- Security best practices

## 🔑 Key Features

- ✅ University listings and programs
- ✅ Gallery management
- ✅ Application system
- ✅ Contact form
- ✅ Admin dashboard
- ✅ Role-based access control
- ✅ Image upload to Supabase Storage
- ✅ SEO optimized
- ✅ Responsive design

## 📝 License

Proprietary - Kyrgyz State University MATHWA Partnership
