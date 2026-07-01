// ============================================================
//  Dynamic sitemap — static routes + live product/collection
//  handles from Shopify (best-effort; never fails the response).
// ============================================================
import type { APIRoute } from 'astro';
import { getProducts, getAllCollections, getArticles } from '~/lib/shopify';
import { SITE } from '~/config/site';

export const prerender = false;

const STATIC_PATHS = ['/', '/products', '/collections', '/journal', '/about', '/contact', '/search', '/wishlist'];

export const GET: APIRoute = async ({ url }) => {
  const origin = url.origin;
  const paths = new Set(STATIC_PATHS);

  try {
    const [page, collections, journal] = await Promise.all([
      getProducts({ pageSize: 250, sortKey: 'BEST_SELLING' }),
      getAllCollections(),
      getArticles(SITE.blogHandle, { pageSize: 100 }).catch(() => ({ items: [] })),
    ]);
    page.items.forEach((p) => paths.add(`/products/${p.handle}`));
    collections.forEach((c) => paths.add(`/collections/${c.handle}`));
    journal.items.forEach((a) => paths.add(`/journal/${a.handle}`));
  } catch (err) {
    console.error('[sitemap] Shopify fetch failed:', (err as Error).message);
  }

  const urls = [...paths]
    .map((p) => `  <url><loc>${origin}${p}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
