// Header cart trigger — editorial bag icon + live item-count badge.
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $cart, initCart, openCart } from '~/stores/cart';

export default function CartButton() {
  const cart = useStore($cart);

  // Hydrate the cart once when the first island mounts.
  useEffect(() => {
    initCart();
  }, []);

  const count = cart?.totalQuantity ?? 0;

  return (
    <button
      type="button"
      className="nav-icon"
      onClick={openCart}
      aria-label={count > 0 ? `Open cart, ${count} item${count === 1 ? '' : 's'}` : 'Open cart'}
    >
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {count > 0 && <span className="nav-badge">{count}</span>}
    </button>
  );
}
