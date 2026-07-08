// ============================================================
//  Cart line HTML — shared by the drawer (CartDrawer.astro) and
//  the full-page cart (cart.astro). Both read the same nanostore
//  and render identical line rows. Framework-free.
// ============================================================
import type { CartLine } from '~/lib/shopify/types';
import { formatMoney } from '~/lib/utils';
import { escapeHtml } from '~/lib/dom';

/** One cart line row. `busy` disables the controls; `flush` drops side padding (page view). */
export function cartLineHtml(
  line: CartLine,
  currency: string,
  opts: { busy?: boolean; flush?: boolean } = {},
): string {
  const { busy = false, flush = false } = opts;
  const m = line.merchandise;
  const image = m.image ?? m.product?.featuredImage ?? null;
  const href = `/products/${encodeURIComponent(m.product.handle)}`;
  const optionText = m.selectedOptions
    .filter((o) => o.value !== 'Default Title')
    .map((o) => o.value)
    .join(' · ');
  const name = m.title !== 'Default Title' ? m.title : m.product.title;
  const dis = busy ? 'disabled' : '';

  return `
    <div class="cart-item" data-id="${escapeHtml(line.id)}"${flush ? ' style="padding-inline:0"' : ''}>
      <a class="cart-item-img" href="${href}" data-cart-link>
        ${image ? `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.altText ?? m.product.title)}" loading="lazy" />` : ''}
      </a>
      <div class="cart-item-body">
        <div>
          ${m.product.title ? `<span class="cart-item-cat">${escapeHtml(m.product.title)}</span>` : ''}
          <a href="${href}" class="cart-item-name" style="display:block" data-cart-link>${escapeHtml(name)}</a>
          ${optionText ? `<p class="cart-item-variant">${escapeHtml(optionText)}</p>` : ''}
        </div>
        <div class="cart-item-bottom">
          <div class="cart-qty">
            <button type="button" class="cart-qty-btn" data-line-dec ${busy || line.quantity <= 1 ? 'disabled' : ''} aria-label="Decrease quantity">−</button>
            <span class="cart-qty-num">${line.quantity}</span>
            <button type="button" class="cart-qty-btn" data-line-inc ${dis} aria-label="Increase quantity">+</button>
          </div>
          <div class="cart-item-price-row">
            <span class="cart-item-price">${escapeHtml(formatMoney(line.cost.totalAmount.amount, currency))}</span>
            <button type="button" class="cart-remove-btn" data-line-remove ${dis}>Remove</button>
          </div>
        </div>
      </div>
    </div>`;
}
