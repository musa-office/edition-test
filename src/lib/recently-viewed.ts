// ============================================================
//  Recently viewed — a small localStorage list of products the
//  shopper has opened, most-recent first. Client-only.
// ============================================================
export interface RecentItem {
  handle: string;
  title: string;
  image: string;
  price: string;
  vendor?: string;
}

const KEY = 'ed_recently_viewed';
const MAX = 12;

export function readRecent(): RecentItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/** Record a product (deduped by handle, newest first, capped). */
export function pushRecent(item: RecentItem): RecentItem[] {
  if (!item?.handle) return readRecent();
  const list = readRecent().filter((i) => i.handle !== item.handle);
  list.unshift(item);
  const capped = list.slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(capped));
  } catch {
    /* storage disabled / full — non-fatal */
  }
  return capped;
}

export function clearRecent(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* no-op */
  }
}
