# MATHWA Deployment Guide

Complete guide for deploying all three services to production.

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Cloudflare account
- Git repository (optional, recommended)

## 1. Supabase Setup

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and keys:
   - `SUPABASE_URL`: https://xxx.supabase.co
   - `SUPABASE_ANON_KEY`: Your anon/public key
   - `SUPABASE_SERVICE_KEY`: Your service role key (keep secret!)

### Database Setup

1. Navigate to your project root
2. Set up Prisma environment variables:

```bash
# Create a .env file in api-workers folder
cd api-workers
echo 'DATABASE_URL="postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres?pgbouncer=true"' >> .env
echo 'DIRECT_URL="postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres"' >> .env
```

3. Run Prisma migrations:

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations (if using migrate instead of push)
npm run db:migrate:deploy
```

3. Create your first admin user via Supabase Dashboard:
   - Go to Authentication > Users
   - Add new user with email/password
   - Go to Table Editor > users table
   - Insert a row with the auth user ID and set `role = 'ADMIN'`

### Storage Buckets

Create the following buckets in Supabase Storage:

1. **gallery** - Public bucket for gallery images
2. **university_images** - Public bucket for university photos
3. **documents** - Private bucket for application documents

Set bucket policies:
- Public buckets: Enable public access
- Private buckets: Authenticated users only

## 2. API Workers Deployment (Cloudflare Workers)

### Install Wrangler CLI

```bash
npm install -g wrangler
```

### Login to Cloudflare

```bash
wrangler login
```

### Configure Environment Variables

Set secrets using Wrangler:

```bash
cd api-workers

# Set production secrets
wrangler secret put DATABASE_URL
wrangler secret put DIRECT_URL
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put SUPABASE_SERVICE_KEY
wrangler secret put JWT_SECRET
```

**Important Notes:**
- `DATABASE_URL` should include `?pgbouncer=true` for connection pooling
- `DIRECT_URL` should NOT include `?pgbouncer=true` (used for Prisma migrations)
- Keep your `SUPABASE_SERVICE_KEY` secret and never commit it to version control

### Deploy

```bash
npm install

# Generate Prisma Client before deployment
npm run db:generate

# Deploy to Cloudflare Workers
npm run deploy
```

Your API will be deployed to: `https://mathwa-api.YOUR_SUBDOMAIN.workers.dev`

Note this URL - you'll need it for the frontend apps.

**Important:** Prisma Client must be generated before deployment. The build includes the generated client.

## 3. Client Website Deployment (Cloudflare Pages)

### Configure Environment Variables

Create `.env` file:

```bash
cd client
cp .env.example .env
```

Edit `.env`:
```
API_URL=https://mathwa-api.YOUR_SUBDOMAIN.workers.dev
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

### Build

```bash
npm install
npm run build
```

### Deploy to Cloudflare Pages

#### Option A: Git Integration (Recommended)

1. Push your code to GitHub/GitLab
2. Go to Cloudflare Dashboard > Pages
3. Click "Create a project"
4. Connect your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `public`
   - **Root directory**: `client`
6. Add environment variables in Cloudflare Pages settings
7. Deploy!

#### Option B: Direct Upload

```bash
npm install -g wrangler
wrangler pages publish public --project-name=mathwa-client
```

## 4. Admin Dashboard Deployment (Cloudflare Pages)

### Configure Environment Variables

```bash
cd admin
cp .env.example .env
```

Edit `.env`:
```
API_URL=https://mathwa-api.YOUR_SUBDOMAIN.workers.dev
```

### Build and Deploy

```bash
npm install
npm run build
```

Deploy using Cloudflare Pages (same as client):

```bash
wrangler pages publish public --project-name=mathwa-admin
```

## 5. Post-Deployment

### Test the Applications

1. **Client**: Visit your Cloudflare Pages URL
2. **Admin**: Visit admin dashboard URL and login with admin credentials
3. **API**: Test health endpoint: `https://your-api.workers.dev/api/health`

### Custom Domain (Optional)

1. In Cloudflare Pages dashboard, go to Custom Domains
2. Add your domains:
   - Client: `www.mathwa.kg`
   - Admin: `admin.mathwa.kg`
3. Update DNS records as instructed
4. Enable "Always Use HTTPS"

### Seed Initial Data

Through admin dashboard, add:
1. Universities
2. Programs  
3. Content blocks (homepage_hero, about_section, etc.)
4. Price settings
5. Gallery images

## 6. Monitoring and Maintenance

### Cloudflare Workers Logs

```bash
cd api-workers
wrangler tail
```

### Supabase Logs

- View logs in Supabase Dashboard > Logs
- Monitor API usage and database queries

### Updates and Migrations

When updating schema:

```bash
cd api-workers

# Update your prisma/schema.prisma file, then:

# Generate Prisma Client
npm run db:generate

# Push changes to database
npm run db:push

# Or create and run migrations
npm run db:migrate
npm run db:migrate:deploy
```

Then redeploy the API workers:

```bash
npm run deploy
```

## Environment Variables Summary

### API Workers (.dev.vars for local, Cloudflare secrets for production)
```
DATABASE_URL=postgresql://...?pgbouncer=true
DIRECT_URL=postgresql://... (without pgbouncer)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
JWT_SECRET=...
```

### Client (.env)
```
API_URL=https://mathwa-api.workers.dev
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=...
```

### Admin (.env)
```
API_URL=https://mathwa-api.workers.dev
```

## Troubleshooting

### API Returns 404
- Check Wrangler deployment was successful
- Verify routes in `src/index.ts`
- Check Cloudflare Workers logs

### Authentication Fails
- Verify Supabase credentials are correct
- Check JWT_SECRET is set
- Verify user exists in database with correct role

### Build Fails
- Ensure Node.js version is 18+
- Delete `node_modules` and reinstall
- Check for TypeScript errors: `npm run typecheck`

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Test connection using `npx prisma studio`

## Security Checklist

- [ ] All secrets are set via Cloudflare secrets (not in code)
- [ ] SUPABASE_SERVICE_KEY is never exposed to client
- [ ] Admin routes require authentication
- [ ] JWT tokens are HTTP-only cookies
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled (optional, via Cloudflare)
- [ ] All dependencies are up to date

## Support

For issues or questions:
- Check logs in Cloudflare Workers dashboard
- Review Supabase logs
- Verify environment variables are set correctly
- Ensure latest code is deployed
