// ============================================================
//  Buy-box HTML builder — shared by VariantSelector.astro (server
//  first paint) and its client script (re-render on interaction),
//  so both produce byte-identical markup (no hydration mismatch).
// ============================================================
import type { ProductOption, ProductVariant } from '~/lib/shopify/types';
import { formatMoney, isOnSale, discountPercent } from '~/lib/utils';
import { isDefaultOnly, isColorOption, swatchColor, findVariant } from '~/lib/variant-options';
import { escapeHtml } from '~/lib/dom';

export interface BuyBoxData {
  options: ProductOption[];
  variants: ProductVariant[];
  currencyCode: string;
}

export interface BuyBoxState {
  selected: Record<string, string>;
  quantity: number;
  adding: boolean;
  wished: boolean;
}

/** First available (or first) variant's option map — the default selection. */
export function initialSelection(variants: ProductVariant[]): Record<string, string> {
  const base = variants.find((v) => v.availableForSale) ?? variants[0];
  const map: Record<string, string> = {};
  base?.selectedOptions.forEach((o) => (map[o.name] = o.value));
  return map;
}

function valueAvailable(
  data: BuyBoxData,
  selected: Record<string, string>,
  optionName: string,
  value: string,
): boolean {
  return data.variants.some(
    (v) =>
      v.availableForSale &&
      v.selectedOptions.some((o) => o.name === optionName && o.value === value) &&
      v.selectedOptions.every((o) => o.name === optionName || selected[o.name] === o.value),
  );
}

function optionHtml(data: BuyBoxData, selected: Record<string, string>, option: ProductOption): string {
  const colour = isColorOption(option.name);
  const rows = option.optionValues
    .map((ov) => {
      const active = selected[option.name] === ov.name;
      const possible = valueAvailable(data, selected, option.name, ov.name);
      const cls = `${active ? 'active' : ''} ${!possible && !active ? 'unavailable' : ''}`.trim();
      if (colour) {
        return `<button type="button" class="psw ${cls}" style="background:${swatchColor(ov.name)}" aria-pressed="${active}" aria-label="${escapeHtml(ov.name)}" title="${escapeHtml(ov.name)}" data-opt="${escapeHtml(option.name)}" data-val="${escapeHtml(ov.name)}"></button>`;
      }
      const label = !possible && !active ? `${ov.name} (unavailable)` : ov.name;
      return `<button type="button" class="psize ${cls}" aria-pressed="${active}" aria-label="${escapeHtml(label)}" data-opt="${escapeHtml(option.name)}" data-val="${escapeHtml(ov.name)}">${escapeHtml(ov.name)}</button>`;
    })
    .join('');

  return `
    <div class="pdp-opt">
      <div class="opt-label">
        <span style="color:var(--ink);font-weight:700;letter-spacing:1.2px">${escapeHtml(option.name)}</span>
        <span>${escapeHtml(selected[option.name] ?? '')}</span>
      </div>
      <div class="${colour ? 'pdp-sw' : 'pdp-sizes'}">${rows}</div>
    </div>`;
}

const HEART = (filled: boolean) =>
  `<svg width="18" height="18" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

/** Full inner HTML of the buy box for the given data + state. */
export function buyBoxInnerHtml(data: BuyBoxData, state: BuyBoxState): string {
  const { selected, quantity, adding, wished } = state;
  const currency = data.currencyCode;
  const variant = findVariant(data.variants, selected);
  const available = variant?.availableForSale ?? false;
  const onSale = isOnSale(variant?.price, variant?.compareAtPrice);
  const off = discountPercent(variant?.price, variant?.compareAtPrice);
  const priceLabel = variant ? formatMoney(variant.price.amount, currency) : '—';
  const singleVariant = isDefaultOnly(data.options) || data.options.length === 0;

  const saleHtml =
    onSale && variant?.compareAtPrice
      ? `<del>${escapeHtml(formatMoney(variant.compareAtPrice.amount, currency))}</del>${off != null ? `<span class="pdp-off">−${off}%</span>` : ''}`
      : '';

  const optionsHtml = singleVariant ? '' : data.options.map((o) => optionHtml(data, selected, o)).join('');

  const addLabel = adding ? 'Adding…' : available ? `Add to Bag — ${escapeHtml(priceLabel)}` : 'Sold Out';

  return `
    <div class="pdp-price">
      <span>${escapeHtml(priceLabel)}</span>
      ${saleHtml}
    </div>

    <p class="stock-note ${available ? 'in' : 'out'}">
      <span class="dot"></span>
      ${available ? 'In stock — ships within 48 hours' : 'Currently out of stock'}
    </p>

    ${optionsHtml}

    <div class="pdp-buy">
      <div class="pdp-qty">
        <button type="button" data-qty-dec ${quantity <= 1 ? 'disabled' : ''} aria-label="Decrease quantity">−</button>
        <span>${quantity}</span>
        <button type="button" data-qty-inc ${quantity >= 20 ? 'disabled' : ''} aria-label="Increase quantity">+</button>
      </div>
      <button type="button" class="pdp-add" data-add ${!available || adding ? 'disabled' : ''}>${addLabel}</button>
      <button type="button" class="pdp-wish ${wished ? 'active' : ''}" data-wish aria-pressed="${wished}" aria-label="${wished ? 'Remove from wishlist' : 'Add to wishlist'}">
        ${HEART(wished)}
      </button>
    </div>`;
}
