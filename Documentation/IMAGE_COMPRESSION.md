# 🖼️ Image Compression — How It Works

> **Why?** Supabase free tier gives only **500 MB** of storage. Without compression, a few dozen high-resolution product photos can eat through that quickly. This integration compresses every uploaded image **before** it leaves the browser, typically saving **60–80%** of file size.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Step-by-Step Flow](#step-by-step-flow)
3. [File-by-File Breakdown](#file-by-file-breakdown)
4. [How the Canvas API Compression Works](#how-the-canvas-api-compression-works)
5. [Configuration & Defaults](#configuration--defaults)
6. [How to Verify Compression](#how-to-verify-compression)
7. [Example Console Output](#example-console-output)
8. [FAQs](#faqs)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│  BROWSER (Client-Side)                                               │
│                                                                      │
│  1. Admin selects image file                                         │
│          │                                                           │
│          ▼                                                           │
│  2. compressImage()  ← imageUtils.ts                                 │
│     • Load into <img> element                                        │
│     • Draw onto <canvas> (resized to max 1200px)                     │
│     • Export as WebP at 80% quality                                  │
│     • Log original vs compressed stats to console                    │
│          │                                                           │
│          ▼                                                           │
│  3. Compressed File stored in React state                            │
│     • Preview shown with file size badge (e.g. "142 KB")             │
│          │                                                           │
│          ▼                                                           │
│  4. Admin clicks "Save" → uploadProductImage()  ← supabase.ts       │
│     • Uploads the already-compressed .webp file                      │
│     • Sets contentType: 'image/webp'                                 │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────────────────┐
│  SUPABASE STORAGE                                                    │
│                                                                      │
│  product-images/                                                     │
│    ├── 1709412345678-a3b8c9d2.webp   (142 KB instead of 2.9 MB!)     │
│    ├── 1709412399012-f7e6d5c4.webp                                   │
│    └── ...                                                           │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Flow

### Step 1 — Admin Selects an Image

In `AdminDashboard.tsx`, the admin clicks the upload area, which triggers a hidden `<input type="file">`. When a file is selected, the `handleImageChange` function fires.

```tsx
// AdminDashboard.tsx — handleImageChange
const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
        const compressed = await compressImage(file);   // ← Compression happens here
        setImageFile(compressed);
        setImagePreview(URL.createObjectURL(compressed));
        const sizeKB = (compressed.size / 1024).toFixed(0);
        setCompressedSize(`${sizeKB} KB`);              // ← Shown on the preview
    } catch {
        // Fallback to original file if compression fails
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setCompressedSize('');
    }
};
```

**Key points:**
- Compression runs **immediately** when the image is selected, not when "Save" is clicked
- If compression fails for any reason, the original file is used as a **fallback**
- The compressed file size is displayed as a badge on the image preview

---

### Step 2 — Image is Compressed (Behind the Scenes)

The `compressImage()` function in `imageUtils.ts` does the heavy lifting using **browser-native APIs only** (no external libraries):

```
Original File (e.g. photo.jpg, 3.2 MB, 4032×3024)
       │
       ▼
  Load into <img> element using URL.createObjectURL()
       │
       ▼
  Calculate new dimensions:
  • Max allowed: 1200×1200
  • Original: 4032×3024
  • Scale ratio: min(1200/4032, 1200/3024) = 0.297
  • New size: 1200×900 (aspect ratio preserved!)
       │
       ▼
  Create off-screen <canvas> (1200×900)
  Draw the image onto it using ctx.drawImage()
       │
       ▼
  Export canvas as WebP blob:
  canvas.toBlob(callback, 'image/webp', 0.8)
       │
       ▼
  Wrap blob as a File object (photo.webp, ~300 KB)
       │
       ▼
  Log compression stats to browser console
       │
       ▼
  Return compressed File ✅
```

---

### Step 3 — Preview with Size Badge

After compression, the admin sees:
- The **compressed image preview** in the upload area
- A small **badge** in the bottom-right corner showing the compressed file size (e.g. "142 KB")
- The upload hint text reads: *"PNG, JPG, WebP — auto-compressed to WebP"*

---

### Step 4 — Upload to Supabase

When the admin clicks **"Save"** or **"Add Product"**, the already-compressed file is uploaded:

```tsx
// supabase.ts — uploadProductImage
export const uploadProductImage = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;

    const { error } = await supabase.storage.from('product-images').upload(fileName, file, {
        contentType: 'image/webp',    // ← Explicit WebP content type
    });
    if (error) throw error;

    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return data.publicUrl;
};
```

**Key points:**
- File name always ends with `.webp`
- `contentType` is explicitly set to `image/webp` for proper MIME handling
- The public URL is saved to the product's `image_url` field in the database

---

## File-by-File Breakdown

### `src/lib/imageUtils.ts` (NEW)

| What | Details |
|------|---------|
| **Purpose** | Client-side image compression utility |
| **Function** | `compressImage(file, options?)` |
| **Input** | Any image `File` (JPEG, PNG, WebP, etc.) |
| **Output** | Compressed `File` in WebP format |
| **Dependencies** | None — uses only browser-native Canvas API |

### `src/pages/AdminDashboard.tsx` (MODIFIED)

| Change | Details |
|--------|---------|
| **Import** | Added `compressImage` from `imageUtils` |
| **New state** | `compressedSize` — stores the compressed file size string |
| **handleImageChange** | Now `async`, calls `compressImage()` with try/catch fallback |
| **openAddForm / openEditForm** | Reset `compressedSize` state |
| **Preview area** | Shows compressed size badge when available |
| **Upload hint** | Changed to *"auto-compressed to WebP"* |

### `src/lib/supabase.ts` (MODIFIED)

| Change | Details |
|--------|---------|
| **File extension** | Always `.webp` (was dynamic based on original file) |
| **Content type** | Explicitly set to `image/webp` |

---

## How the Canvas API Compression Works

The compression uses three browser-native APIs that require **zero external libraries**:

### 1. `URL.createObjectURL(file)`
Creates a temporary browser URL for the selected file so we can load it into an `<img>` element.

### 2. `canvas.getContext('2d').drawImage(img, 0, 0, w, h)`
Draws the image onto an invisible canvas at the target dimensions. This is where **resizing** happens. The browser's built-in image interpolation handles downscaling smoothly.

### 3. `canvas.toBlob(callback, 'image/webp', quality)`
This is where the **real compression** happens:
- **Format conversion**: Converts any input format (JPEG, PNG, BMP, etc.) to **WebP**
- **Lossy compression**: The `quality` parameter (0.0 to 1.0) controls how aggressively the image is compressed
- **WebP advantage**: WebP is ~25-35% smaller than JPEG at equivalent visual quality, developed by Google

### Why WebP?

| Format | Compression | Transparency | Browser Support |
|--------|------------|--------------|-----------------|
| JPEG | Good | ❌ | ✅ Universal |
| PNG | Poor (lossless) | ✅ | ✅ Universal |
| **WebP** | **Excellent** | ✅ | ✅ All modern browsers |

---

## Configuration & Defaults

The `compressImage` function accepts an optional config object:

```typescript
interface CompressOptions {
    maxWidth?: number;   // Default: 1200px
    maxHeight?: number;  // Default: 1200px
    quality?: number;    // Default: 0.8 (80%)
}
```

### Adjusting Compression

To change defaults, edit the call in `AdminDashboard.tsx`:

```tsx
// More aggressive compression (smaller files, lower quality)
const compressed = await compressImage(file, { quality: 0.6, maxWidth: 800 });

// Higher quality (larger files, better detail)
const compressed = await compressImage(file, { quality: 0.9, maxWidth: 1600 });
```

### Quality Guide

| Quality | Typical Savings | Best For |
|---------|----------------|----------|
| `0.5` | ~90% smaller | Thumbnails, previews |
| `0.7` | ~80% smaller | General product photos |
| **`0.8`** | **~70% smaller** | **Current default — good balance** |
| `0.9` | ~50% smaller | High-detail product shots |
| `1.0` | ~30% smaller | Maximum quality (still smaller than JPEG) |

---

## How to Verify Compression

### Browser Console Logs

1. Open your app in the browser
2. Press **F12** to open **DevTools**
3. Click the **Console** tab
4. Go to Admin Dashboard → Add Product → Select an image
5. The console will show detailed compression stats

---

## Example Console Output

When you select a 2.9 MB JPEG photo, the console will show:

```
📦 Image Compression

┌────────────┬─────────────────┬──────────────┬───────────┬──────────────┐
│  (index)   │      File       │     Type     │   Size    │  Dimensions  │
├────────────┼─────────────────┼──────────────┼───────────┼──────────────┤
│  Original  │ 'car-photo.jpg' │ 'image/jpeg' │ '2945 KB' │ '4032 × 3024'│
│ Compressed │ 'car-photo.webp'│ 'image/webp' │ '312 KB'  │ '1200 × 900' │
└────────────┴─────────────────┴──────────────┴───────────┴──────────────┘

✅ Saved 89.4% — 2945 KB → 312 KB
```

---

## FAQs

### Does this affect image quality visually?

At the default 80% quality setting, the difference is **imperceptible** for product photos displayed on a website. The images are still sharp and clear — you're mostly removing data that the human eye can't distinguish.

### What if WebP is not supported?

WebP is supported by **all modern browsers** (Chrome, Firefox, Safari 14+, Edge). The only browsers that don't support it are Internet Explorer and very old Safari versions, which represent less than 1% of users.

### What happens if compression fails?

The code has a **try/catch fallback** — if compression fails for any reason (e.g. corrupted file, unsupported format), the original file is uploaded as-is. Nothing breaks.

### Can I compress existing images already in Supabase?

This compression only applies to **new uploads**. Existing images in your Supabase bucket remain in their original format. You would need to re-upload them through the admin dashboard to compress them.

### How much storage will I save?

With the default settings, expect roughly:
- **Small images** (< 500 KB): 30-50% savings
- **Medium images** (500 KB – 2 MB): 60-75% savings  
- **Large images** (> 2 MB): 80-90% savings

For a store with 100 products, this could mean using **~30 MB** instead of **~200 MB** of Supabase storage.
