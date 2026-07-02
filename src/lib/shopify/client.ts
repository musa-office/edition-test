// ============================================================
//  Shopify Storefront API client (server-side, private token)
// ============================================================
// All Shopify traffic flows through here. It is imported only by
// server code (Astro frontmatter + /api routes), so the private
// token never reaches the browser.

// Secrets are read at request time via getSecret(): Cloudflare Workers exposes
// them per-request (no process.env, and non-PUBLIC vars aren't inlined). Reading
// at module top-level would yield undefined on the edge, so resolve lazily.
import { getSecret } from 'astro:env/server';

const getDomain = () => getSecret('SHOPIFY_SHOP_DOMAIN');
const getVersion = () => getSecret('SHOPIFY_API_VERSION') ?? '2026-04';
const getToken = () => getSecret('SHOPIFY_STOREFRONT_PRIVATE_TOKEN');
const getEndpoint = () => `https://${getDomain()}/api/${getVersion()}/graphql.json`;

export class ShopifyError extends Error {
  status?: number;
  details?: unknown;
  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'ShopifyError';
    this.status = status;
    this.details = details;
  }
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export interface ShopifyFetchOptions {
  /** Real buyer IP — forwarded so Shopify's bot rate-limiting attributes correctly. */
  buyerIp?: string;
}

/**
 * Execute a Storefront GraphQL operation. Throws ShopifyError on
 * transport or GraphQL errors; otherwise returns the typed `data`.
 */
export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: ShopifyFetchOptions = {},
): Promise<T> {
  const domain = getDomain();
  const token = getToken();
  if (!domain || !token) {
    throw new ShopifyError(
      'Missing Shopify config. Set SHOPIFY_SHOP_DOMAIN and SHOPIFY_STOREFRONT_PRIVATE_TOKEN in .env',
    );
  }

  let res: Response;
  try {
    res = await fetch(getEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Shopify-Storefront-Private-Token': token,
        ...(options.buyerIp ? { 'Shopify-Storefront-Buyer-IP': options.buyerIp } : {}),
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch (cause) {
    throw new ShopifyError('Network error talking to Shopify', undefined, cause);
  }

  let json: GraphQLResponse<T>;
  try {
    json = (await res.json()) as GraphQLResponse<T>;
  } catch (cause) {
    throw new ShopifyError(`Invalid JSON from Shopify (HTTP ${res.status})`, res.status, cause);
  }

  if (!res.ok) {
    throw new ShopifyError(`Shopify HTTP ${res.status} ${res.statusText}`, res.status, json);
  }
  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((e) => e.message).join('; '), res.status, json.errors);
  }
  if (!json.data) {
    throw new ShopifyError('Empty response from Shopify', res.status);
  }
  return json.data;
}

export const shopifyConfig = {
  get DOMAIN() {
    return getDomain();
  },
  get VERSION() {
    return getVersion();
  },
  get ENDPOINT() {
    return getEndpoint();
  },
};
