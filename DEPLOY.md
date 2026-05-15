# Vercel Deployment Guide

## Step 1: Install Vercel CLI

Open terminal and run:

```bash
npm i -g vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

Follow the browser prompt to authenticate.

## Step 3: Deploy

Navigate to your project folder and run:

```bash
vercel
```

When prompted:
- **Link to existing project?** → Select existing (if `.vercel` folder exists) or create new
- **Project name** → `lena-promoters` (or your choice)

## Step 4: Set Environment Variables

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Select your project → **Settings** → **Environment Variables**

Add these variables (copy from your `.env.local` file):

| Variable | Example Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `dqkm2utm4` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `lena_promoters` |

After adding, redeploy:

```bash
vercel --prod
```

## Step 5: Add Custom Domain

1. Go to Vercel Dashboard → your project → **Domains**
2. Enter: `www.lenapromoterspvtltd.com`
3. Click **Add**

Vercel will show you DNS records. Go to your **domain registrar** (GoDaddy, Namecheap, etc.) and add:

| Type | Name | Value |
|---|---|---|
| CNAME | `www` | `cname.vercel-dns.com` |

Or if you want apex domain (root), add:

| Type | Name | Value |
|---|---|---|
| A | `@` | `76.76.21.21` |

Wait 5-30 minutes for DNS to propagate.

## Step 6: Force HTTPS & Redirect

In Vercel Dashboard → **Domains** → your domain → Enable:
- **Redirect www to apex** (or vice versa, as you prefer)

## Quick Redeploy Command

```bash
vercel --prod
```

## Troubleshooting

- **Build fails?** Check Vercel logs in dashboard → Deployments
- **Images not loading?** Ensure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
- **Supabase errors?** Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
