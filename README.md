# Lena Promoters Private Limited

Premium DTCP approved land layouts and plot sales website for Karaikudi, Tamil Nadu.

## Tech Stack

- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind CSS v4
- **Animations:** Framer Motion
- **Backend:** Supabase (PostgreSQL + REST API)
- **Image Storage:** Cloudinary (via URL integration)
- **Icons:** Lucide React

## Features

### Frontend Sections (15)
1. Top Header with contact info & social links
2. Sticky Navbar with CTA
3. Hero Section with plot search/filter
4. Animated Stats Counter
5. Featured Projects cards
6. Services grid (7 services)
7. Why Choose Us + Site Visit CTA
8. Customer Testimonials
9. Bank/Finance Partners
10. Company Credentials/Certificates
11. Photo Gallery
12. FAQ Accordion
13. Book Site Visit CTA
14. Contact Form + Map
15. Corporate Footer

### Admin Panel (11 modules)
- Dashboard with stats overview
- Project Management (CRUD)
- Services Management
- Testimonials Management
- Gallery Management
- FAQ Management
- Partners Management
- Certificates Management
- Leads Management with CSV export
- Website Settings (SEO, contact, social)

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin/](http://localhost:3000/admin/)

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

## Supabase Setup

See `ENV_SETUP.md` for complete database schema, table creation SQL, and Row Level Security policies.

## Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add Environment Variables in Vercel dashboard
4. Deploy

Or deploy manually via Vercel CLI:

```bash
npm i -g vercel
vercel --prod
```

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── layout.tsx        # Root layout + metadata
│   │   ├── globals.css       # Tailwind + brand colors
│   │   └── admin/            # Admin panel pages
│   ├── components/           # Frontend section components
│   └── lib/
│       ├── supabase.ts       # Supabase client (lazy proxy)
│       ├── types.ts          # TypeScript types
│       └── utils.ts          # Utilities
├── out/                      # Static build output
├── netlify.toml              # Netlify config
└── ENV_SETUP.md              # Database schema & setup
```
