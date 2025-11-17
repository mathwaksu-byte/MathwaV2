You are an expert full-stack engineer.  
Build a complete, production-ready modern webapp with the following stack and requirements:

────────────────────────────────────────────────────────
🚀 PROJECT & BRAND
────────────────────────────────────────────────────────
Project name:
“Kyrgyz State University — MATHWA (Official Partner) Website"

The project includes:
1. Client-facing website (public)
2. Admin dashboard (private)
3. API backend ( Database & authentication, Media storage)

────────────────────────────────────────────────────────
🌐 TECHNOLOGY STACK
────────────────────────────────────────────────────────
Frontend:
- Remix.run
- TailwindCSS
- React components
- SEO-ready pages
- Deployed on Cloudflare Pages

Admin Dashboard:
- Remix routes under /admin/*
- Authentication-protected
- React Table, Charts, Forms
- Image uploader connected to Supabase Storage

Backend API:
- Cloudflare Workers (Modules) runtime
- Router-based API (OpenAPI optional)
- Sessions handled by JWT or Supabase Auth
- Supabase PostgreSQL
- Prisma inside `api/prisma` using `@prisma/client/edge` with Prisma Accelerate (Data Proxy)
- Database access from Workers via Prisma Accelerate; use Supabase REST client where appropriate
- Migrations run in CI/local Node, not inside Workers
- Relations among tables

Authentication:
- Supabase Auth
- Admin role + normal user role
- Protected API routes
- Protected admin routes

Storage:
- Supabase Storage
- Buckets:
  - gallery
  - university_images
  - documents/brochures

────────────────────────────────────────────────────────
📦 DATABASE SCHEMA REQUIREMENTS (Prisma)
────────────────────────────────────────────────────────

Create a Prisma schema at `api/prisma/schema.prisma` defining:

User
- id, name, email, phone
- role: "admin" | "editor" | "student"
- createdAt, updatedAt

University
- id, name, country, city
- description
- ranking
- tuitionFee
- imageUrl
- gallery (one-to-many to Gallery)
- programs (one-to-many to Program)
- createdAt, updatedAt

Program
- id, universityId (FK)
- name
- duration
- fee
- eligibility
- description

Gallery
- id, universityId (FK optional)
- imageUrl
- title
- createdAt

PriceSettings
- id
- consultationFee
- serviceCharge
- applicationFee

ContentBlocks
- id
- key (e.g., "homepage_hero", "about_section")
- title
- body
- imageUrl

Applications
- id
- userId
- programId
- universityId
- status (Pending, Approved, Rejected)
- documents (URLs)
- notes

Messages / Contact Form
- id
- name
- email
- phone
- message

────────────────────────────────────────────────────────
📁 ROUTING STRUCTURE (Remix)
────────────────────────────────────────────────────────

Public routes:
- / → home
- /universities
- /universities/$id
- /programs/$id
- /gallery
- /about
- /contact
- /apply

Admin routes (protected):
- /admin/login
- /admin/dashboard
- /admin/universities
- /admin/universities/new
- /admin/universities/$id/edit
- /admin/prices
- /admin/gallery
- /admin/content
- /admin/applications
- /admin/messages

API routes (Workers):
- /api/auth/login
- /api/auth/verify
- /api/universities/**
- /api/programs/**
- /api/gallery/**
- /api/prices/**
- /api/content/**
- /api/applications/**
- /api/messages/**

────────────────────────────────────────────────────────
🎨 FRONTEND REQUIREMENTS
────────────────────────────────────────────────────────

Use TailwindCSS with:
- Modern UI
- Glassmorphism or soft shadow cards
- Hero section with large banner
- Responsive design
- Light + Dark mode optional

Client pages should include:
- University list + filters
- University detail with gallery + programs
- Program detail page
- Gallery grid with modal viewer
- Contact form connected to API
- Application form (user submits documents)
- SEO meta tags per page
- OpenGraph tags

────────────────────────────────────────────────────────
🛠 ADMIN DASHBOARD REQUIREMENTS
────────────────────────────────────────────────────────
Admin needs ability to:

Universities:
- Add / Edit / Delete universities
- Upload university images
- Add program(s)
- Add gallery photos

Gallery:
- Upload multiple images
- Delete images

Prices:
- Update consultationFee, serviceCharge, applicationFee

Content:
- Edit homepage content blocks
- Edit about page content

Applications:
- View all applications
- Filter by status
- Change status
- Add notes

Messages:
- Display messages from contact form

Authentication:
- Only admin role should access /admin/* routes
- Use Supabase Auth JWT
- Use loaders + actions for Remix

────────────────────────────────────────────────────────
📦 DEPLOYMENT REQUIREMENTS
────────────────────────────────────────────────────────
Deploy:
- Client (Remix) on Cloudflare Pages
- Admin (Remix) on Cloudflare Pages
 - API on Cloudflare Workers (Modules)
 - Workers use Prisma Edge (`@prisma/client/edge`) with Accelerate Data Proxy
 - Connect Workers to Supabase using environment variables

Provide deployment instructions for:
- cloudflare pages
- cloudflare workers
- supabase env connection
 - prisma migration commands (run via CI/local using direct DB connection)

────────────────────────────────────────────────────────
📘 DELIVERABLES TO OUTPUT
────────────────────────────────────────────────────────

I want you to generate:

1. Complete folder structure  
2. Prisma schema  
3. API design  
4. Example API routes code  
5. Example Remix loaders/actions  
6. Example admin UI components  
7. Supabase bucket setup  
8. Deployment instructions  
9. ENV template  
10. Secure session/auth workflow  
11. Architecture diagram (ASCII)

Generate everything clean, organized, and production-ready.

────────────────────────────────────────────────────────
END OF PROMPT
────────────────────────────────────────────────────────
