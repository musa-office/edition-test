// ============================================================
//  Customer Account API — authenticated GraphQL client
// ============================================================
// Bound to the current request's cookies. Transparently refreshes the
// access token when it is about to expire and re-persists the cookies.
import type { AstroCookies } from 'astro';
import { getGraphqlEndpoint } from './config';
import { refreshTokens } from './oauth';
import { clearTokens, getTokens, setTokens } from './session';

/** Thrown when the visitor is not (or no longer) authenticated. */
export class NotAuthenticatedError extends Error {
  constructor(message = 'Not authenticated') {
    super(message);
    this.name = 'NotAuthenticatedError';
  }
}

// Refresh a little before the real expiry to avoid mid-request races.
const EXPIRY_BUFFER_MS = 60_000;

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export interface CustomerClient {
  isLoggedIn(): boolean;
  query<T>(query: string, variables?: Record<string, unknown>): Promise<T>;
}

export function createCustomerClient(cookies: AstroCookies, origin: string): CustomerClient {
  async function validAccessToken(): Promise<string> {
    const tokens = getTokens(cookies);
    if (!tokens) throw new NotAuthenticatedError();

    if (tokens.expiresAt - Date.now() > EXPIRY_BUFFER_MS) {
      return tokens.accessToken;
    }

    // Token expired/expiring → refresh. If that fails, the session is dead.
    try {
      const next = await refreshTokens({
        refreshToken: tokens.refreshToken,
        idToken: tokens.idToken,
        origin,
      });
      setTokens(cookies, next);
      return next.accessToken;
    } catch (cause) {
      clearTokens(cookies);
      throw new NotAuthenticatedError(`Session refresh failed: ${(cause as Error).message}`);
    }
  }

  return {
    isLoggedIn() {
      return getTokens(cookies) !== null;
    },

    async query<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
      const accessToken = await validAccessToken();

      const res = await fetch(getGraphqlEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          // Node's fetch (undici) sends NO User-Agent by default, and Shopify's
          // edge blocks header-less requests with an HTML "Access denied" page
          // (surfacing as a 403). A browser always sends one — so must we.
          'User-Agent': 'Astro Shopify Customer Account',
          // Public client: Shopify validates the Origin against the registered
          // JavaScript origin. A browser sends it automatically; server-side we
          // must set it explicitly, otherwise a valid token is 403-Forbidden.
          Origin: origin,
          // Customer Account API expects the raw token — NOT "Bearer <token>".
          Authorization: accessToken,
        },
        body: JSON.stringify({ query, variables }),
      });

      if (res.status === 401 || res.status === 403) {
        clearTokens(cookies);
        throw new NotAuthenticatedError(`Customer Account API returned ${res.status}`);
      }

      // The API must answer with JSON. A dead session returns a clean JSON 401
      // (handled above); an HTML body instead means the endpoint URL itself is
      // wrong — Shopify 301/302-redirects a malformed `shopify.com/<id>/…` URL
      // to an HTML page, and parsing that is what produced "Unexpected token
      // '<', <!DOCTYPE". Read the body as text first and surface a clear,
      // actionable error rather than the cryptic parse failure. Do NOT clear
      // the session here — the token is likely fine; the config is not.
      const raw = await res.text();
      if (raw.trimStart().startsWith('<')) {
        console.error(
          `[customer] Customer Account API returned HTML (HTTP ${res.status}) from ` +
            `${getGraphqlEndpoint()} — the endpoint URL is malformed. Verify the ` +
            'SHOPIFY_SHOP_ID and CUSTOMER_ACCOUNT_API_VERSION secrets (no stray spaces/newlines).',
        );
        throw new Error(
          'Account service misconfigured: the API returned an HTML page instead of JSON. ' +
            'Check the SHOPIFY_SHOP_ID and CUSTOMER_ACCOUNT_API_VERSION values.',
        );
      }

      let json: GraphQLResponse<T>;
      try {
        json = JSON.parse(raw) as GraphQLResponse<T>;
      } catch {
        throw new Error(`Customer Account API returned an unreadable response (HTTP ${res.status})`);
      }

      if (!res.ok) {
        throw new Error(`Customer Account API HTTP ${res.status} ${res.statusText}`);
      }
      if (json.errors?.length) {
        throw new Error(json.errors.map((e) => e.message).join('; '));
      }
      if (!json.data) throw new Error('Empty response from Customer Account API');
      return json.data;
    },
  };
}
