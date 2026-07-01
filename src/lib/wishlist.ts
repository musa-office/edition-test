// ============================================================
//  Wishlist — client-only, persisted in localStorage. Shared by
//  the global delegated script (ProductCard hearts) and the
//  /wishlist page island. Emits a `wishlist:change` event so all
//  listeners stay in sync.
// ============================================================
export interface WishItem {
  handle: string;
  title: string;
  image: string;
  price: string;
  vendor: string;
}

const KEY = 'ed_wishlist';
export const WISHLIST_EVENT = 'wishlist:change';

export function readWishlist(): WishItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: WishItem[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(WISHLIST_EVENT));
}

export function hasWish(handle: string): boolean {
  return readWishlist().some((i) => i.handle === handle);
}

/** Toggle an item; returns true if it's now saved, false if removed. */
export function toggleWish(item: WishItem): boolean {
  const items = readWishlist();
  const idx = items.findIndex((i) => i.handle === item.handle);
  if (idx >= 0) {
    items.splice(idx, 1);
    write(items);
    return false;
  }
  items.push(item);
  write(items);
  return true;
}

export function removeWish(handle: string): void {
  write(readWishlist().filter((i) => i.handle !== handle));
}
