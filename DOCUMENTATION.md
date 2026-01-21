# 📦 GIFA Vault - E-Commerce Documentation

> **Premium Collectibles E-Commerce Platform**
> 
> A modern, responsive web application for showcasing and selling die-cast collectibles, including Hot Wheels, Matchbox, and premium models.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Design System](#design-system)
6. [Pages & Routes](#pages--routes)
7. [Components](#components)
8. [Data Management](#data-management)
9. [Development Scripts](#development-scripts)
10. [Getting Started](#getting-started)

---

## 🎯 Project Overview

**GIFA Vault** is an e-commerce storefront designed for die-cast collectibles enthusiasts. The initial version serves as a product catalog/showcase with the following characteristics:

- **Business Focus**: Premium die-cast collectibles (Hot Wheels, Matchbox, Premium models, and Sets)
- **Target Audience**: Collectors and enthusiasts in India (prices in ₹ INR)
- **Primary Goal**: Product discovery with Instagram integration for social commerce
- **Current State**: Product catalog without shopping cart/checkout functionality

---

## 🛠 Tech Stack

### **Core Framework & Language**

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Library |
| **TypeScript** | 5.8.3 | Type-safe JavaScript |
| **Vite** | 5.4.19 | Build tool & dev server |
| **React Router DOM** | 6.30.1 | Client-side routing |

### **Styling & UI**

| Technology | Version | Purpose |
|------------|---------|---------|
| **TailwindCSS** | 3.4.17 | Utility-first CSS framework |
| **shadcn/ui** | Latest | Radix-based UI component library |
| **Framer Motion** | 12.27.1 | Animation library |
| **Lucide React** | 0.462.0 | Icon library |
| **tailwindcss-animate** | 1.0.7 | Animation utilities for Tailwind |

### **Radix UI Primitives** (via shadcn/ui)

The project uses extensive Radix UI primitives for accessible, unstyled components:

- Accordion, Alert Dialog, Aspect Ratio, Avatar
- Checkbox, Collapsible, Context Menu, Dialog
- Dropdown Menu, Hover Card, Label, Menubar
- Navigation Menu, Popover, Progress, Radio Group
- Scroll Area, Select, Separator, Slider
- Slot, Switch, Tabs, Toast, Toggle, Tooltip

### **Form Handling & Validation**

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Hook Form** | 7.61.1 | Form state management |
| **@hookform/resolvers** | 3.10.0 | Form validation resolvers |
| **Zod** | 3.25.76 | Schema validation |

### **State Management & Data Fetching**

| Technology | Version | Purpose |
|------------|---------|---------|
| **TanStack React Query** | 5.83.0 | Server state management |

### **Additional Libraries**

| Technology | Version | Purpose |
|------------|---------|---------|
| **date-fns** | 3.6.0 | Date manipulation |
| **react-day-picker** | 8.10.1 | Date picker component |
| **embla-carousel-react** | 8.6.0 | Carousel/slider component |
| **recharts** | 2.15.4 | Charting library |
| **sonner** | 1.7.4 | Toast notifications |
| **vaul** | 0.9.9 | Drawer component |
| **cmdk** | 1.1.1 | Command palette component |
| **input-otp** | 1.4.2 | OTP input component |
| **next-themes** | 0.3.0 | Theme management |
| **react-resizable-panels** | 2.1.9 | Resizable panel layout |

### **Development Tools**

| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 9.32.0 | Code linting |
| **Vitest** | 3.2.4 | Unit testing framework |
| **@testing-library/react** | 16.0.0 | React testing utilities |
| **@vitejs/plugin-react-swc** | 3.11.0 | SWC-based React plugin for Vite |
| **PostCSS** | 8.5.6 | CSS processing |
| **Autoprefixer** | 10.4.21 | CSS vendor prefixing |
| **lovable-tagger** | 1.1.13 | Component tagging (Lovable.dev integration) |

### **Package Manager**

- **npm** (with `package-lock.json`)
- **Bun** support (with `bun.lockb`)

---

## 📁 Project Structure

```
GifaVault-Ecom/
├── public/                          # Static assets
│   ├── favicon.ico                  # Site favicon
│   ├── placeholder.svg              # Placeholder image for products
│   └── robots.txt                   # Search engine directives
│
├── src/
│   ├── assets/                      # Image assets
│   │   └── hero-collectibles.jpg    # Hero section background
│   │
│   ├── components/
│   │   ├── home/                    # Homepage sections
│   │   │   ├── About.tsx            # About section
│   │   │   ├── Categories.tsx       # Category showcase
│   │   │   ├── FeaturedProducts.tsx # Featured products grid
│   │   │   ├── Hero.tsx             # Hero banner
│   │   │   └── SocialProof.tsx      # Testimonials/stats
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── Footer.tsx           # Site footer
│   │   │   ├── Header.tsx           # Navigation header
│   │   │   └── Layout.tsx           # Main layout wrapper
│   │   │
│   │   ├── ui/                      # UI components (50 files)
│   │   │   ├── ProductCard.tsx      # Custom product card
│   │   │   └── [shadcn components]  # All shadcn/ui components
│   │   │
│   │   └── NavLink.tsx              # Navigation link component
│   │
│   ├── data/
│   │   └── products.ts              # Product data & types
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx           # Mobile detection hook
│   │   └── use-toast.ts             # Toast notification hook
│   │
│   ├── lib/
│   │   └── utils.ts                 # Utility functions (cn, etc.)
│   │
│   ├── pages/
│   │   ├── Index.tsx                # Homepage
│   │   ├── Products.tsx             # Product listing page
│   │   ├── ProductDetail.tsx        # Single product page
│   │   └── NotFound.tsx             # 404 page
│   │
│   ├── test/
│   │   ├── example.test.ts          # Example test file
│   │   └── setup.ts                 # Test setup configuration
│   │
│   ├── App.tsx                      # Main app component
│   ├── App.css                      # App-specific styles
│   ├── index.css                    # Global styles & design tokens
│   ├── main.tsx                     # Entry point
│   └── vite-env.d.ts                # Vite type declarations
│
├── .gitignore                       # Git ignore rules
├── components.json                  # shadcn/ui configuration
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML entry point
├── package.json                     # Dependencies & scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.app.json                # App-specific TS config
├── tsconfig.node.json               # Node-specific TS config
├── vite.config.ts                   # Vite configuration
└── vitest.config.ts                 # Vitest configuration
```

---

## ✨ Features

### **Current Features (v0.0.0)**

#### 1. **Product Catalog**
- Display of 14 die-cast collectible products
- Product categories: Hot Wheels, Premium, Sets, Matchbox
- Featured and new product badges
- Indian Rupee (₹) pricing

#### 2. **Product Filtering & Search**
- Category-based filtering
- Text search across product names and descriptions
- URL-based category persistence (`/products?category=hotwheels`)
- Dynamic results count

#### 3. **Product Detail Pages**
- Individual product pages with dynamic routing
- Product images, descriptions, pricing
- "New Arrival" and "Featured" badges
- Related products recommendations
- Shipping/return feature icons (placeholder)

#### 4. **Responsive Design**
- Mobile-first approach
- Responsive navigation with hamburger menu
- Adaptive grid layouts (1-4 columns)

#### 5. **Animations**
- Framer Motion page transitions
- Staggered product card animations
- Hover effects on cards and buttons
- Smooth scroll and fade effects

#### 6. **Social Integration**
- Instagram link integration (@gifavault)
- "Follow Us" buttons in header and footer
- Social proof section

#### 7. **SEO Optimization**
- Meta tags (description, keywords, author)
- Open Graph tags for social sharing
- Twitter Card support

### **Placeholder Features** (Not Yet Functional)
- Shopping cart ("Add to Cart" button present but non-functional)
- Wishlist functionality
- User authentication
- Checkout process
- Actual product images (using placeholder.svg)

---

## 🎨 Design System

### **Color Palette**

The design uses a warm, premium aesthetic with orange accent colors:

#### Light Mode
| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--background` | `0 0% 96%` | Page background |
| `--foreground` | `0 0% 13%` | Primary text |
| `--primary` / `--gold` | `24 95% 53%` | Accent color (orange/gold) |
| `--secondary` | `0 0% 93%` | Secondary backgrounds |
| `--muted` | `0 0% 90%` | Muted elements |
| `--muted-foreground` | `0 0% 45%` | Muted text |

#### Dark Mode
Full dark mode support with inverted color scheme and adjusted accent colors.

### **Typography**

| Font | Usage |
|------|-------|
| **DM Serif Display** | Headings (h1-h6) |
| **DM Sans** | Body text, UI elements |

Both fonts are loaded from Google Fonts.

### **Custom Utilities**

```css
/* Color utilities */
.text-gold       /* Orange accent text */
.bg-gold         /* Orange accent background */
.bg-champagne    /* Light cream background */
.bg-cream        /* Off-white background */

/* Gradient utilities */
.gradient-gold   /* Orange gradient */
.gradient-shimmer /* Shimmer effect */

/* Shadow utilities */
.shadow-soft     /* Subtle shadow */
.shadow-card     /* Card elevation */
.shadow-elevated /* High elevation */
```

### **Component Classes**

```css
.btn-primary     /* Primary button style */
.btn-outline     /* Outline button style */
.product-card    /* Product card container */
.section-heading /* Section title style */
.section-subheading /* Section subtitle style */
```

---

## 🛣 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Index.tsx` | Homepage with Hero, Featured Products, Social Proof |
| `/products` | `Products.tsx` | Full product catalog with search & filters |
| `/products?category=X` | `Products.tsx` | Filtered by category |
| `/product/:id` | `ProductDetail.tsx` | Individual product page |
| `*` | `NotFound.tsx` | 404 error page |

---

## 🧩 Components

### **Layout Components**

| Component | Location | Description |
|-----------|----------|-------------|
| `Layout` | `layout/Layout.tsx` | Wraps pages with Header and Footer |
| `Header` | `layout/Header.tsx` | Fixed navigation bar with mobile menu |
| `Footer` | `layout/Footer.tsx` | Site footer with links and social |

### **Home Page Components**

| Component | Description |
|-----------|-------------|
| `Hero` | Full-screen hero with background image and CTAs |
| `FeaturedProducts` | Grid of 4 featured products |
| `SocialProof` | Trust indicators and statistics |
| `Categories` | Category showcase (available but not used on homepage) |
| `About` | About section (available but not used on homepage) |

### **Product Components**

| Component | Description |
|-----------|-------------|
| `ProductCard` | Reusable product display card with image, info, and link |

### **UI Components (shadcn/ui)**

The project includes 50 shadcn/ui components covering:
- Buttons, Inputs, Forms
- Dialogs, Drawers, Sheets
- Dropdowns, Menus, Select
- Toast notifications (Sonner)
- Tables, Cards, Badges
- And more...

---

## 📊 Data Management

### **Product Data Structure**

```typescript
interface Product {
  id: string;           // URL-friendly identifier
  name: string;         // Product display name
  price: number;        // Price in INR
  category: ProductCategory;  // 'hotwheels' | 'premium' | 'sets' | 'matchbox'
  description: string;  // Product description
  images: string[];     // Array of image URLs
  featured?: boolean;   // Show in featured section
  new?: boolean;        // Mark as new arrival
}
```

### **Utility Functions**

```typescript
getProductById(id: string): Product | undefined
getProductsByCategory(category: ProductCategory | 'all'): Product[]
getFeaturedProducts(): Product[]
getNewProducts(): Product[]
getCategoryLabel(category: ProductCategory): string
```

### **Sample Products (14 items)**

- **Hot Wheels**: Dodge Charger, Tesla Roadster, Ford Mustang, Chevy Camaro
- **Premium**: Porsche 911 GT3 RS, Lamborghini Aventador, Ferrari F40, McLaren P1
- **Sets**: Muscle Car Collection, JDM Legends Set, Supercar Collection
- **Matchbox**: Land Rover Defender, Fire Rescue Set, VW Beetle

---

## 📝 Development Scripts

```bash
# Start development server (port 8080)
npm run dev

# Build for production
npm run build

# Build for development (unminified)
npm run build:dev

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ recommended
- npm or Bun package manager

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd GifaVault-Ecom

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
```

### **Development Server**

The app runs at `http://localhost:8080` with:
- Hot Module Replacement (HMR)
- HMR overlay disabled for cleaner development

### **Adding New Products**

Edit `src/data/products.ts`:

```typescript
{
  id: 'product-slug',
  name: 'Product Name',
  price: 999,
  category: 'hotwheels', // or 'premium', 'sets', 'matchbox'
  description: 'Product description...',
  images: ['/path/to/image.jpg'],
  featured: true, // optional
  new: true, // optional
}
```

---

## 📦 Build Output

The production build generates optimized assets in the `dist/` directory:

- Minified JavaScript bundles
- Optimized CSS with vendor prefixes
- Static assets with content hashing

---

## 🔮 Future Enhancements

Based on the current codebase structure, potential next steps include:

1. **E-Commerce Functionality**
   - Shopping cart implementation
   - Checkout flow
   - Payment integration

2. **Backend Integration**
   - Database for products
   - User authentication
   - Order management

3. **Content**
   - Replace placeholder images with actual product photos
   - Add more products to the catalog

4. **Features**
   - Product sorting options
   - Price range filter
   - Wishlist functionality
   - Product reviews

---

## 📄 License

This project is private and proprietary to GIFA Vault.

---

*Documentation generated on January 20, 2026*
