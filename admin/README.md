# MATHWA Admin Dashboard

Admin dashboard for managing the MATHWA MBBS Admission Platform.

## Tech Stack

- **Framework**: React + Vite
- **Admin Framework**: React Admin
- **UI Library**: Material-UI
- **HTTP Client**: Axios

## Features

- **Dashboard**: Overview of applications and statistics
- **Universities Management**: CRUD operations for universities
- **Applications Management**: View and manage student applications
- **Testimonials Management**: Add/edit testimonials
- **FAQs Management**: Manage frequently asked questions
- **Blogs Management**: Create and manage blog posts

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set:
- `VITE_API_URL` - Backend API URL

### 3. Start Development Server

```bash
npm run dev
```

The admin panel will be available at `http://localhost:3002`

## Default Credentials

After running the API setup script:
- **Email**: admin@mathwa.com
- **Password**: Admin@123

**Important**: Change the password after first login!

## Build for Production

```bash
npm run build
```

## Deployment to Cloudflare Pages

1. Build the project:
```bash
npm run build
```

2. Deploy:
```bash
npx wrangler pages deploy ./dist
```

Or connect your GitHub repository to Cloudflare Pages.

## Environment Variables in Production

Set `VITE_API_URL` in Cloudflare Pages settings.

## License

MIT
