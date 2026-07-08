// ============================================================
//  Variant/option helpers shared by VariantSelector (PDP) and
//  QuickView (product card modal) so swatch colours and variant
//  matching stay identical between the two.
// ============================================================
import type { ProductOption, ProductVariant } from '~/lib/shopify/types';

export const isDefaultOnly = (options: ProductOption[]) =>
  options.length === 1 &&
  options[0].name === 'Title' &&
  options[0].optionValues.every((v) => v.name === 'Default Title');

export const isColorOption = (name: string) => /colou?r/i.test(name);

// Deterministic swatch fill (same result on server + client, so no
// hydration mismatch). Covers the common fashion + basic CSS colours;
// anything unknown falls back to a neutral chip.
const SWATCH_MAP: Record<string, string> = {
  black: '#101820',
  white: '#F6F6F4',
  blue: '#3EA3D4',
  red: '#C0392B',
  yellow: '#E9C46A',
  green: '#3F7D58',
  grey: '#9AA7AF',
  gray: '#9AA7AF',
  brown: '#7A5230',
  beige: '#E3D6C3',
  tan: '#C9B29B',
  pink: '#E8B7C4',
  purple: '#7A5C9E',
  orange: '#E08A3C',
  olive: '#6B6B3A',
  teal: '#2E8B8B',
  navy: '#1B2A4A',
  cream: '#F2ECE4',
  ivory: '#F4F1EA',
  sand: '#C9B29B',
  stone: '#B8AFA3',
  camel: '#C19A6B',
  mustard: '#C9A227',
  rust: '#A8431E',
  burgundy: '#6E1423',
  maroon: '#5E1A1A',
  silver: '#C8CCCE',
  gold: '#C8A951',
  charcoal: '#36454F',
  khaki: '#9A8B6A',
  onyx: '#101820',
  'bronze orange': '#C77B3A',
  'sky blue': '#3EA3D4',
  'soft peach': '#F4B79A',
};

export function swatchColor(name: string): string {
  const key = name.trim().toLowerCase();
  if (SWATCH_MAP[key]) return SWATCH_MAP[key];
  // Match the leading colour word for names like "Light Blue" / "Dark Green".
  for (const word of key.split(/[\s/-]+/)) {
    if (SWATCH_MAP[word]) return SWATCH_MAP[word];
  }
  return '#cbd5dc';
}

export function findVariant(variants: ProductVariant[], selected: Record<string, string>) {
  return variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value));
}
