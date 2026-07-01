// ============================================================
//  CartPage — full-page cart view, sharing the nanostore with
//  the drawer + header badge.
// ============================================================
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import {
  $cart,
  $busyLines,
  $cartError,
  initCart,
  updateItem,
  removeItem,
  checkout,
} from '~/stores/cart';
import type { CartLine } from '~/lib/shopify/types';
import { formatMoney } from '~/lib/utils';
import { SITE } from '~/config/site';

export default function CartPage() {
  const cart = useStore($cart);
  const error = useStore($cartError);

  useEffect(() => {
    initCart();
  }, []);

  const lines = cart?.lines ?? [];
  const currency = cart?.cost?.subtotalAmount?.currencyCode ?? 'USD';
  const subtotal = Number(cart?.cost?.subtotalAmount?.amount ?? 0);
  const threshold = SITE.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);

  if (lines.length === 0) {
    return (
      <div className="shop-empty">
        <p className="se-title">Your bag is empty</p>
        <p>Discover the SS26 collection and add your favourites.</p>
        <a className="btn-primary" href="/products">Start shopping</a>
      </div>
    );
  }

  return (
    <div className="cartpage">
      <div>
        {lines.map((line) => (
          <CartRow key={line.id} line={line} currency={currency} />
        ))}
      </div>

      <aside className="cartpage-summary">
        <h2>Order Summary</h2>
        {error && <div className="cart-error" role="alert">{error}</div>}
        <div className="cartpage-row">
          <span>Subtotal</span>
          <span>{formatMoney(subtotal, currency)}</span>
        </div>
        <div className="cartpage-row">
          <span>Shipping</span>
          <span>{remaining > 0 ? 'Calculated at checkout' : 'Free'}</span>
        </div>
        {remaining > 0 && (
          <div className="cart-shipping-msg" style={{ marginTop: 12 }}>
            <span>You're {formatMoney(remaining, currency)} away from free shipping</span>
          </div>
        )}
        <div className="cartpage-row total">
          <span>Total</span>
          <span>{formatMoney(subtotal, currency)}</span>
        </div>
        <button type="button" className="cart-checkout-btn" style={{ marginTop: 18 }} onClick={checkout}>
          Checkout
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
        <a className="cart-continue-link" href="/products" style={{ display: 'block', marginTop: 12 }}>
          Continue Shopping
        </a>
      </aside>
    </div>
  );
}

function CartRow({ line, currency }: { line: CartLine; currency: string }) {
  const busyLines = useStore($busyLines);
  const busy = !!busyLines[line.id];
  const m = line.merchandise;
  const image = m.image ?? m.product?.featuredImage ?? null;
  const optionText = m.selectedOptions
    .filter((o) => o.value !== 'Default Title')
    .map((o) => o.value)
    .join(' · ');

  return (
    <div className="cart-item" data-id={line.id} style={{ paddingInline: 0 }}>
      <a className="cart-item-img" href={`/products/${m.product.handle}`}>
        {image && <img src={image.url} alt={image.altText ?? m.product.title} loading="lazy" />}
      </a>
      <div className="cart-item-body">
        <div>
          <span className="cart-item-cat">{m.product.title}</span>
          <a href={`/products/${m.product.handle}`} className="cart-item-name" style={{ display: 'block' }}>
            {m.title !== 'Default Title' ? m.title : m.product.title}
          </a>
          {optionText && <p className="cart-item-variant">{optionText}</p>}
        </div>
        <div className="cart-item-bottom">
          <div className="cart-qty">
            <button type="button" className="cart-qty-btn" onClick={() => updateItem(line.id, line.quantity - 1)} disabled={busy || line.quantity <= 1} aria-label="Decrease quantity">−</button>
            <span className="cart-qty-num">{line.quantity}</span>
            <button type="button" className="cart-qty-btn" onClick={() => updateItem(line.id, line.quantity + 1)} disabled={busy} aria-label="Increase quantity">+</button>
          </div>
          <div className="cart-item-price-row">
            <span className="cart-item-price">{formatMoney(line.cost.totalAmount.amount, currency)}</span>
            <button type="button" className="cart-remove-btn" onClick={() => removeItem(line.id)} disabled={busy}>Remove</button>
          </div>
        </div>
      </div>
    </div>
  );
}
