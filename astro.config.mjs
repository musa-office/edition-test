// @ts-check
import { defineConfig, envField, sessionDrivers } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import node from "@astrojs/node";
import vercel from "@astrojs/vercel";
import netlify from "@astrojs/netlify";

function getAdapter() {
  const target = process.env.ASTRO_ADAPTER;
  if (target === "node") {
    return node({ mode: "standalone" });
  }
  if (target === "vercel" || process.env.VERCEL === "1" || process.env.VERCEL === "true") {
    return vercel();
  }
  if (target === "netlify" || process.env.NETLIFY === "true") {
    return netlify();
  }
  if (target === "cloudflare" || process.env.CF_PAGES === "1") {
    return cloudflare({ imageService: "passthrough" });
  }
  // Default fallback
  return cloudflare({ imageService: "passthrough" });
}

// Headless Shopify storefront — server-rendered on Cloudflare Workers so the
// private Storefront token stays on the server and cart cookies work.
// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: getAdapter(),
  integrations: [react()],
  // This app doesn't use Astro.session. Pick an in-memory driver so the
  // Cloudflare adapter doesn't force a KV "SESSION" binding at deploy time.
  session: {
    driver: sessionDrivers.lruCache(),
  },
  // Single source of truth for env vars. Secrets are read at runtime via
  // getSecret() (Workers exposes them per-request, not as process.env).
  env: {
    schema: {
      SHOPIFY_SHOP_DOMAIN: envField.string({ context: "server", access: "secret" }),
      SHOPIFY_STOREFRONT_PRIVATE_TOKEN: envField.string({ context: "server", access: "secret" }),
      SHOPIFY_API_VERSION: envField.string({ context: "server", access: "secret", optional: true }),
      CUSTOMER_ACCOUNT_API_CLIENT_ID: envField.string({ context: "server", access: "secret", optional: true }),
      SHOPIFY_SHOP_ID: envField.string({ context: "server", access: "secret", optional: true }),
      CUSTOMER_ACCOUNT_API_VERSION: envField.string({ context: "server", access: "secret", optional: true }),
      RESEND_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      CONTACT_TO_EMAIL: envField.string({ context: "server", access: "secret", optional: true }),
      CONTACT_FROM_EMAIL: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // Allow the tunnel host to reach the dev server (otherwise Vite
    // blocks unknown Host headers). localhost is always allowed.
    server: {
      allowedHosts: true,
    },
  },
});
