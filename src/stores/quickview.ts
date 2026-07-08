// ============================================================
//  Quickview store (nanostores) — holds the handle of the product
//  currently shown in the quick-view modal. Product cards across
//  every grid (shop, home, search, wishlist, recently viewed) open
//  the same global <QuickView /> island by setting this handle.
// ============================================================
import { atom } from 'nanostores';

export const $quickviewHandle = atom<string | null>(null);

export function openQuickview(handle: string): void {
  $quickviewHandle.set(handle);
}

export function closeQuickview(): void {
  $quickviewHandle.set(null);
}
