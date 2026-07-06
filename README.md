<p align="center">
<img src="public/favicon.svg" alt="Édition Logo" width="120" />
</p>
<h1 align="center">Édition — Headless Shopify Storefront Template</h1>
<p align="center">
  An editorial fashion storefront built on Astro SSR + React islands, wired to the Shopify Storefront API with a server-only private token — live cart, faceted search, and a magazine-style design system.
</p>
<p align="center">
<a href="#features">Features</a> ·
<a href="#getting-started">Getting Started</a> ·
<a href="#environment-variables">Environment</a> ·
<a href="#customization">Customization</a> ·
<a href="#deployment">Deployment</a>
</p>
<p align="center">
<img src="public/images/Look%2001.png" alt="Édition Preview" width="100%" />
</p>

---

## Features

- **Astro 7 SSR** on **Cloudflare Workers** (`@astrojs/cloudflare`) — the private Storefront token stays server-side; the browser only talks to same-origin `/api/*`.
- **Headless Shopify** — Storefront API (`2026-04`) in a strictly layered data module (`client → graphql → services → transforms`).
- **React 19 islands** — only interactive parts hydrate (cart drawer, gallery, variant selector, predictive search, wishlist); everything else is zero-JS.
- **Cross-island cart** — framework-agnostic `nanostores` store + httpOnly `cart-id` cookie, self-healing carts, Shopify hosted checkout.
- **Customer accounts** — optional login via the Customer Account API (OAuth 2.0 + PKCE).
- **Faceted shopping** — AJAX filtering, active-filter chips, sort, predictive search, mobile filter drawer.
- **Pure CSS design system** — hand-written, token-driven CSS (`--editorial-*` custom properties) with Playfair Display + Manrope, lookbook, mega-menu, Shopify-powered Journal.
- **SEO & UX** — per-page meta, OG/Twitter cards, JSON-LD, `/sitemap.xml`, scroll-reveal, wishlist + recently-viewed, accessible & responsive.

---

## Tech Stack

| Dependency | Version | Purpose |
| --- | --- | --- |
| Astro | ^7.0.5 | SSR framework (`output: "server"`) |
| @astrojs/cloudflare | ^14.1.0 | Cloudflare Workers adapter |
| @astrojs/react | ^6.0.0 | React island renderer |
| React / React DOM | ^19 | Interactive islands |
| nanostores + @nanostores/react | ^0.11 / ^0.8 | Cart store |
| lucide-react · clsx | — | Icons · class helper |

---

## Getting Started

### Prerequisites

- **Node.js >= 22.12.0** and npm / yarn / pnpm.
- A **Shopify store** with the Storefront API enabled and a **private (delegate) access token**.

### 1. Set up Shopify (Headless)

1. Create a new account or use an existing one — <https://accounts.shopify.com/store-login>.
2. Add the Shopify **Headless** channel to your store — <https://apps.shopify.com/headless>.
3. In the Headless channel, create a storefront and copy the **private Storefront access token** and your `*.myshopify.com` domain.

### 2. Install & configure

```bash
yarn install          # or npm install / pnpm install
cp .env.example .env   # then fill in your Shopify credentials
```

See [Environment Variables](#environment-variables) for what to fill in.

### 3. Run

```bash
yarn dev       # dev server at http://localhost:4321
yarn build     # production build
yarn preview   # preview the build
```

---

## Environment Variables

All Shopify variables are **server-only** (no `PUBLIC_` prefix), read via `env()` in `src/lib/shopify/client.ts`.

> ⚠️ Never add a `PUBLIC_` Shopify token — it would ship the secret to the browser.

### Storefront API (required)

| Variable | Description |
| --- | --- |
| `SHOPIFY_SHOP_DOMAIN` | Your `*.myshopify.com` domain |
| `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` | Private (delegate) Storefront access token |
| `SHOPIFY_API_VERSION` | Pinned API version (`2026-04`) |

### Customer Account API (optional — OAuth login)

| Variable | Description |
| --- | --- |
| `CUSTOMER_ACCOUNT_API_CLIENT_ID` | Client ID from the Customer Account API settings |
| `SHOPIFY_SHOP_ID` | Your store's numeric Shop ID |
| `CUSTOMER_ACCOUNT_API_VERSION` | Customer Account API version (`2025-01`) |

<details>
<summary>Enabling customer login</summary>

1. In Shopify admin, enable **New customer accounts** under *Settings → Customer accounts*.
2. Open the **Headless** sales channel → **Customer Account API**.
3. Under **Application setup**, register these URIs using your **public HTTPS origin** (`YOUR_HOST`):

   | Field | Value |
   | --- | --- |
   | Callback URI(s) | `https://YOUR_HOST/account/authorize` |
   | JavaScript origin(s) | `https://YOUR_HOST` |
   | Logout URI | `https://YOUR_HOST` |

> Shopify rejects `http`/`localhost`, so use an **HTTPS tunnel** (Cloudflare Tunnel or ngrok) in dev. The app derives its origin from `X-Forwarded-Proto` / `X-Forwarded-Host`, so tunnels work automatically.
</details>

### Contact form (optional — Resend)

| Variable | Description |
| --- | --- |
| `RESEND_API_KEY` | Resend API key; without it `/api/contact` logs the message in dev |
| `CONTACT_TO_EMAIL` | Destination inbox |
| `CONTACT_FROM_EMAIL` | Resend-verified sender (defaults to `onboarding@resend.dev`) |

---

## Customization

| What | Where |
| --- | --- |
| Brand, nav, footer, social, payment icons | `src/config/site.ts` (single source of truth) |
| Colors & typography (design tokens) | `src/styles/global.css` (`--editorial-*` CSS custom properties); fonts in `src/layouts/BaseLayout.astro` |
| Section styles | `home.css`, `catalogue.css`, `pages.css`, `about.css`, `utility.css` (imported from `global.css`) |
| Static assets | `public/images`, `public/videos` |

### Shopify data layer

Pages import from `~/lib/shopify` and call **services** only — never `client.ts` or raw GraphQL directly.

- `client.ts` — the only module that talks to Shopify
- `graphql/*.ts` — raw operations grouped by domain, sharing `fragments.ts`
- `services/*.ts` — typed functions returning clean domain shapes
- `transforms.ts` / `types.ts` — edge/node flattening and domain types
- `customer/` — Customer Account API (OAuth 2.0 + PKCE)

---

## Project Structure

```
public/            # images, videos, favicon, robots.txt
src/
  components/      # home · layout · product · collection · react (islands)
  config/site.ts   # brand, nav, footer — single source of truth
  layouts/         # BaseLayout.astro (HTML shell, SEO/JSON-LD)
  lib/shopify/     # Storefront + Customer Account API data layer
  lib/             # cart-server, wishlist, recently-viewed, pagination, utils
  pages/           # SSR routes + /api server routes
  stores/cart.ts   # nanostores cart store
  styles/          # global + per-section CSS
astro.config.mjs · package.json · tsconfig.json
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server (`astro dev`) |
| `npm run build` | Build Cloudflare Worker + assets to `dist/` |
| `npm run preview` | Build, then run on the Workers runtime |
| `npm run deploy` | Build, then `wrangler deploy` |

---

## Deployment

Platform-agnostic — deploy to Cloudflare, Vercel, Netlify, or a Node.js VPS.

### Cloudflare Workers (default)

```bash
npm run deploy   # build + wrangler deploy
```

Set secrets once: `npx wrangler secret put SHOPIFY_SHOP_DOMAIN` (and `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`).

### VPS (Node.js) / Docker

1. Clone the repo and `npm install`.
2. Create `.env` with `ASTRO_ADAPTER=node` plus your Shopify vars.
3. Build: `npm run build:node`.
4. Start: `npm run start:node`, or with PM2:
   ```bash
   pm2 start dist/server/entry.mjs --name "edition-storefront" && pm2 save
   ```
5. Reverse-proxy port `4321` (Nginx):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       location / {
           proxy_pass http://localhost:4321;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Vercel & Netlify

Connect your git repository in the provider dashboard — the runtime is auto-detected (no `ASTRO_ADAPTER` needed). Add your Shopify credentials to the dashboard's environment variables.

---

## License

Released under the MIT License. See `LICENSE`.
