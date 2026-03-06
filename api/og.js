import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    const siteUrl = 'https://gifa-vault-ecom.vercel.app';

    if (!id) {
        return Response.redirect(siteUrl, 302);
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return Response.redirect(`${siteUrl}/product/${id}`, 302);
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !product) {
            return Response.redirect(`${siteUrl}/product/${id}`, 302);
        }

        const productUrl = `${siteUrl}/product/${id}`;
        const imageUrl = product.image_url || `${siteUrl}/og-image.png`;
        const title = `${product.name} | GifaVault`;
        const description = product.description || `Check out ${product.name} at GifaVault`;
        const price = `₹${Number(product.price).toLocaleString('en-IN')}`;

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />

  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${price} — ${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${productUrl}" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="GifaVault" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${price} — ${description}" />
  <meta name="twitter:image" content="${imageUrl}" />

  <meta http-equiv="refresh" content="0;url=${productUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${productUrl}">${product.name} on GifaVault</a>...</p>
</body>
</html>`;

        return new Response(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (err) {
        return Response.redirect(`${siteUrl}/product/${id}`, 302);
    }
}
