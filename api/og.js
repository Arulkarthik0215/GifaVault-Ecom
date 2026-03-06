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
        // Use Supabase REST API directly — no SDK needed
        const res = await fetch(
            `${supabaseUrl}/rest/v1/products?id=eq.${id}&select=*&limit=1`,
            {
                headers: {
                    'apikey': supabaseAnonKey,
                    'Authorization': `Bearer ${supabaseAnonKey}`,
                },
            }
        );

        const products = await res.json();
        const product = products?.[0];

        if (!product) {
            return Response.redirect(`${siteUrl}/product/${id}`, 302);
        }

        const productUrl = `${siteUrl}/product/${id}`;
        const imageUrl = product.image_url || `${siteUrl}/og-image.png`;
        const title = `${product.name} | GifaVault`;
        const desc = (product.description || `Check out ${product.name} at GifaVault`).replace(/"/g, '&quot;');
        const price = new Intl.NumberFormat('en-IN').format(product.price);

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="₹${price} — ${desc}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="${productUrl}" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="GifaVault" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="₹${price} — ${desc}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta http-equiv="refresh" content="0;url=${productUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${productUrl}">${product.name}</a>...</p>
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
