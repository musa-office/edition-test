// ============================================================
//  CartDrawer — editorial slide-over cart. Mounted once,
//  globally. Reads the shared nanostore so it stays in sync
//  with the header badge and every add-to-cart button.
// ============================================================
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { useFocusTrap } from './useFocusTrap';
import {
  $cart,
  $cartOpen,
  $cartBusy,
  $busyLines,
  $cartError,
  closeCart,
  updateItem,
  removeItem,
  checkout,
} from '~/stores/cart';
import type { CartLine } from '~/lib/shopify/types';
import { formatMoney } from '~/lib/utils';
import { SITE } from '~/config/site';

export default function CartDrawer() {
  const cart = useStore($cart);
  const open = useStore($cartOpen);
  const busy = useStore($cartBusy);
  const error = useStore($cartError);
  const panelRef = useFocusTrap<HTMLDivElement>(open);

  // Esc to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const lines = cart?.lines ?? [];
  const count = cart?.totalQuantity ?? 0;
  const currency = cart?.cost?.subtotalAmount?.currencyCode ?? 'USD';
  const subtotal = Number(cart?.cost?.subtotalAmount?.amount ?? 0);
  const threshold = SITE.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, threshold > 0 ? (subtotal / threshold) * 100 : 0);

  return (
    <>
      <div
        className={`cart-overlay ${open ? 'open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        className={`cart-drawer ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!open}
        inert={!open}
        tabIndex={-1}
      >
        <div className="cart-header">
          <div className="cart-header-left">
            <span className="cart-title">Your Bag</span>
            <span className="cart-count-lbl">{count === 1 ? '1 item' : `${count} items`}</span>
          </div>
          <button type="button" className="cart-close-btn" onClick={closeCart} aria-label="Close cart">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <p className="cart-empty-title">Your bag is empty</p>
            <p className="cart-empty-text">Discover the SS26 collection and add your favourites.</p>
            <button type="button" className="btn-primary" onClick={closeCart}>Start Shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-body">
              {lines.map((line) => (
                <CartLineRow key={line.id} line={line} currency={currency} />
              ))}
            </div>

            <div className="cart-footer">
              {error && <div className="cart-error" role="alert">{error}</div>}

              <div className="cart-shipping-msg">
                {remaining > 0 ? (
                  <span>You're {formatMoney(remaining, currency)} away from free shipping</span>
                ) : (
                  <span>✓ You've unlocked free shipping</span>
                )}
              </div>
              <div className="cart-progress">
                <div className="cart-progress-bar" style={{ width: `${progress}%` }} />
              </div>

              <div className="cart-subtotal-row">
                <span className="cart-subtotal-label">Subtotal</span>
                <span className="cart-subtotal-val">{formatMoney(subtotal, currency)}</span>
              </div>

              <button
                type="button"
                className="cart-checkout-btn"
                onClick={checkout}
                disabled={busy}
              >
                {busy ? 'Working…' : 'Checkout'}
                {!busy && (
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
              <a href="/cart" className="cart-view-btn" onClick={closeCart}>
                View Cart
              </a>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function CartLineRow({ line, currency }: { line: CartLine; currency: string }) {
  const busyLines = useStore($busyLines);
  const busy = !!busyLines[line.id];
  const m = line.merchandise;
  const image = m.image ?? m.product?.featuredImage ?? null;
  const optionText = m.selectedOptions
    .filter((o) => o.value !== 'Default Title')
    .map((o) => o.value)
    .join(' · ');

  return (
    <div className="cart-item" data-id={line.id}>
      <a className="cart-item-img" href={`/products/${m.product.handle}`} onClick={closeCart}>
        {image && <img src={image.url} alt={image.altText ?? m.product.title} loading="lazy" />}
      </a>
      <div className="cart-item-body">
        <div>
          {m.product.title && <span className="cart-item-cat">{m.product.title}</span>}
          <a
            href={`/products/${m.product.handle}`}
            onClick={closeCart}
            className="cart-item-name"
            style={{ display: 'block' }}
          >
            {m.title !== 'Default Title' ? m.title : m.product.title}
          </a>
          {optionText && <p className="cart-item-variant">{optionText}</p>}
        </div>
        <div className="cart-item-bottom">
          <div className="cart-qty">
            <button
              type="button"
              className="cart-qty-btn"
              onClick={() => updateItem(line.id, line.quantity - 1)}
              disabled={busy || line.quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="cart-qty-num">{line.quantity}</span>
            <button
              type="button"
              className="cart-qty-btn"
              onClick={() => updateItem(line.id, line.quantity + 1)}
              disabled={busy}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <div className="cart-item-price-row">
            <span className="cart-item-price">
              {formatMoney(line.cost.totalAmount.amount, currency)}
            </span>
            <button
              type="button"
              className="cart-remove-btn"
              onClick={() => removeItem(line.id)}
              disabled={busy}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
