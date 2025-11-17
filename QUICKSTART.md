# MATHWA Quick Start Guide

Get up and running with local development in minutes.

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Cloudflare account (free tier works)

## 1. Supabase Setup (5 minutes)

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to provision

### Get Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`  
   - **service_role key** → `SUPABASE_SERVICE_KEY`

### Create Storage Buckets
1. Go to **Storage** → **New bucket**
2. Create three public buckets:
   - `gallery`
   - `university_images`
   - `documents` (make this one private)

## 2. Database Setup (3 minutes)

### Configure Environment
```bash
cd api-workers
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` with your Supabase credentials:
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-ID].supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=any_random_string_here
```

### Run Migrations
```bash
npm install
npm run db:generate
npm run db:push
```

## 3. Start Development Servers (1 minute)

### Terminal 1 - API
```bash
cd api-workers
npm run dev
```
API runs at: http://localhost:8787

### Terminal 2 - Client
```bash
cd client
cp .env.example .env
# Edit .env: API_URL=http://localhost:8787
npm install
npm run dev
```
Client runs at: http://localhost:3000

### Terminal 3 - Admin (Optional)
```bash
cd admin
cp .env.example .env
# Edit .env: API_URL=http://localhost:8787
npm install
npm run dev
```
Admin runs at: http://localhost:3001

## 4. Create First Admin User

### Via Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter email: `admin@example.com`
4. Enter password (save this!)
5. Click **Create user**

### Add Admin Role
1. Go to **Table Editor** → **users**
2. Click **Insert row**
3. Fill in:
   - `id`: Copy from auth user (uuid)
   - `email`: `admin@example.com`
   - `name`: `Admin User`
   - `role`: `ADMIN`
4. Click **Save**

## 5. Test the Application

### Test API
Visit: http://localhost:8787/api/health

Should return: `{"status":"ok","timestamp":"..."}`

### Test Client
Visit: http://localhost:3000

You should see the homepage!

### Test Admin
1. Visit: http://localhost:3001/admin/login
2. Login with: `admin@example.com` / `your_password`
3. You should see the admin dashboard

## 6. Add Sample Data (Optional)

### Via Admin Dashboard
1. Login to admin at http://localhost:3001
2. Navigate to **Universities** → **Add New**
3. Fill in university details
4. Add programs and gallery images

### Via API (using curl)
```bash
# Login first to get token
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'

# Use the token from response
TOKEN="your_token_here"

# Create university
curl -X POST http://localhost:8787/api/universities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Kyrgyz State University",
    "country": "Kyrgyzstan",
    "city": "Bishkek",
    "description": "Leading university in Central Asia",
    "ranking": 1,
    "tuitionFee": 3000
  }'
```

## Common Issues & Solutions

### ❌ "Failed to fetch" in client
- **Problem:** API not running or wrong URL
- **Solution:** Check API is running at http://localhost:8787
- **Solution:** Verify `API_URL` in client/.env

### ❌ Database connection error
- **Problem:** Wrong DATABASE_URL
- **Solution:** Get connection string from Supabase Settings → Database
- **Solution:** Make sure to include `?pgbouncer=true`

### ❌ Authentication fails
- **Problem:** Wrong Supabase keys
- **Solution:** Double-check keys in .dev.vars
- **Solution:** Make sure user exists in both auth AND users table

### ❌ CORS errors
- **Problem:** Browser blocking requests
- **Solution:** Make sure API CORS is configured (already done)
- **Solution:** Check API and client are on different ports

### ❌ Prisma Client not found
- **Problem:** Prisma Client not generated
- **Solution:** Run `npm run db:generate` in api-workers

## Development Workflow

### Making Database Changes
1. Edit `api-workers/prisma/schema.prisma`
2. Run `npm run db:generate`
3. Run `npm run db:push`
4. Restart API server

### Adding New API Routes
1. Create new file in `api-workers/src/routes/`
2. Import and mount in `api-workers/src/index.ts`
3. API auto-reloads with wrangler dev

### Adding New Pages
**Client:**
- Add file to `client/app/routes/`
- Remix auto-detects routes

**Admin:**
- Add file to `admin/app/routes/admin.*.tsx`
- Follow existing naming pattern

## Useful Commands

```bash
# API Workers
cd api-workers
npm run dev              # Start dev server
npm run db:generate      # Generate Prisma Client  
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio GUI
npm run deploy           # Deploy to Cloudflare

# Client/Admin
npm run dev              # Start dev server
npm run build            # Build for production
npm run typecheck        # Check TypeScript errors
```

## Next Steps

Once everything is working locally:

1. ✅ Add sample universities and programs
2. ✅ Test all features (apply, contact, gallery)
3. ✅ Customize branding and content
4. ✅ Follow `DEPLOYMENT.md` to deploy to Cloudflare
5. ✅ Set up custom domain

## Resources

- **Full Deployment Guide:** `docs/DEPLOYMENT.md`
- **API Documentation:** `docs/API.md`
- **Implementation Summary:** `IMPLEMENTATION_SUMMARY.md`
- **Environment Template:** `.env.template`

## Support

If you run into issues:
1. Check API logs in terminal
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Make sure all dependencies are installed (`npm install`)

---

Happy coding! 🚀
