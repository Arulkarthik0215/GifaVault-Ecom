/**
 * Client-side image compression utility.
 * Uses the browser-native Canvas API to resize and convert images to WebP,
 * significantly reducing file size for Supabase storage savings.
 */

export interface CompressOptions {
    /** Max width in pixels (default: 1200) */
    maxWidth?: number;
    /** Max height in pixels (default: 1200) */
    maxHeight?: number;
    /** WebP quality 0–1 (default: 0.8) */
    quality?: number;
}

/**
 * Compress an image file to WebP using Canvas.
 * Maintains aspect ratio while fitting within maxWidth × maxHeight.
 *
 * @param file  - The original image File
 * @param opts  - Optional compression settings
 * @returns       A compressed File in WebP format
 */
export const compressImage = (
    file: File,
    opts: CompressOptions = {}
): Promise<File> => {
    const { maxWidth = 1200, maxHeight = 1200, quality = 0.8 } = opts;

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const originalW = img.width;
            const originalH = img.height;

            // ── Calculate scaled dimensions (maintain aspect ratio) ──
            let { width, height } = img;
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            // ── Draw onto off-screen canvas ──
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);

            // ── Export as WebP blob ──
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Canvas compression failed'));
                        return;
                    }
                    const compressedFile = new File(
                        [blob],
                        file.name.replace(/\.[^.]+$/, '.webp'),
                        { type: 'image/webp', lastModified: Date.now() }
                    );

                    // ── Compression logs ──
                    const originalKB = (file.size / 1024).toFixed(1);
                    const compressedKB = (compressedFile.size / 1024).toFixed(1);
                    const savedPercent = ((1 - compressedFile.size / file.size) * 100).toFixed(1);

                    console.log(
                        `%c📦 Image Compression`,
                        'color: #10b981; font-weight: bold; font-size: 13px;'
                    );
                    console.table({
                        'Original': {
                            File: file.name,
                            Type: file.type,
                            Size: `${originalKB} KB`,
                            Dimensions: `${originalW} × ${originalH}`,
                        },
                        'Compressed': {
                            File: compressedFile.name,
                            Type: 'image/webp',
                            Size: `${compressedKB} KB`,
                            Dimensions: `${width} × ${height}`,
                        },
                    });
                    console.log(
                        `%c✅ Saved ${savedPercent}% — ${originalKB} KB → ${compressedKB} KB`,
                        'color: #10b981; font-weight: bold;'
                    );

                    resolve(compressedFile);
                },
                'image/webp',
                quality
            );
        };

        img.onerror = () => reject(new Error('Failed to load image for compression'));

        // ── Load image from File ──
        img.src = URL.createObjectURL(file);
    });
};
