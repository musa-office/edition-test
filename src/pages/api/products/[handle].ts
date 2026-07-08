// GET /api/products/:handle — full product detail for the quick-view modal.
import type { APIRoute } from 'astro';
import { getProduct } from '~/lib/shopify';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const handle = params.handle;
  if (!handle) {
    return new Response(JSON.stringify({ product: null }), {
      status: 400,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
  try {
    const product = await getProduct(handle);
    return new Response(JSON.stringify({ product }), {
      status: product ? 200 : 404,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
};
