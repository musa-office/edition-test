// ============================================================
//  Small client-side DOM helpers shared by the vanilla islands
//  (cart drawer, quick-view, predictive search). Framework-free.
// ============================================================

/** Escape a string for safe interpolation into innerHTML. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Trap Tab focus inside `node` and restore focus to the trigger on
 * release. Returns a disposer. Mirrors the old useFocusTrap island.
 */
export function trapFocus(node: HTMLElement): () => void {
  const previouslyFocused = document.activeElement as HTMLElement | null;
  const visible = () =>
    Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    );

  (visible()[0] ?? node).focus();

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const els = visible();
    if (!els.length) return;
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  node.addEventListener('keydown', onKeyDown);
  return () => {
    node.removeEventListener('keydown', onKeyDown);
    previouslyFocused?.focus?.();
  };
}
