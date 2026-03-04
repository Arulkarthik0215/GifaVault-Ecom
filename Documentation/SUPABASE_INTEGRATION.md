# 🗄️ GifaVault — Supabase Integration Guide

> A complete reference for how Supabase is set up, how it connects to the app, and how every feature works end-to-end.

---

## Table of Contents

1. [What is Supabase?](#what-is-supabase)
2. [High-Level Architecture](#high-level-architecture)
3. [Supabase Project Setup](#supabase-project-setup)
4. [Database Table: `products`](#database-table-products)
5. [Storage Bucket: `product-images`](#storage-bucket-product-images)
6. [Authentication Setup](#authentication-setup)
7. [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
8. [Environment Variables](#environment-variables)
9. [Supabase Client in Code](#supabase-client-in-code)
10. [API Helper Functions](#api-helper-functions)
11. [How Each Page Uses Supabase](#how-each-page-uses-supabase)
12. [Admin Flow: Step-by-Step](#admin-flow-step-by-step)
13. [Data Flow Diagram](#data-flow-diagram)
14. [Troubleshooting](#troubleshooting)

---

## What is Supabase?

[Supabase](https://supabase.com) is an open-source Firebase alternative that provides:

| Feature | Used in GifaVault |
|---|---|
| **PostgreSQL Database** | Stores all product data |
| **Storage** | Stores product images |
| **Auth** | Admin login (email/password) |
| **Auto-generated REST API** | Queried via `@supabase/supabase-js` |
| **Row Level Security (RLS)** | Controls who can read/write data |

We use the **Free Tier** — no credit card required, generous limits for a small store.

---

## High-Level Architecture

```
┌──────────────────────────────────────────────────────┐
│                  GifaVault Frontend                  │
│              (Vite + React + TypeScript)              │
│                                                      │
│  Public Pages          Admin Pages                   │
│  ─────────────         ──────────────────────────    │
│  Home (/)              /admin  → Login               │
│  /products             /admin/dashboard → Dashboard  │
│  /product/:id                                        │
│                                                      │
│         All pages use src/lib/supabase.ts            │
└──────────────────────┬───────────────────────────────┘
                       │  @supabase/supabase-js (v2.97)
                       │  HTTPS REST + Realtime
                       ▼
┌──────────────────────────────────────────────────────┐
│              Supabase Cloud Project                  │
│         ybqizxpdjirgmimjafzj.supabase.co             │
│                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  PostgreSQL  │  │   Storage    │  │    Auth    │  │
│  │  `products`  │  │product-images│  │ (Admin acc)│  │
│  │    table     │  │   bucket     │  │            │  │
│  └─────────────┘  └──────────────┘  └────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## Supabase Project Setup

### Step 1 — Create a Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com) and sign up (free).
2. Click **"New Project"**.
3. Fill in:
   - **Organization**: Your org name (e.g. `GifaVault`)
   - **Project Name**: `gifavault-ecom`
   - **Database Password**: Choose a strong password and save it somewhere secure.
   - **Region**: Choose the closest region (e.g. `Southeast Asia (Singapore)`)
4. Click **"Create new project"** — wait ~2 minutes for it to provision.

### Step 2 — Get Your API Keys

Once the project is ready:

1. In the left sidebar, go to **Project Settings → API**.
2. Copy these two values:
   - **Project URL** → this is your `VITE_SUPABASE_URL`
   - **anon / public key** → this is your `VITE_SUPABASE_ANON_KEY`

---

## Database Table: `products`

### Step 3 — Create the `products` Table

In the Supabase dashboard, go to **Table Editor → New Table**, or go to **SQL Editor** and run:

```sql
create table public.products (
  id          bigserial primary key,
  name        text        not null,
  price       numeric     not null,
  category    text        not null check (category in ('hotwheels', 'premium', 'sets', 'matchbox')),
  description text,
  image_url   text        default '',
  featured    boolean     not null default false,
  "new"       boolean     not null default false,
  in_stock    boolean     not null default true,
  created_at  timestamptz not null default now()
);
```

### Column Reference

| Column | Type | Description |
|---|---|---|
| `id` | `bigserial` | Auto-incrementing primary key |
| `name` | `text` | Product name (e.g. "1970 Dodge Charger R/T") |
| `price` | `numeric` | Price in Indian Rupees (₹) |
| `category` | `text` | One of: `hotwheels`, `premium`, `sets`, `matchbox` |
| `description` | `text` | Full product description |
| `image_url` | `text` | Public URL from Supabase Storage |
| `featured` | `boolean` | Shows in "Top Picks" section on homepage |
| `new` | `boolean` | Shows a "New Arrival" badge |
| `in_stock` | `boolean` | Shows "In Stock / Out of Stock" on product page |
| `created_at` | `timestamptz` | Auto-set when product is created |

---

## Storage Bucket: `product-images`

### Step 4 — Create the Storage Bucket

1. In the Supabase dashboard, go to **Storage** in the left sidebar.
2. Click **"New bucket"**.
3. Set:
   - **Name**: `product-images` *(must match exactly)*
   - **Public bucket**: ✅ toggle ON (so image URLs work without auth)
4. Click **"Create bucket"**.

### Step 5 — Set Storage Policy (Allow Public Reads)

Go to **Storage → product-images → Policies → New Policy → For full customization** and add:

```sql
-- Allow anyone to read images (SELECT)
create policy "Public can view images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

-- Allow authenticated admins to upload (INSERT)
create policy "Authenticated can upload images"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' and auth.role() = 'authenticated' );

-- Allow authenticated admins to delete (DELETE)
create policy "Authenticated can delete images"
  on storage.objects for delete
  using ( bucket_id = 'product-images' and auth.role() = 'authenticated' );
```

---

## Authentication Setup

GifaVault uses **Supabase Email/Password Auth** for the admin panel only. The storefront (public pages) requires no login.

### Step 6 — Create the Admin User

1. In Supabase dashboard, go to **Authentication → Users**.
2. Click **"Add user" → "Create new user"**.
3. Enter:
   - **Email**: your admin email (e.g. `admin@gifavault.com`)
   - **Password**: a strong password
4. Click **"Create user"**.

> ⚠️ **Important:** Do NOT share the `/admin` URL publicly. It is intentionally hidden from all navigation menus.

### How Login Works in Code

The Admin Login page (`src/pages/AdminLogin.tsx`) calls:

```typescript
const { error } = await supabase.auth.signInWithPassword({ email, password });
```

- If successful → navigates to `/admin/dashboard`
- If failed → shows error message "Invalid email or password"

Supabase stores a **session token** in the browser's `localStorage` automatically.

### How Session is Checked

On the Admin Dashboard (`src/pages/AdminDashboard.tsx`), when the page loads:

```typescript
supabase.auth.getSession().then(({ data: { session } }) => {
  if (!session) navigate('/admin');  // kick out if not logged in
});
```

If someone tries to visit `/admin/dashboard` without logging in, they're immediately redirected back to `/admin`.

### Logout

```typescript
await supabase.auth.signOut();
navigate('/admin');
```

---

## Row Level Security (RLS) Policies

### Step 7 — Set Up RLS on the `products` Table

By default, Supabase tables have RLS **disabled**, meaning everyone has full access. You must enable RLS and add policies.

Go to **SQL Editor** and run:

```sql
-- 1. Enable RLS
alter table public.products enable row level security;

-- 2. Allow ANYONE to read products (public storefront)
create policy "Public can read products"
  on public.products for select
  using (true);

-- 3. Allow only logged-in admins to insert products
create policy "Admins can insert products"
  on public.products for insert
  with check (auth.role() = 'authenticated');

-- 4. Allow only logged-in admins to update products
create policy "Admins can update products"
  on public.products for update
  using (auth.role() = 'authenticated');

-- 5. Allow only logged-in admins to delete products
create policy "Admins can delete products"
  on public.products for delete
  using (auth.role() = 'authenticated');
```

**Result:**
- 🌐 Public visitors → can only **read** products
- 🔐 Logged-in admin → can **create, read, update, delete** products

---

## Environment Variables

The Supabase credentials are stored in a `.env` file at the project root. **This file is git-ignored and should never be committed.**

### `.env` file

```env
VITE_SUPABASE_URL=https://ybqizxpdjirgmimjafzj.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_ZZojpl0i59efMj5sWDgoAA_TJwJpg9q
```

> **Why `VITE_` prefix?** Vite only exposes environment variables to the browser if they start with `VITE_`. Without this prefix, the variable would be undefined in the frontend code.

> **Is the `anon` key safe to expose?** Yes. The `anon` key is the **public** key — it's designed to be used in frontend code. Its permissions are controlled by your RLS policies. The **secret** key (`service_role`) must never be used in frontend code.

---

## Supabase Client in Code

**File:** `src/lib/supabase.ts`

This is the single file that initialises Supabase and exports all API functions.

### Client Initialisation

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

`createClient` returns a singleton client instance. Every import of `supabase` across the app uses this same instance.

### TypeScript Types

```typescript
export type ProductCategory = 'hotwheels' | 'premium' | 'sets' | 'matchbox';

export interface Product {
    id: number;
    name: string;
    price: number;
    category: ProductCategory;
    description: string;
    image_url: string;
    featured: boolean;
    new: boolean;
    in_stock: boolean;
    created_at: string;
}
```

These types mirror the database columns exactly, giving full TypeScript safety across the whole app.

---

## API Helper Functions

All Supabase queries are abstracted into named functions in `src/lib/supabase.ts`. No page directly writes raw Supabase queries — they all call these helpers.

### `getAllProducts(category?, search?)`

Used by the **Products page** to fetch filtered/searched products.

```typescript
export const getAllProducts = async (category?: ProductCategory | 'all', search?: string) => {
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });

    if (category && category !== 'all') {
        query = query.eq('category', category);        // filter by category
    }
    if (search && search.trim()) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`); // search
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Product[];
};
```

- **`.eq('category', category)`** — exact match filter
- **`.or(...ilike...)`** — case-insensitive search across name AND description
- **`.order('created_at', { ascending: false })`** — newest products first

---

### `getProductById(id)`

Used by the **Product Detail page** to load a single product.

```typescript
export const getProductById = async (id: string) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();  // throws if not found
    if (error) throw error;
    return data as Product;
};
```

---

### `getFeaturedProducts()`

Used by the **Homepage** (Featured section) and **Product Detail** page (Related Products).

```typescript
export const getFeaturedProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(4);
    if (error) throw error;
    return data as Product[];
};
```

Returns up to **4** products where `featured = true`.

---

### `insertProduct(product)`

Used by the **Admin Dashboard** to add new products.

```typescript
export const insertProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('products').insert([product]).select().single();
    if (error) throw error;
    return data as Product;
};
```

Note: `id` and `created_at` are excluded — they are auto-generated by the database.

---

### `updateProduct(id, updates)`

Used by the **Admin Dashboard** when editing an existing product.

```typescript
export const updateProduct = async (id: number, updates: Partial<Omit<Product, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Product;
};
```

---

### `deleteProduct(id)`

Used by the **Admin Dashboard** when removing a product.

```typescript
export const deleteProduct = async (id: number) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
};
```

---

### `uploadProductImage(file)`

Used by the **Admin Dashboard** when a product image is selected.

```typescript
export const uploadProductImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error } = await supabase.storage.from('product-images').upload(fileName, file);
    if (error) throw error;

    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return data.publicUrl;
};
```

- Generates a **unique filename** using timestamp + random string to avoid collisions
- Uploads to the `product-images` bucket
- Returns the **public URL** which is stored in `products.image_url`

---

### `deleteProductImage(imageUrl)`

Used by the **Admin Dashboard** when overwriting or deleting a product.

```typescript
export const deleteProductImage = async (imageUrl: string) => {
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return;
    await supabase.storage.from('product-images').remove([fileName]);
};
```

Extracts the filename from the full URL and removes it from storage.

---

## How Each Page Uses Supabase

### 🏠 Homepage (`src/pages/Index.tsx`)

The `FeaturedProducts` component calls `getFeaturedProducts()` on mount:

```typescript
// src/components/home/FeaturedProducts.tsx
useEffect(() => {
    getFeaturedProducts()
      .then(setFeatured)
      .catch(console.error)
      .finally(() => setLoading(false));
}, []);
```

Shows a **loading spinner** while fetching, then renders up to 4 featured product cards.

---

### 🛍️ Products Page (`src/pages/Products.tsx`)

Fetches all products with **live filtering** (by category) and **debounced search**:

```typescript
useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getAllProducts(activeCategory, searchQuery);
      setProducts(data);
      setLoading(false);
    };

    // Debounce search by 300ms to avoid hitting Supabase on every keystroke
    const timer = setTimeout(fetchProducts, searchQuery ? 300 : 0);
    return () => clearTimeout(timer);
}, [activeCategory, searchQuery]);
```

- Changing category → re-fetches immediately
- Typing in search → waits 300ms after user stops typing, then fetches

---

### 📦 Product Detail Page (`src/pages/ProductDetail.tsx`)

Fetches both the specific product and related (featured) products in **parallel**:

```typescript
Promise.all([
    getProductById(id),
    getFeaturedProducts(),
])
.then(([prod, featured]) => {
    setProduct(prod);
    // show related products, excluding the current one
    setRelatedProducts(featured.filter((p) => String(p.id) !== id).slice(0, 4));
})
```

---

### 🔐 Admin Login (`src/pages/AdminLogin.tsx`)

```typescript
const { error } = await supabase.auth.signInWithPassword({ email, password });
if (!error) navigate('/admin/dashboard');
```

---

### 🎛️ Admin Dashboard (`src/pages/AdminDashboard.tsx`)

Full CRUD interface:

| Action | Supabase Call |
|---|---|
| Page loads | `getAllProducts()` |
| Click "Add Product" → submit | `uploadProductImage()` + `insertProduct()` |
| Click "Edit" on row → save | `uploadProductImage()` (if new image) + `updateProduct()` + `deleteProductImage()` (old image) |
| Click "Delete" on row | `deleteProduct()` + `deleteProductImage()` |
| Click "Logout" | `supabase.auth.signOut()` |
| Page mount (auth check) | `supabase.auth.getSession()` |

---

## Admin Flow: Step-by-Step

### Adding a New Product

```
Admin opens /admin/dashboard
    → Auth check: getSession() ✅
    → Clicks "Add Product"
    → Fills form (name, price, category, description)
    → Selects image file
    → Clicks "Add Product" (submit)
        → uploadProductImage(file)
            → Supabase Storage: PUT /product-images/{unique-filename}
            → Returns publicUrl (e.g. https://...supabase.co/storage/v1/object/public/product-images/1234-abc.jpg)
        → insertProduct({ name, price, category, description, image_url: publicUrl, ... })
            → Supabase DB: INSERT INTO products (...)
    → Success toast shown
    → Product list re-fetched (getAllProducts())
```

### Editing a Product

```
Admin clicks ✏️ Edit on a product row
    → Form pre-filled with existing data + existing image shown
    → Admin changes some fields / optionally uploads new image
    → Clicks "Save Changes"
        → If new image selected:
            → uploadProductImage(newFile) → new publicUrl
            → deleteProductImage(oldImageUrl) → removes old file from Storage
        → updateProduct(id, { ...changes, image_url: newPublicUrl })
            → Supabase DB: UPDATE products SET ... WHERE id = ?
    → Success toast shown
    → Product list re-fetched
```

### Deleting a Product

```
Admin clicks 🗑️ Delete on a product row
    → Confirm dialog: "Delete 'Product Name'? This cannot be undone."
    → Admin confirms
        → deleteProduct(id) → Supabase DB: DELETE FROM products WHERE id = ?
        → deleteProductImage(product.image_url) → Supabase Storage: removes image file
    → Success toast shown
    → Product list re-fetched
```

---

## Data Flow Diagram

```
PUBLIC USER                    SUPABASE                     ADMIN
──────────                     ────────                     ─────

Opens homepage
    │
    ├──── getFeaturedProducts() ──────────────────────────►
    │                              SELECT * FROM products
    │                              WHERE featured = true
    │                              LIMIT 4
    │◄────────────────────────── returns Product[] ─────────
    │
    │ Browses /products
    ├──── getAllProducts(category, search) ────────────────►
    │                              SELECT * FROM products
    │                              WHERE category = ?
    │                              AND (name ILIKE ? OR ...)
    │◄────────────────────────── returns Product[] ─────────
    │
    │ Views /product/:id
    ├──── getProductById(id) ─────────────────────────────►
    │                              SELECT * FROM products
    │                              WHERE id = ?
    │◄────────────────────────── returns Product ───────────

                                                            Opens /admin
                                                                │
                                              signInWithPassword()
                                                ──────────────►│
                                                    Auth check  │
                                              ◄───────────── session token
                                                                │
                                                            Opens /admin/dashboard
                                                                │
                                              getAllProducts()──►
                                              ◄── Product[] ────
                                                                │
                                                            Uploads image
                                              upload to Storage──►
                                              ◄── publicUrl ────
                                                                │
                                                            insertProduct()
                                              INSERT products──►
                                              ◄── new Product───
```

---

## Troubleshooting

### ❌ "Failed to load products" shown on storefront

**Causes:**
1. `.env` file missing or has wrong values
2. RLS is enabled but the SELECT policy is missing
3. The `products` table doesn't exist yet

**Fix:** Make sure you have this policy in Supabase SQL Editor:
```sql
create policy "Public can read products"
  on public.products for select
  using (true);
```

---

### ❌ Admin login says "Invalid email or password"

**Causes:**
1. The admin user hasn't been created in Supabase Authentication
2. Wrong email/password

**Fix:** Go to Supabase dashboard → Authentication → Users → Create a new user with the email and password you want to use.

---

### ❌ Image upload fails in Admin Dashboard

**Causes:**
1. The `product-images` bucket doesn't exist
2. The storage INSERT policy is missing

**Fix:** Make sure the bucket name is exactly `product-images` and you've added the upload policy:
```sql
create policy "Authenticated can upload images"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' and auth.role() = 'authenticated' );
```

---

### ❌ Admin dashboard redirects back to `/admin` immediately

**Cause:** Auth session has expired or wasn't saved.

**Fix:** Log in again at `/admin`. Sessions last 1 hour by default (configurable in Supabase Auth settings under **Auth → Configuration → JWT expiry**).

---

### ❌ Changes not appearing after saving

**Cause:** Supabase RLS is blocking the `INSERT` or `UPDATE`.

**Fix:** Make sure the authenticated policies are in place, and that you are actually logged in (check the session).

---

## Quick Reference

| What | Where |
|---|---|
| Supabase client init | `src/lib/supabase.ts` |
| All API helpers | `src/lib/supabase.ts` |
| Admin login page | `src/pages/AdminLogin.tsx` → route `/admin` |
| Admin dashboard | `src/pages/AdminDashboard.tsx` → route `/admin/dashboard` |
| Public products page | `src/pages/Products.tsx` → route `/products` |
| Product detail page | `src/pages/ProductDetail.tsx` → route `/product/:id` |
| Featured products (homepage) | `src/components/home/FeaturedProducts.tsx` |
| Env vars file | `.env` (root of project — **git-ignored**) |
| Supabase dashboard | https://supabase.com/dashboard |

---

*Last updated: February 2026*
