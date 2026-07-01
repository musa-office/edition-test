// ============================================================
//  Site configuration — Édition brand, navigation, footer.
//  Single source of truth (DRY) for all non-Shopify content.
// ============================================================

export const SITE = {
  name: 'Édition',
  /** Rendered masthead: the "o" is the italic accent (ÉDITIoN). */
  wordmark: { head: 'ÉDITI', accent: 'o', tail: 'N' },
  tagline: 'Editorial Fashion House',
  description:
    'Édition — editorial fashion for women and men. Discover the SS26 collection, curated accessories, and a lookbook shaped by intention, not impulse.',
  /** Free-shipping threshold (store currency) — drives the cart progress bar. */
  freeShippingThreshold: 2000,
  email: 'hi@brandbes.com',
  copyright: '© 2026 Édition Editorial Fashion House. All rights reserved.',
  /** Shopify blog handle powering the Journal. */
  blogHandle: 'news',
} as const;

// ── Newsletter CTA (lives in the footer canvas) ─────────────
export const NEWSLETTER = {
  eyebrow: 'The Édition List',
  // `em` is rendered italic/accent inside the heading.
  heading: { lead: 'Dressed, before', em: 'everyone else.' },
  label: 'Get 10% off your first order',
  placeholder: 'Enter your email address',
  cta: 'Subscribe',
  note: 'Join 200,000+ subscribers. Unsubscribe anytime.',
} as const;

// ── Header: desktop mega-menu (left), simple links (right) ──
export interface MegaLink {
  label: string;
  href: string;
  isNew?: boolean;
}
export interface MegaMenu {
  title: string;
  columns: { heading: string; links: MegaLink[] }[];
  featured: { image: string; name: string; href: string };
}

export const MEGA_MENU: MegaMenu[] = [
  {
    title: 'Women',
    columns: [
      {
        heading: 'Shop',
        links: [
          { label: 'New Arrivals', href: '/collections/new-arrivals', isNew: true },
          { label: "Women's Fashion", href: '/collections/women-s-fashion' },
          { label: "Top Sale's", href: '/collections/top-sale-s' },
          { label: 'All Pieces', href: '/products' },
        ],
      },
      {
        heading: 'Discover',
        links: [
          { label: 'The Lookbook', href: '/#lookbook' },
          { label: 'The Journal', href: '/journal' },
          { label: 'Our Story', href: '/about' },
        ],
      },
    ],
    featured: {
      image:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop',
      name: "Women's Fashion",
      href: '/collections/women-s-fashion',
    },
  },
  {
    title: 'Men',
    columns: [
      {
        heading: 'Shop',
        links: [
          { label: 'New Arrivals', href: '/collections/new-arrivals', isNew: true },
          { label: "Men's Fashion", href: '/collections/mens-fashion' },
          { label: "Kid's Fashion", href: '/collections/kid-s-fashion' },
          { label: 'All Pieces', href: '/products' },
        ],
      },
      {
        heading: 'Discover',
        links: [
          { label: 'The Lookbook', href: '/#lookbook' },
          { label: 'The Journal', href: '/journal' },
          { label: 'Our Story', href: '/about' },
        ],
      },
    ],
    featured: {
      image:
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop',
      name: "Men's Fashion",
      href: '/collections/mens-fashion',
    },
  },
];

/** Plain links shown to the left (after the mega-menus) and right of the masthead. */
export const NAV_LEFT_LINKS = [{ title: 'Lookbook', href: '/#lookbook' }];
export const NAV_RIGHT_LINKS = [
  { title: 'New In', href: '/collections/new-arrivals' },
  { title: 'Journal', href: '/journal' },
  { title: 'Sale', href: '/collections/top-sale-s' },
];

/** Mobile off-canvas menu (flat list). */
export const MOBILE_NAV = [
  { title: 'Women', href: '/collections/women-s-fashion' },
  { title: 'Men', href: '/collections/mens-fashion' },
  { title: 'Lookbook', href: '/#lookbook' },
  { title: 'New In', href: '/collections/new-arrivals' },
  { title: 'Journal', href: '/journal' },
  { title: 'Account', href: '/account' },
  { title: "Sale", href: '/collections/top-sale-s', accent: true },
];

// ── Footer ──────────────────────────────────────────────────
export const FOOTER_BRAND_BLURB =
  'Editorial fashion for women and men — designed with intention, made to last beyond the season.';

export const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: "Women's Fashion", href: '/collections/women-s-fashion' },
      { label: "Men's Fashion", href: '/collections/mens-fashion' },
      { label: "Kid's Fashion", href: '/collections/kid-s-fashion' },
      { label: 'New Arrivals', href: '/collections/new-arrivals' },
      { label: "Top Sale's", href: '/collections/top-sale-s' },
      { label: 'All Pieces', href: '/products' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'My Account', href: '/account' },
      { label: 'Wishlist', href: '/wishlist' },
      { label: 'Search', href: '/search' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our Story', href: '/about' },
      { label: 'The Campaign', href: '/#campaign' },
      { label: 'The Journal', href: '/journal' },
      { label: 'Lookbook', href: '/#lookbook' },
    ],
  },
];

/** Social links — `icon` maps to an inline SVG in Footer.astro. */
export const SOCIAL = [
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' as const },
  { label: 'Pinterest', href: 'https://pinterest.com', icon: 'pinterest' as const },
  { label: 'TikTok', href: 'https://tiktok.com', icon: 'tiktok' as const },
];

export const PAYMENTS = ['VISA', 'MASTERCARD', 'AMEX', 'PAYPAL', 'APPLE PAY'];
