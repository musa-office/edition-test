// GET /api/cart — current cart from the httpOnly cart-id cookie.
import type { APIRoute } from 'astro';
import { getBuyerIp, json, readCart } from '~/lib/cart-server';

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
  try {
    const { cart } = await readCart(ctx.cookies, getBuyerIp(ctx));
    return json({ cart });
  } catch (err) {
    return json({ cart: null, error: (err as Error).message }, 500);
  }
};
