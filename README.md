<p align="center">
<img src="public/favicon.svg" alt="Édition Logo" width="120" />
</p>
<h1 align="center">Édition — Headless Shopify Storefront Template</h1>
<p align="center">
  An editorial fashion storefront template built on Astro SSR + React islands, wired to the Shopify Storefront API with a server-only private token, live cart, faceted search, and a magazine-style design system.
</p>
<p align="center">
<a href="#features">Features</a> |
<a href="#pages">Pages</a> |
<a href="#getting-started">Getting Started</a> |
<a href="#environment-variables">Environment</a> |
<a href="#customization">Customization</a> |
<a href="#project-structure">Project Structure</a> |
<a href="#license">License</a>
</p>
<p align="center">
<img src="public/images/Look%2001.png" alt="Édition Preview" width="100%" />
</p>

---

## Features

- **Astro 7 SSR** (`output: "server"`) on **Cloudflare Workers** via `@astrojs/cloudflare` — the private Storefront token stays on the server (read per-request with `getSecret()`) and cart cookies work.
- **Headless Shopify** — Storefront API (`2026-04`) integration in a strictly layered data module (`client` → `graphql` → `services` → `transforms`). Every Shopify call is server-side; the browser only ever talks to same-origin `/api/*` routes.
- **React 19 islands** — only the interactive parts hydrate (cart drawer, product gallery, variant selector, predictive search, wishlist grid, cart page). Everything else is zero-JS server-rendered HTML.
- **Cross-island cart** — a framework-agnostic `nanostores` store shared by every island, backed by an httpOnly `cart-id` cookie, self-healing expired carts, and Shopify's hosted checkout.
- **Customer accounts** — optional login via the Customer Account API (OAuth 2.0 + PKCE), origin auto-derived so it works behind tunnels.
- **Faceted shopping** — AJAX filtering with active-filter chips, sort options, predictive search, and a mobile filter drawer.
- **Tailwind CSS v4** configured entirely in CSS (`@theme` / `@utility` / `@layer`) via `@tailwindcss/vite` — no `tailwind.config.js`. Design tokens are CSS custom properties.
- **Editorial design system** — Playfair Display (display) + Manrope (UI) with `--editorial-*` color tokens, a lookbook, mega-menu, and a Shopify-powered Journal (blog).
- **SEO** — per-page meta, Open Graph / Twitter cards, canonical URLs, and Organization + WebSite JSON-LD in `BaseLayout.astro` (plus Product / BlogPosting schema on detail pages), a custom `/sitemap.xml`, and `robots.txt`.
- **UX niceties** — scroll-reveal animations with `prefers-reduced-motion` support, localStorage wishlist + recently-viewed, contact form with optional Resend delivery.
- **Accessible & responsive** — skip link, focus trapping, keyboard navigation, mobile off-canvas nav, and a fully responsive grid.

---

## Pages

### Main

| Route | File |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/about` | `src/pages/about.astro` |
| `/contact` | `src/pages/contact.astro` |
| `/search` | `src/pages/search.astro` |
| `/wishlist` | `src/pages/wishlist.astro` |
| `/cart` | `src/pages/cart.astro` |

### Shop

| Route | File |
| --- | --- |
| `/products` | `src/pages/products/index.astro` |
| `/products/[handle]` | `src/pages/products/[handle].astro` |
| `/collections` | `src/pages/collections/index.astro` |
| `/collections/[handle]` | `src/pages/collections/[handle].astro` |
| `/pages/[handle]` | `src/pages/pages/[handle].astro` |

### Journal (Shopify blog)

| Route | File |
| --- | --- |
| `/journal` | `src/pages/journal/index.astro` |
| `/journal/[handle]` | `src/pages/journal/[handle].astro` |

### Account (Customer Account API)

| Route | File |
| --- | --- |
| `/account` | `src/pages/account/index.astro` |
| `/account/login` | `src/pages/account/login.ts` |
| `/account/logout` | `src/pages/account/logout.ts` |
| `/account/authorize` | `src/pages/account/authorize.ts` |

### Template Info

| Route | File |
| --- | --- |
| `/style-guide` | `src/pages/style-guide.astro` |
| `/changelog` | `src/pages/changelog.astro` |
| `/licenses` | `src/pages/licenses.astro` |

### Utility

| Route | File |
| --- | --- |
| `/password` | `src/pages/password.astro` |
| `/401` | `src/pages/401.astro` |
| `/404` | `src/pages/404.astro` |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` |

### API (server routes)

| Route | File |
| --- | --- |
| `/api/cart` · `/api/cart/add` · `/api/cart/update` · `/api/cart/remove` | `src/pages/api/cart*.ts` |
| `/api/search` | `src/pages/api/search.ts` |
| `/api/contact` | `src/pages/api/contact.ts` |

---

## Tech Stack

| Dependency | Version | Purpose |
| --- | --- | --- |
| Astro | ^7.0.5 | SSR framework (`output: "server"`) |
| @astrojs/cloudflare | ^14.1.0 | Cloudflare Workers adapter |
| wrangler | ^4.105.0 | Cloudflare CLI (dev / deploy) |
| @astrojs/react | ^6.0.0 | React island renderer |
| React / React DOM | ^19 | Interactive islands |
| Tailwind CSS | ^4.3.1 | Styling (CSS-configured, no config file) |
| @tailwindcss/vite | ^4.3.1 | Tailwind v4 Vite plugin |
| nanostores | ^0.11 | Framework-agnostic cart store |
| @nanostores/react | ^0.8 | React bindings for the store |
| lucide-react | ^1.20.0 | Icons |
| clsx | ^2.1.1 | Class name helper |

---

## Getting Started

### Prerequisites

- **Node.js >= 22.12.0**
- A **Shopify store** with the Storefront API enabled and a **private (delegate) access token**. Customer login and the contact form are optional (see [Environment](#environment-variables)).
- npm, yarn, or pnpm

### Install

```bash
yarn install
# or
npm install
# or
pnpm install
```

### Configure

```bash
cp .env.example .env
```

Then fill in your Shopify credentials — see [Environment Variables](#environment-variables).

### Development

```bash
yarn dev
```

Dev server runs at `http://localhost:4321`.

### Build

```bash
yarn build
```

Produces a standalone Node server at `dist/server/entry.mjs`.

### Preview

```bash
yarn preview
```

---

## Environment Variables

All Shopify variables are **server-only** (no `PUBLIC_` prefix), so tokens never reach the browser. They are read via the `env()` helper in `src/lib/shopify/client.ts`.

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

#### Enabling customer login

1. In Shopify admin, enable **New customer accounts** under *Settings → Customer accounts*.
2. Open the **Headless** (or Hydrogen) sales channel → **Customer Account API**.
3. Under **Application setup**, register all three URIs using your **public HTTPS origin** (`YOUR_HOST`):

   | Field | Value |
   | --- | --- |
   | Callback URI(s) | `https://YOUR_HOST/account/authorize` |
   | JavaScript origin(s) | `https://YOUR_HOST` |
   | Logout URI | `https://YOUR_HOST` |

> Shopify rejects `http` and `localhost`, so use an **HTTPS tunnel** (e.g. Cloudflare Tunnel or ngrok) in development. The app derives its origin from the `X-Forwarded-Proto` / `X-Forwarded-Host` headers, so it works behind tunnels automatically (see `src/lib/shopify/customer/origin.ts`).

### Contact form (optional — Resend)

| Variable | Description |
| --- | --- |
| `RESEND_API_KEY` | Resend API key; without it `/api/contact` logs the message in dev |
| `CONTACT_TO_EMAIL` | Destination inbox |
| `CONTACT_FROM_EMAIL` | Resend-verified sender (defaults to `onboarding@resend.dev`) |

> ⚠️ Never add a `PUBLIC_` Shopify token — it would ship the secret to the browser.

---

## Customization

### Brand, Navigation & Footer

`src/config/site.ts` is the single source of truth for all non-Shopify content — brand name and wordmark, mega-menu, header/mobile nav, newsletter CTA, footer columns, social links, and payment icons.

### Colors & Typography

Design tokens are CSS custom properties in `src/styles/global.css`, configured with Tailwind v4's `@theme` / `@utility` / `@layer` (there is no `tailwind.config.js`). Fonts (Playfair Display + Manrope) are loaded in `src/layouts/BaseLayout.astro`.

Stylesheets are split by concern and imported from `global.css`:

- `global.css` — tokens, base, layout primitives
- `home.css` — homepage sections
- `catalogue.css` — product grid & listing
- `pages.css` — journal & content pages
- `about.css` — about page
- `utility.css` — password / style-guide / changelog / error pages

### Shopify Data Layer

Pages import from `~/lib/shopify` (the barrel) and call **services** only — never `client.ts` or raw GraphQL directly:

- `client.ts` — the only module that talks to Shopify
- `graphql/*.ts` — raw operations grouped by domain, sharing `fragments.ts`
- `services/*.ts` — typed functions returning clean domain shapes
- `transforms.ts` / `types.ts` — edge/node flattening and domain types
- `customer/` — Customer Account API (OAuth 2.0 + PKCE)

### Images

Static assets live in `public/images` and `public/videos`.

---

## Project Structure

```
public/
  images/             # Static images
  videos/             # Hero / campaign videos
  favicon.svg
  robots.txt
src/
  components/
    home/             # Homepage sections (Hero, Lookbook, NewArrivals, …)
    layout/           # Header, MobileNav, Footer
    product/          # ProductCard, ProductGrid, ShopListing
    collection/       # CollectionCard
    react/            # Interactive islands (.tsx)
  config/
    site.ts           # Brand, nav, footer — single source of truth
  layouts/
    BaseLayout.astro  # HTML shell, head, SEO/JSON-LD, header + footer
  lib/
    shopify/          # Storefront + Customer Account API data layer
    cart-server.ts    # Server-side cart + httpOnly cookie
    recently-viewed.ts, wishlist.ts, pagination.ts, utils.ts
  pages/              # Routes (SSR pages + /api server routes)
  stores/
    cart.ts           # nanostores cart store
  styles/             # global + per-section CSS
astro.config.mjs
package.json
tsconfig.json
```

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server (`astro dev`) |
| `npm run build` | Build the Cloudflare Worker + static assets to `dist/` |
| `npm run preview` | Build, then run on the Workers runtime (`wrangler dev`) |
| `npm run deploy` | Build, then `wrangler deploy` to Cloudflare |
| `npm run astro` | Run Astro CLI commands |

---

## Deployment

This template is fully **platform-agnostic** and can be deployed to Cloudflare, Vercel, Netlify, or a self-hosted Node.js VPS.

### Option 1: Cloudflare Workers
Server-rendered on **Cloudflare Workers** via `@astrojs/cloudflare`.
```bash
npm run deploy      # build + wrangler deploy
```
Set the secrets once using `npx wrangler secret put SHOPIFY_SHOP_DOMAIN` / `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`.

---

### Option 2: VPS (Node.js) / Docker
To deploy on a VPS (like DigitalOcean, Hetzner, AWS, etc.) using Node.js:

1. **Clone the repository** to your server.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure environment variables**: Create a `.env` file in the root directory and ensure you set:
   ```env
   ASTRO_ADAPTER=node
   SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com
   SHOPIFY_STOREFRONT_PRIVATE_TOKEN=shpat_...
   ```
4. **Build the application**:
   ```bash
   npm run build:node
   ```
5. **Start the standalone Node server**:
   - For basic testing:
     ```bash
     npm run start:node
     ```
   - **Using PM2** (Recommended for production process management):
     ```bash
     npm install -g pm2
     pm2 start dist/server/entry.mjs --name "edition-storefront"
     pm2 save
     pm2 startup
     ```
6. **Reverse Proxy (Nginx)**: Configure your Nginx block to reverse-proxy port `4321` (or the port set in `PORT` env var) to your domain:
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

---

### Option 3: Vercel & Netlify
Deploy directly through your hosting provider's dashboard by connecting your git repository. The runtime environment is auto-detected, so you do not need to configure the `ASTRO_ADAPTER` variable. Just add the Shopify credentials to your dashboard's environment variables.

---

## License

This project is released under the MIT License. See `LICENSE`.
