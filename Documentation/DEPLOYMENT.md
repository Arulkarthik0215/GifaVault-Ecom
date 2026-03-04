# 🚀 GifaVault — Deployment Guide

> Step-by-step guide for deploying GifaVault to production using Vercel.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deployment to Vercel](#deployment-to-vercel)
3. [Environment Variables](#environment-variables)
4. [SPA Routing Fix](#spa-routing-fix)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Supabase Production Configuration](#supabase-production-configuration)
8. [Alternative Hosting Platforms](#alternative-hosting-platforms)
9. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure the following:

| # | Task | Status |
|---|------|--------|
| 1 | Run `npm run build` locally — no errors | ✅ |
| 2 | Run `npm run preview` — test production build locally | ✅ |
| 3 | `.env` file is listed in `.gitignore` | ✅ |
| 4 | Supabase Row Level Security (RLS) is enabled on all tables | ✅ |
| 5 | `vercel.json` is present with SPA rewrite rules | ✅ |
| 6 | All code is committed and pushed to GitHub | ✅ |

---

## 🔧 Deployment to Vercel

### Why Vercel?

- **Auto-detects Vite** — zero config needed
- **Free tier** — 100 GB bandwidth/month, automatic HTTPS
- **GitHub integration** — auto-deploys on every `git push`
- **Preview deployments** — every PR gets its own preview URL

### Step-by-Step

#### 1. Push to GitHub

```bash
git add .
git commit -m "ready for production"
git push origin main
```

#### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. **Sign up / Log in with GitHub**
3. Click **"Add New Project"**
4. Under **"Import Git Repository"**, find and select `GifaVault-Ecom`
   - If the repo is not visible, click **"Adjust GitHub App Permissions"** to grant Vercel access
5. Vercel auto-detects the framework as **Vite**

> **Note:** The repo can remain **private** — Vercel accesses it through the GitHub App integration.

#### 3. Configure Build Settings

Vercel auto-detects these, but verify:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

#### 4. Add Environment Variables

In the Vercel project settings → **Environment Variables**, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |

> ⚠️ Copy these from your local `.env` file. Never commit the `.env` file to Git.

#### 5. Deploy

Click **"Deploy"** — Vercel builds and deploys automatically.

**Live URL:** [https://gifa-vault-ecom.vercel.app](https://gifa-vault-ecom.vercel.app)

---

## 🔀 SPA Routing Fix

Since GifaVault is a **Single Page Application (SPA)** using React Router, directly navigating to routes like `/admin` or `/products/1` would return a **404** error from Vercel. This is because Vercel looks for an actual file at that path.

### The Fix: `vercel.json`

A `vercel.json` file was added to the project root with rewrite rules:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**How it works:** All incoming requests are rewritten to serve `index.html`, allowing React Router to handle client-side routing.

---

## 🌐 Custom Domain Setup

To connect a custom domain (e.g., `gifavault.com`):

1. Go to your Vercel project → **Settings** → **Domains**
2. Enter your domain name and click **Add**
3. Update your domain's DNS settings:
   - **Option A (Recommended):** Add a CNAME record pointing to `cname.vercel-dns.com`
   - **Option B:** Add an A record pointing to `76.76.21.21`
4. Vercel automatically provisions a **free SSL certificate**

---

## ✅ Post-Deployment Verification

After each deployment, verify these routes:

| Route | Expected Behavior |
|-------|-------------------|
| `/` | Homepage loads with hero, featured products, categories |
| `/products` | Product catalog with search and category filters |
| `/products?category=hotwheels` | Filtered product listing |
| `/product/:id` | Individual product detail page |
| `/admin` | Admin login page loads (no 404) |
| `/admin` (after login) | Admin dashboard with product management |

### Things to Check

- [ ] All product images load correctly from Supabase Storage
- [ ] Product CRUD operations work from the admin dashboard
- [ ] Admin login/logout works properly
- [ ] Search and category filtering work
- [ ] Responsive design works on mobile devices
- [ ] Page transitions and animations are smooth

---

## 🔐 Supabase Production Configuration

### Row Level Security (RLS)

Ensure RLS policies are configured on the `products` table:

```sql
-- Allow public read access
CREATE POLICY "Public read access" ON products
  FOR SELECT USING (true);

-- Allow authenticated users to manage products
CREATE POLICY "Admin insert" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete" ON products
  FOR DELETE USING (auth.role() = 'authenticated');
```

### Allowed Origins

In Supabase Dashboard → **Settings** → **API**:
- Add your production domain: `https://gifa-vault-ecom.vercel.app`
- Add your custom domain if configured

### Storage Bucket

Ensure the `product-images` bucket:
- Has public read access enabled
- Has upload policies restricted to authenticated users
- Has a reasonable file size limit (e.g., 5MB)

---

## 🔄 Continuous Deployment

Vercel automatically redeploys on every push to `main`:

```bash
# Make changes
git add .
git commit -m "your changes"
git push

# Vercel detects the push and redeploys automatically (~1-2 minutes)
```

### Preview Deployments

- Every pull request gets a unique preview URL
- Test changes before merging to `main`
- Preview URLs follow the pattern: `gifa-vault-ecom-<hash>.vercel.app`

---

## 🏗 Alternative Hosting Platforms

### Netlify

```bash
# Build command: npm run build
# Publish directory: dist
# Add _redirects file for SPA routing:
# /*    /index.html   200
```

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting  # Set public dir to "dist", configure as SPA
npm run build
firebase deploy
```

### GitHub Pages

Works but requires additional configuration for SPA routing (hash router or 404.html workaround).

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **404 on routes like `/admin`** | Missing SPA rewrite rules | Add `vercel.json` with rewrites (see above) |
| **Blank page after deploy** | Missing environment variables | Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel settings |
| **Images not loading** | Supabase Storage bucket not public | Enable public access on the `product-images` bucket |
| **Build fails** | Dependency or TypeScript errors | Run `npm run build` locally first to debug |
| **Admin login not working** | Supabase Auth not configured | Verify email auth is enabled in Supabase → Authentication → Providers |
| **CORS errors** | Production domain not allowed | Add domain to Supabase allowed origins |

### Useful Commands

```bash
# Test production build locally
npm run build && npm run preview

# Check Vercel deployment logs
# Go to vercel.com → Project → Deployments → Click latest → View logs

# Redeploy without code changes (clear cache)
# Vercel Dashboard → Deployments → Redeploy
```

---

*Last updated: March 5, 2026*
