// ============================================================
//  Home section content — single source of truth (DRY).
//  Every home section's copy + imagery lives here, NOT baked
//  into the .astro component. Sections read these as prop
//  defaults, so lifting a section into another project means
//  "pass new data", not "edit the component".
//
//  Images/videos are imported as modules so the bundler
//  validates + fingerprints them at build time and carries
//  them along with this config — no hand-copying files into
//  /public under an exact name. A missing/renamed asset fails
//  the BUILD, not silently at runtime.
// ============================================================
import type { ImageMetadata } from 'astro';

// ── image assets ────────────────────────────────────────────
import category01 from '~/assets/home/category-01.png';
import category02 from '~/assets/home/category-02.png';
import category03 from '~/assets/home/category-03.png';
import category04 from '~/assets/home/category-04.png';
import hero01 from '~/assets/home/hero-01.png';
import hero02 from '~/assets/home/hero-02.png';
import hero03 from '~/assets/home/hero-03.png';
import look01 from '~/assets/home/look-01.png';
import look02 from '~/assets/home/look-02.png';
import look03 from '~/assets/home/look-03.png';
import saleImage from '~/assets/home/sale.png';
import blog01 from '~/assets/home/blog-01.png';
import blog02 from '~/assets/home/blog-02.png';
import blog03 from '~/assets/home/blog-03.png';
import blog04 from '~/assets/home/blog-04.png';

// ── video assets (Vite returns a fingerprinted URL string) ──
import heroVideo01 from '~/assets/videos/hero-01.mp4';
import heroVideo02 from '~/assets/videos/hero-02.mp4';
import heroVideo03 from '~/assets/videos/hero-03.mp4';
import campaignVideo from '~/assets/videos/campaign.mp4';

// ── FeaturedShowcase ("Explore the Edit") ───────────────────
export interface FeaturePanel {
  /** Collection PLP the card links to (remap to your real Shopify handle). */
  href: string;
  img: ImageMetadata;
  /** Small over-title, e.g. "Collection 01". */
  cat: string;
  title: string;
  desc: string;
}

export interface FeaturedShowcaseContent {
  eyebrow: string;
  /** Heading split so the accent word can render inside <em>. */
  heading: { lead: string; em: string };
  panels: FeaturePanel[];
}

export const FEATURED_SHOWCASE: FeaturedShowcaseContent = {
  eyebrow: 'Shop by Category',
  heading: { lead: 'Explore the ', em: 'Edit' },
  panels: [
    { href: '/collections/women-s-fashion', img: category01, cat: 'Collection 01', title: 'Quiet Elegance', desc: 'Fluid tailoring and soft structure — womenswear made to move with you.' },
    { href: '/collections/mens-fashion', img: category02, cat: 'Collection 02', title: 'Modern Tailoring', desc: 'Considered menswear with a relaxed, editorial ease and lasting craft.' },
    { href: '/collections/kid-s-fashion', img: category03, cat: 'Collection 03', title: 'The Little Edit', desc: 'Soft, durable and playful — kidswear made for movement and mess.' },
    { href: '/collections/top-sale-s', img: category04, cat: 'Collection 04', title: 'Final Reductions', desc: 'Editorial pieces at their best price — the season, marked down.' },
  ],
};

// ── Hero (dual-media auto-slider) ───────────────────────────
export interface HeroSlide {
  /** Fingerprinted video URL. */
  video: string;
  image: ImageMetadata;
  eyebrow: string;
  /** May contain inline <em>/<br> — rendered via set:html. */
  title: string;
  /** Media order: video first vs. image first. */
  videoFirst: boolean;
}

export const HERO_SLIDES: HeroSlide[] = [
  { video: heroVideo01, image: hero01, eyebrow: 'SS26 Collection', title: 'Fluid tailoring made to<em> move with you.</em>', videoFirst: true },
  { video: heroVideo02, image: hero02, eyebrow: 'The Movement Edit', title: 'Editorial pieces, dressed<br>with <em>quiet intention.</em>', videoFirst: false },
  { video: heroVideo03, image: hero03, eyebrow: 'New Season SS26', title: 'Fashion that moves the<br><em>way you do.</em>', videoFirst: true },
];

// ── Lookbook ("Shop the Look") ──────────────────────────────
export interface LookMeta {
  tag: string;
  kicker: string;
  title: string;
  desc: string;
  image: ImageMetadata;
  /** Hotspot positions as [x%, y%]. */
  spots: [number, number][];
}

export const LOOKBOOK_META: LookMeta[] = [
  { tag: 'SS26 · Look 01', kicker: 'Look 01 — The Edit', title: 'The Movement Edit', desc: 'Three pieces styled as one story — fluid layers built to move from studio to street. Tap a marker to shop the piece.', image: look01, spots: [[34, 30], [57, 53], [46, 80]] },
  { tag: 'SS26 · Look 02', kicker: 'Look 02 — Off Duty', title: 'Soft Structure', desc: 'Relaxed tailoring and easy knitwear — the considered weekend uniform, finished with one quiet statement.', image: look02, spots: [[40, 28], [30, 60], [62, 70]] },
  { tag: 'SS26 · Look 03', kicker: 'Look 03 — After Hours', title: 'Quiet Evening', desc: 'Evening dressing without the noise — clean lines, a fluid drape, and a palette that lets the cut speak.', image: look03, spots: [[50, 32], [40, 66], [61, 56]] },
];

// ── Campaign (cinematic video + marquee) ────────────────────
export interface CampaignContent {
  video: string;
  eyebrow: string;
  kicker: string;
  /** Contains inline <br>/<em> — rendered via set:html. */
  headingHtml: string;
  /** Contains inline <b> — rendered via set:html. */
  subHtml: string;
  code: string;
  ctaLabel: string;
  ctaHref: string;
  ctaNote: string;
  marquee: string[];
}

export const CAMPAIGN: CampaignContent = {
  video: campaignVideo,
  eyebrow: 'SS26 Campaign',
  kicker: 'Mid-Season Sale · Ends Sunday',
  headingHtml: 'Up to<br><em>50%</em> Off',
  subHtml: 'The <b>SS26 collection</b>, reduced for a limited time — shot on location across Lisbon.',
  code: 'SS26',
  ctaLabel: 'Shop the Sale',
  ctaHref: '/products?sort=newest',
  ctaNote: 'Free shipping over $250',
  marquee: ['The Movement Issue', 'SS / 2026', 'Shot in Lisbon', 'In Full Motion', 'Editorial N°08', 'Shop the Campaign'],
};

// ── MidSeasonSale (promo banner + product rail) ─────────────
export interface MidSeasonSaleContent {
  eyebrow: string;
  /** Contains inline <em> — rendered via set:html. */
  titleHtml: string;
  flag: string;
  image: ImageMetadata;
  panelHeading: string;
}

export const MID_SEASON_SALE: MidSeasonSaleContent = {
  eyebrow: 'Mid-Season Sale',
  titleHtml: 'Up to <em>50%</em> Off',
  flag: 'SS26 · Final Reductions',
  image: saleImage,
  panelHeading: 'Complete the Edit',
};

// ── Testimonials (press strip + review cards) ───────────────
export interface Review {
  date: string;
  text: string;
  product: string;
  initials: string;
  /** CSS colour token/value for the avatar chip. */
  avatar: string;
  name: string;
  loc: string;
}

export const PRESS: string[] = ['VOGUE', 'ELLE', "HARPER'S BAZAAR", 'WWD', 'BUSINESS OF FASHION'];

export const REVIEWS: Review[] = [
  { date: 'March 2026', text: 'The cashmere sweater is unlike anything I’ve owned. It drapes perfectly and feels luxurious without being fussy — I’ve worn it almost every day since.', product: 'Cashmere Blend Sweater — Ivory', initials: 'AR', avatar: 'var(--editorial-dark)', name: 'Amélie Rousseau', loc: 'Paris, France' },
  { date: 'February 2026', text: 'The structured tote is hands-down the best investment I’ve made. Beautifully constructed, incredibly functional, and it gets better with every use.', product: 'The Édition Structured Tote — Onyx', initials: 'SW', avatar: 'var(--primary)', name: 'Serena Whitfield', loc: 'London, UK' },
  { date: 'January 2026', text: 'I ordered the wool coat hesitantly — I was wrong to hesitate. The fit, the weight, the warmth. It’s the coat I’ll wear for the next twenty years.', product: 'Fluid Wool Coat — Sky Blue', initials: 'ML', avatar: 'var(--editorial-secondary-hover)', name: 'Marcus Lindgren', loc: 'Stockholm, Sweden' },
  { date: 'April 2026', text: 'Édition’s satin dress is everything I wanted — elegant, versatile, and impossibly smooth. I’ve dressed it up and down and it always looks exactly right.', product: 'Satin Slip Dress — Soft Peach', initials: 'NK', avatar: 'var(--editorial-primary-hover)', name: 'Noa Kim', loc: 'Seoul, South Korea' },
];

// ── Journal (live articles + static fallback) ───────────────
export interface JournalEntry {
  href: string;
  img: ImageMetadata;
  cat: string;
  date: string;
  title: string;
  excerpt: string;
}

/** Cycled as image fallback when a live article has no image. */
export const JOURNAL_FALLBACK_IMAGES: ImageMetadata[] = [blog01, blog02, blog03, blog04];

/** Shown verbatim when there are no live Shopify blog articles. */
export const JOURNAL_FALLBACK: JournalEntry[] = [
  { href: '/journal', img: blog01, cat: 'Style Notes', date: 'May 2, 2026', title: 'The Quiet Power of Dressing in Neutrals', excerpt: 'When the colour palette retreats, the construction speaks — a guide to building a wardrobe that outlasts every trend cycle.' },
  { href: '/journal', img: blog02, cat: 'Wardrobe Tips', date: 'April 18, 2026', title: "How to Build a Capsule Wardrobe You'll Love for Years", excerpt: "The capsule wardrobe isn't about owning less — it's about owning better." },
  { href: '/journal', img: blog03, cat: 'Trend Edit', date: 'March 22, 2026', title: 'Spring Trend Edit: The Shapes That Will Define Your Season', excerpt: 'From fluid silhouettes to structured tailoring — the shapes setting the tone for the season.' },
  { href: '/journal', img: blog04, cat: 'Care Guide', date: 'February 10, 2026', title: 'The Art of Caring for Fine Fabrics at Home', excerpt: 'Cashmere, silk, wool — the pieces worth keeping deserve to be kept properly.' },
];
