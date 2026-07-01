// ============================================================
//  WishlistGrid — renders the localStorage wishlist as editorial
//  product cards. Client-only (reads localStorage).
// ============================================================
import { useEffect, useState } from 'react';
import { readWishlist, removeWish, WISHLIST_EVENT, type WishItem } from '~/lib/wishlist';

export default function WishlistGrid() {
  const [items, setItems] = useState<WishItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readWishlist());
    sync();
    window.addEventListener(WISHLIST_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(WISHLIST_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="shop-empty">
        <p className="se-title">Your wishlist is empty</p>
        <p>Tap the heart on any piece to save it here for later.</p>
        <a className="btn-primary" href="/products">Browse the collection</a>
      </div>
    );
  }

  return (
    <div className="products">
      {items.map((it) => {
        const href = `/products/${it.handle}`;
        return (
          <div className="product" key={it.handle}>
            <div className="product-media">
              <button
                className="wish-btn active"
                type="button"
                onClick={() => removeWish(it.handle)}
                aria-label={`Remove ${it.title} from wishlist`}
              >
                <svg width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              {it.image ? <img src={it.image} alt={it.title} loading="lazy" /> : <div className="pdp-noimg">No image</div>}
              <a className="pm-link" href={href} aria-label={it.title} />
              <div className="product-actions">
                <a className="add-to-cart-button" href={href}>View Product</a>
              </div>
            </div>
            <a className="product-info" href={href}>
              <div>
                {it.vendor && <span className="product-cat">{it.vendor}</span>}
                <h3 className="product-title">{it.title}</h3>
              </div>
              <span className="price">{it.price}</span>
            </a>
          </div>
        );
      })}
    </div>
  );
}
