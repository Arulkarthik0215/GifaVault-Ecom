# 🎨 GifaVault — Site Content CMS Guide

> A complete reference for the admin-editable site content system that allows changing all website text, images, and captions from the Admin Dashboard.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Supabase Setup](#supabase-setup)
4. [Database Table: `site_content`](#database-table-site_content)
5. [Storage Bucket: `site-images`](#storage-bucket-site-images)
6. [Code Structure](#code-structure)
7. [API Helper Functions](#api-helper-functions)
8. [SiteContent Context & Hook](#sitecontent-context--hook)
9. [Editable Content Keys Reference](#editable-content-keys-reference)
10. [Admin Dashboard: Site Content Tab](#admin-dashboard-site-content-tab)
11. [How It Works End-to-End](#how-it-works-end-to-end)
12. [Adding New Editable Content](#adding-new-editable-content)
13. [Troubleshooting](#troubleshooting)

---

## Overview

The Site Content CMS allows the admin to edit **all hardcoded text and images** on the website — headings, descriptions, trust badges, background images, category card images, social links, and more — without touching any code.

**Key Features:**
- ✅ Edit all website captions and text from Admin Dashboard
- ✅ Upload/delete images for hero section, category cards, etc.
- ✅ Auto image compression (WebP conversion) before upload
- ✅ Section-grouped editor for easy navigation
- ✅ Hardcoded fallback values — site works even without the database table
- ✅ Changes reflect on the live site immediately after saving

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     GifaVault Frontend                           │
│                                                                  │
│  App.tsx                                                         │
│  └─ SiteContentProvider (fetches all content on mount)           │
│       └─ useSiteContent() hook available everywhere              │
│            └─ getContent(key, fallback) → returns dynamic value  │
│                                                                  │
│  Components using dynamic content:                               │
│  ├── Hero.tsx          (heading, subtitle, bg image, CTAs)       │
│  ├── TrustBar.tsx      (3 trust item titles & descriptions)      │
│  ├── Categories.tsx    (section headings, 4 category images)     │
│  ├── FeaturedProducts.tsx  (section headings)                    │
│  ├── SocialProof.tsx   (heading, description)                    │
│  ├── Header.tsx        (Instagram URL/handle)                    │
│  ├── Footer.tsx        (tagline, Instagram, email)               │
│  └── ProductDetail.tsx (trust badges, related heading)           │
│                                                                  │
│  Admin Dashboard                                                 │
│  └─ "Site Content" tab → edit text + upload/delete images        │
└────────────────────────────┬─────────────────────────────────────┘
                             │  @supabase/supabase-js
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                  Supabase Cloud Project                          │
│                                                                  │
│  ┌──────────────────┐  ┌────────────────┐                       │
│  │   site_content   │  │   site-images  │                       │
│  │   (PostgreSQL)   │  │   (Storage)    │                       │
│  │                  │  │                │                       │
│  │  key-value pairs │  │  Uploaded hero │                       │
│  │  for all text &  │  │  & category    │                       │
│  │  image URLs      │  │  images        │                       │
│  └──────────────────┘  └────────────────┘                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## Supabase Setup

### Step 1 — Create the `site_content` Table

Go to **Supabase Dashboard → SQL Editor** and run:

```sql
CREATE TABLE site_content (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  section TEXT NOT NULL,
  content_type TEXT DEFAULT 'text'
);

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public read access (so the website can display content)
CREATE POLICY "Public can read site_content"
  ON site_content FOR SELECT
  USING (true);

-- Authenticated users (admin) can manage all content
CREATE POLICY "Authenticated users can manage site_content"
  ON site_content FOR ALL
  USING (auth.role() = 'authenticated');
```

### Step 2 — Create the `site-images` Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click **"New bucket"**
3. Name: **`site-images`** (must match exactly)
4. Toggle **Public bucket** ON
5. Set **File size limit**: `5 MB`
6. Set **Allowed MIME types**: `image/jpeg, image/png, image/webp`
7. Click **Save**

Then run these storage policies in the **SQL Editor**:

```sql
-- Allow anyone to view site images
CREATE POLICY "Public read site-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');

-- Allow admin to upload site images
CREATE POLICY "Authenticated manage site-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-images' AND auth.role() = 'authenticated');

-- Allow admin to delete site images
CREATE POLICY "Authenticated delete site-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-images' AND auth.role() = 'authenticated');
```

---

## Database Table: `site_content`

| Column | Type | Description |
|---|---|---|
| `id` | `SERIAL` | Auto-incrementing primary key |
| `key` | `TEXT UNIQUE` | Unique identifier (e.g. `hero_heading`, `category_hotwheels_image`) |
| `value` | `TEXT` | The content value — either text or an image URL |
| `section` | `TEXT` | Section grouping (e.g. `hero`, `trust_bar`, `categories`, `global`) |
| `content_type` | `TEXT` | Either `'text'` or `'image'` |

### How It Works

- Each piece of editable content is a **key-value pair** in the table
- The `key` uniquely identifies what the content is (e.g. `hero_heading`)
- The `value` holds either the text string or a public image URL
- The `section` groups related content together for the admin editor
- When a key **doesn't exist** in the table, the component uses its **hardcoded fallback value**

---

## Storage Bucket: `site-images`

| Setting | Value |
|---|---|
| **Bucket name** | `site-images` |
| **Public** | Yes |
| **File size limit** | 5 MB |
| **Allowed MIME types** | `image/jpeg`, `image/png`, `image/webp` |

Images uploaded through the admin "Site Content" tab are stored here. The upload process automatically:
1. Compresses the image using `compressImage()` from `imageUtils.ts`
2. Converts to WebP format
3. Generates a unique filename with timestamp
4. Returns the public URL to store in the `site_content` table

---

## Code Structure

| File | Role |
|---|---|
| `src/lib/supabase.ts` | API helpers for CRUD + image upload/delete |
| `src/components/SiteContentContext.tsx` | React Context Provider + `useSiteContent()` hook |
| `src/App.tsx` | Wraps app with `SiteContentProvider` |
| `src/pages/AdminDashboard.tsx` | "Site Content" tab with section-grouped editor |
| `src/lib/imageUtils.ts` | Image compression utility (shared with product images) |

---

## API Helper Functions

All CMS-related functions live in `src/lib/supabase.ts`.

### `getSiteContent()`

Fetches all content as a key-value map. Used by the `SiteContentContext` on app load.

```typescript
export const getSiteContent = async (): Promise<Record<string, string>> => {
    const { data, error } = await supabase
        .from('site_content')
        .select('key, value');
    if (error) throw error;
    const map: Record<string, string> = {};
    data?.forEach((row: { key: string; value: string }) => {
        map[row.key] = row.value;
    });
    return map;
};
```

### `getAllSiteContentRows()`

Fetches all rows with full details. Used by the Admin Dashboard to populate the editor.

```typescript
export const getAllSiteContentRows = async (): Promise<SiteContent[]> => {
    const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section');
    if (error) throw error;
    return data as SiteContent[];
};
```

### `upsertSiteContent(key, value, section, contentType)`

Creates or updates a single content entry. Used when admin saves a section.

```typescript
export const upsertSiteContent = async (
    key: string, value: string, section: string, contentType: 'text' | 'image' = 'text'
) => {
    const { error } = await supabase
        .from('site_content')
        .upsert({ key, value, section, content_type: contentType }, { onConflict: 'key' });
    if (error) throw error;
};
```

### `uploadSiteImage(file)` / `deleteSiteImage(url)`

Upload and delete images from the `site-images` storage bucket:

```typescript
export const uploadSiteImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { error } = await supabase.storage.from('site-images').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('site-images').getPublicUrl(fileName);
    return data.publicUrl;
};

export const deleteSiteImage = async (imageUrl: string) => {
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return;
    await supabase.storage.from('site-images').remove([fileName]);
};
```

---

## SiteContent Context & Hook

**File:** `src/components/SiteContentContext.tsx`

### How It Works

1. `SiteContentProvider` wraps the entire app in `App.tsx`
2. On mount, it calls `getSiteContent()` to fetch all key-value pairs
3. Stores them in state and provides them via React Context
4. Any component can use the `useSiteContent()` hook

### Usage in Components

```typescript
import { useSiteContent } from '@/components/SiteContentContext';

const MyComponent = () => {
    const { getContent } = useSiteContent();

    return (
        <h1>{getContent('hero_heading', 'Default Heading Text')}</h1>
    );
};
```

**`getContent(key, fallback)`** returns:
- The value from the database if the key exists
- The `fallback` string if the key doesn't exist or the table is empty

This means the website **always works** — even if the `site_content` table is empty or hasn't been created yet, because every `getContent()` call has a hardcoded fallback value built in.

### Refreshing Content

The context also exposes `refreshContent()` — called after the admin saves changes so the public pages update immediately without a full page reload.

---

## Editable Content Keys Reference

### 🏠 Hero Section (`section: 'hero'`)

| Key | Type | Default |
|---|---|---|
| `hero_subtitle` | text | "Welcome to GIFA Vault" |
| `hero_heading` | text | "Curated Collectibles\nfor the Modern\nEnthusiast" |
| `hero_description` | text | "Discover rare Hot Wheels, premium die-cast models..." |
| `hero_background_image` | image | Unsplash URL |
| `hero_cta_primary` | text | "Explore Collection" |
| `hero_cta_secondary` | text | "Follow Us" |

### ✅ Trust Bar (`section: 'trust_bar'`)

| Key | Type | Default |
|---|---|---|
| `trust_item_1_title` | text | "Authentic Products" |
| `trust_item_1_description` | text | "100% genuine collectibles" |
| `trust_item_2_title` | text | "Safe Delivery" |
| `trust_item_2_description` | text | "Carefully packed & shipped" |
| `trust_item_3_title` | text | "Premium Selection" |
| `trust_item_3_description` | text | "Hand-picked rare finds" |

### 📁 Categories (`section: 'categories'`)

| Key | Type | Default |
|---|---|---|
| `categories_subtitle` | text | "Browse By Category" |
| `categories_heading` | text | "Explore Our Collection" |
| `category_hotwheels_image` | image | Unsplash URL |
| `category_premium_image` | image | Unsplash URL |
| `category_sets_image` | image | Unsplash URL |
| `category_matchbox_image` | image | Unsplash URL |

### ⭐ Featured Products (`section: 'featured'`)

| Key | Type | Default |
|---|---|---|
| `featured_subtitle` | text | "Featured" |
| `featured_heading` | text | "Top Picks from The Vault" |

### 📱 Social Proof (`section: 'social'`)

| Key | Type | Default |
|---|---|---|
| `social_heading` | text | "Join Our Community" |
| `social_description` | text | "Follow us on Instagram for new arrivals..." |

### 🏷️ Product Detail (`section: 'product_detail'`)

| Key | Type | Default |
|---|---|---|
| `trust_badge_1` | text | "100% Authentic Product" |
| `trust_badge_2` | text | "Quality Guaranteed" |
| `trust_badge_3` | text | "Safe & Secure Packaging" |
| `related_products_heading` | text | "You May Also Like" |

### 🌐 Global (`section: 'global'`)

| Key | Type | Default |
|---|---|---|
| `instagram_url` | text | "https://instagram.com/gifavault" |
| `instagram_handle` | text | "@gifavault" |
| `contact_email` | text | "contact@gifavault.com" |
| `footer_tagline` | text | "Curated collectibles for the modern enthusiast..." |

---

## Admin Dashboard: Site Content Tab

The Admin Dashboard (`/admin/dashboard`) has two tabs:

| Tab | Purpose |
|---|---|
| **Products** | Add/edit/delete products (existing functionality) |
| **Site Content** | Edit all website text and images |

### How the Site Content Tab Works

1. Admin clicks the **"Site Content"** tab
2. All existing content is loaded from the `site_content` table
3. Fields are grouped by section (Hero, Trust Bar, Categories, etc.)
4. Each section has its own **"Save Section"** button
5. For text fields: edit in text inputs or textareas
6. For image fields:
   - Shows a **preview thumbnail** of the current image
   - **"Upload Image"** button — selects, compresses, and uploads a new image
   - **"Delete"** button (red) — deletes the uploaded image, reverts to default

### Admin Flow: Editing Content

```
Admin logs in → /admin/dashboard
    → Clicks "Site Content" tab
    → getAllSiteContentRows() fetches all saved values
    → Fields are pre-filled with saved values (or empty = using fallback)
    → Admin edits text / uploads new images
    → Clicks "Save Section"
        → For each field in that section:
            → upsertSiteContent(key, value, section, type)
        → refreshContent() updates the SiteContentContext
    → Public pages immediately reflect the changes
```

### Admin Flow: Deleting an Image

```
Admin clicks "Delete" on an image field
    → Confirmation dialog: "Delete this image? The default image will be used instead."
    → Admin confirms
        → deleteSiteImage(url) removes file from site-images bucket
        → upsertSiteContent(key, '', section, 'image') clears DB value
        → refreshContent() updates context
    → Frontend component sees empty value → uses hardcoded fallback image
```

---

## Adding New Editable Content

To make a new piece of text or image editable:

### Step 1 — Add the content key to `AdminDashboard.tsx`

Find the `CONTENT_SECTIONS` array and add your field:

```typescript
{
    section: 'your_section',
    label: '📋 Your Section',
    fields: [
        { key: 'your_new_key', label: 'Your Label', type: 'text', placeholder: 'Default value' },
        { key: 'your_new_image', label: 'Your Image', type: 'image' },
    ],
},
```

### Step 2 — Use `getContent()` in your component

```typescript
const { getContent } = useSiteContent();
const myText = getContent('your_new_key', 'Default value if not set');
const myImage = getContent('your_new_image', '/default-image.jpg');
```

That's it! No database migration needed — `upsertSiteContent` handles creating new rows automatically.

---

## Troubleshooting

### ❌ "Failed to load site content" in Admin Dashboard

**Causes:**
1. The `site_content` table doesn't exist yet
2. RLS is enabled but the SELECT policy is missing

**Fix:** Run the table creation SQL from the [Supabase Setup](#supabase-setup) section.

---

### ❌ Image upload fails in Site Content tab

**Causes:**
1. The `site-images` bucket doesn't exist
2. Storage policies are missing

**Fix:** Create the bucket and run the storage policies from the [Supabase Setup](#supabase-setup) section.

---

### ❌ Changes not appearing on the website after saving

**Causes:**
1. The `upsert` is failing silently — check browser console for errors
2. RLS is blocking the INSERT/UPDATE

**Fix:** Ensure the "Authenticated users can manage site_content" policy exists and you're logged in.

---

### ❌ Website shows fallback values even after saving

**Cause:** The content value in the database might be an empty string `''`.

**Fix:** The `getContent()` function only returns the database value if it's a **non-empty string**. Make sure you're saving actual content, not empty values.

---

### ❌ Deleted image still shows on the website

**Cause:** Browser cache is serving the old image.

**Fix:** Hard refresh the page (`Ctrl + Shift + R`) to clear cached images.

---

## Quick Reference

| What | Where |
|---|---|
| CMS API helpers | `src/lib/supabase.ts` |
| Context Provider | `src/components/SiteContentContext.tsx` |
| Admin CMS editor | `src/pages/AdminDashboard.tsx` → "Site Content" tab |
| Image compression | `src/lib/imageUtils.ts` |
| Site images bucket | `site-images` (Supabase Storage) |
| Content database table | `site_content` (Supabase PostgreSQL) |

---

*Last updated: March 2026*
