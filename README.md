# 🏆 GifaVault

> **Premium Die-Cast Collectibles Store**

A modern, responsive e-commerce platform for showcasing and selling premium die-cast collectibles — Hot Wheels, Matchbox, Premium models, and curated sets.

🌐 **Live:** [gifa-vault-ecom.vercel.app](https://gifa-vault-ecom.vercel.app)

---

## ✨ Features

- **Product Catalog** — Browse 14+ die-cast collectibles across 4 categories
- **Search & Filter** — Find products by name, description, or category
- **Product Details** — Detailed pages with images, pricing, and related products
- **Admin Dashboard** — Secure login + full CRUD for managing products
- **Image Compression** — Client-side image optimization during uploads (WebP, resize, quality control)
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Smooth Animations** — Framer Motion page transitions and micro-interactions
- **Dark Mode** — Full dark mode support
- **SEO Optimized** — Open Graph, Twitter Cards, meta tags
- **Instagram Integration** — Social commerce via [@gifavault](https://instagram.com/gifavault)

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | TailwindCSS, shadcn/ui, Framer Motion |
| **Backend** | Supabase (Database, Auth, Storage) |
| **State** | TanStack React Query |
| **Forms** | React Hook Form + Zod |
| **Deployment** | Vercel |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or Bun
- Supabase project (for backend features)

### Installation

```bash
# Clone the repository
git clone https://github.com/Arulkarthik0215/GifaVault-Ecom.git
cd GifaVault-Ecom

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with:
# VITE_SUPABASE_URL=<your-supabase-url>
# VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# Start development server
npm run dev
```

### Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run test       # Run tests
```

---

## 📁 Project Structure

```
GifaVault-Ecom/
├── Documentation/          # Project documentation
│   ├── DOCUMENTATION.md    # Full technical docs
│   ├── DEPLOYMENT.md       # Deployment guide
│   ├── IMAGE_COMPRESSION.md
│   └── SUPABASE_INTEGRATION.md
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── home/           # Homepage sections (Hero, Categories, etc.)
│   │   ├── layout/         # Header, Footer, Layout wrapper
│   │   └── ui/             # shadcn/ui components + ProductCard
│   ├── data/               # Product data & types
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities (Supabase client, image utils)
│   ├── pages/              # Route pages
│   │   ├── Index.tsx       # Homepage
│   │   ├── Products.tsx    # Product catalog
│   │   ├── ProductDetail.tsx
│   │   ├── AdminLogin.tsx  # Admin authentication
│   │   └── AdminDashboard.tsx # Product management
│   ├── App.tsx             # App entry + routes
│   └── index.css           # Global styles & design tokens
├── vercel.json             # Vercel deployment config
└── package.json
```

---

## 🔐 Admin Access

Navigate to `/admin` to access the admin dashboard. Authentication is handled via Supabase Auth.

**Admin features:**
- Add, edit, and delete products
- Upload and compress product images
- Manage product categories and pricing

---

## 📄 Documentation

Detailed documentation is available in the [`Documentation/`](./Documentation) folder:

- [**DOCUMENTATION.md**](./Documentation/DOCUMENTATION.md) — Full technical documentation
- [**DEPLOYMENT.md**](./Documentation/DEPLOYMENT.md) — Production deployment guide
- [**SUPABASE_INTEGRATION.md**](./Documentation/SUPABASE_INTEGRATION.md) — Supabase setup & integration
- [**IMAGE_COMPRESSION.md**](./Documentation/IMAGE_COMPRESSION.md) — Image compression implementation

---

## 📄 License

This project is private and proprietary to GIFA Vault.

---

*Built with ❤️ by [Arulkarthik](https://github.com/Arulkarthik0215)*
