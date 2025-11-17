# MATHWA Project Structure

Complete file structure for all repositories.

```
MATHWAV2/
├── README.md                          # Main project documentation
├── .env.template                      # Environment variables template
│
├── prisma/                            # Database schema (shared)
│   ├── package.json
│   ├── schema.prisma                  # Complete Prisma schema
│   └── README.md
│
├── api-workers/                       # Cloudflare Workers API
│   ├── src/
│   │   ├── index.ts                   # Main worker entry
│   │   ├── routes/
│   │   │   ├── auth.ts               # Authentication routes
│   │   │   ├── universities.ts       # Universities CRUD
│   │   │   ├── programs.ts           # Programs CRUD
│   │   │   ├── gallery.ts            # Gallery management
│   │   │   ├── prices.ts             # Price settings
│   │   │   ├── content.ts            # Content blocks
│   │   │   ├── applications.ts       # Applications management
│   │   │   └── messages.ts           # Contact messages
│   │   └── utils/
│   │       ├── cors.ts                # CORS utilities
│   │       └── auth.ts                # Auth middleware
│   ├── package.json
│   ├── wrangler.toml                  # Cloudflare Workers config
│   ├── tsconfig.json
│   └── .dev.vars.example              # Local env template
│
├── client/                            # Public website (Remix)
│   ├── app/
│   │   ├── root.tsx                   # Root layout
│   │   ├── tailwind.css               # Tailwind styles
│   │   ├── lib/
│   │   │   └── api.ts                 # API client
│   │   ├── components/
│   │   │   ├── Header.tsx             # Header component
│   │   │   └── Footer.tsx             # Footer component
│   │   └── routes/
│   │       ├── _index.tsx             # Homepage
│   │       ├── universities._index.tsx # Universities list
│   │       ├── universities.$id.tsx   # University detail
│   │       ├── programs.$id.tsx       # Program detail
│   │       ├── gallery.tsx            # Gallery page
│   │       ├── about.tsx              # About page
│   │       ├── contact.tsx            # Contact page
│   │       └── apply.tsx              # Application form
│   ├── public/
│   │   └── favicon.ico
│   ├── package.json
│   ├── remix.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── .env.example
│
├── admin/                             # Admin dashboard (Remix)
│   ├── app/
│   │   ├── root.tsx                   # Root layout
│   │   ├── tailwind.css               # Tailwind styles
│   │   ├── lib/
│   │   │   ├── auth.server.ts         # Server-side auth
│   │   │   └── api.server.ts          # API client
│   │   ├── routes/
│   │   │   ├── admin.login.tsx        # Login page
│   │   │   ├── admin.tsx              # Admin layout (sidebar)
│   │   │   ├── admin.dashboard.tsx    # Dashboard home
│   │   │   ├── admin.universities._index.tsx      # Universities list
│   │   │   ├── admin.universities.new.tsx         # Add university
│   │   │   ├── admin.universities.$id.edit.tsx    # Edit university
│   │   │   ├── admin.applications.tsx # Applications management
│   │   │   ├── admin.messages.tsx     # Messages inbox
│   │   │   ├── admin.gallery.tsx      # Gallery management
│   │   │   ├── admin.content.tsx      # Content editor
│   │   │   ├── admin.prices.tsx       # Price settings
│   │   │   └── admin.logout.tsx       # Logout action
│   │   └── components/
│   │       ├── UniversityForm.tsx
│   │       └── FileUploader.tsx
│   ├── public/
│   ├── package.json
│   ├── remix.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── .env.example
│
└── docs/                              # Documentation
    ├── DEPLOYMENT.md                  # Deployment guide
    ├── API.md                         # API documentation
    ├── DATABASE.md                    # Database schema docs
    └── SUPABASE_SETUP.md             # Supabase configuration
```

## Key Files by Purpose

### Database & Schema
- `prisma/schema.prisma` - Complete database schema with all models

### API Backend
- `api-workers/src/index.ts` - Main API entry with router
- `api-workers/src/routes/*` - All API route handlers
- `api-workers/src/utils/auth.ts` - JWT authentication middleware

### Client Website
- `client/app/root.tsx` - Root layout with SEO
- `client/app/routes/_index.tsx` - Homepage with hero
- `client/app/routes/universities._index.tsx` - Universities listing
- `client/app/routes/contact.tsx` - Contact form
- `client/app/lib/api.ts` - API client utilities

### Admin Dashboard
- `admin/app/routes/admin.login.tsx` - Admin authentication
- `admin/app/routes/admin.tsx` - Admin layout with sidebar
- `admin/app/routes/admin.dashboard.tsx` - Admin home with stats
- `admin/app/routes/admin.universities._index.tsx` - Manage universities
- `admin/app/lib/auth.server.ts` - Server-side auth utilities

### Configuration
- `.env.template` - Environment variables reference
- `*/package.json` - Dependencies for each project
- `*/tsconfig.json` - TypeScript configuration
- `*/tailwind.config.js` - TailwindCSS theming

### Documentation
- `README.md` - Project overview and quick start
- `docs/DEPLOYMENT.md` - Complete deployment guide
- `docs/API.md` - API endpoint documentation

## Technology Stack

### Frontend (Both Client & Admin)
- **Framework**: Remix.run v2.5
- **Styling**: TailwindCSS v3.4
- **Language**: TypeScript
- **Deployment**: Cloudflare Pages

### Backend
- **Runtime**: Cloudflare Workers
- **Router**: itty-router v4
- **Language**: TypeScript
- **Deployment**: Wrangler CLI

### Database & Auth
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma v5.8
- **Authentication**: Supabase Auth (JWT)
- **Storage**: Supabase Storage

## Environment Variables

### Required for API Workers
```
DATABASE_URL          # Supabase PostgreSQL connection
SUPABASE_URL          # Supabase project URL
SUPABASE_ANON_KEY     # Public anon key
SUPABASE_SERVICE_KEY  # Secret service key
JWT_SECRET            # JWT signing secret
```

### Required for Client
```
API_URL               # API Workers URL
SUPABASE_URL          # (optional) For direct access
SUPABASE_ANON_KEY     # (optional) For direct access
```

### Required for Admin
```
API_URL               # API Workers URL
```

## Development Commands

### API Workers
```bash
cd api-workers
npm install
npm run dev          # Start dev server
npm run deploy       # Deploy to Cloudflare
```

### Client Website
```bash
cd client
npm install
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
```

### Admin Dashboard
```bash
cd admin
npm install
npm run dev          # Start dev server (port 3001)
npm run build        # Build for production
```

### Database
```bash
cd prisma
npm install
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Open Prisma Studio GUI
```

## Features Implemented

### Public Website
✅ Homepage with hero section
✅ Universities listing with filters
✅ University detail pages
✅ Program listings
✅ Gallery with images
✅ Contact form
✅ About page
✅ Application form
✅ SEO meta tags & OpenGraph
✅ Responsive design

### Admin Dashboard
✅ Secure login
✅ Dashboard with statistics
✅ Universities management (CRUD)
✅ Programs management (CRUD)
✅ Applications tracking
✅ Messages inbox
✅ Gallery management
✅ Content editor
✅ Price settings
✅ Role-based access control

### API Backend
✅ RESTful API design
✅ JWT authentication
✅ Role-based authorization
✅ CRUD operations for all models
✅ Query filtering
✅ Error handling
✅ CORS support
✅ Public & protected routes

### Database
✅ 8 core models
✅ Proper relations
✅ Indexes for performance
✅ Enums for status types
✅ Timestamps
✅ Cascade deletes

## Deployment Targets

- **API**: Cloudflare Workers (https://mathwa-api.workers.dev)
- **Client**: Cloudflare Pages (https://mathwa-client.pages.dev)
- **Admin**: Cloudflare Pages (https://mathwa-admin.pages.dev)
- **Database**: Supabase (PostgreSQL + Storage)

## Next Steps

1. Set up Supabase project
2. Configure environment variables
3. Deploy API Workers
4. Deploy Client & Admin to Cloudflare Pages
5. Create first admin user
6. Seed initial data
7. Test all functionality
8. Set up custom domains
9. Enable monitoring
10. Go live!
