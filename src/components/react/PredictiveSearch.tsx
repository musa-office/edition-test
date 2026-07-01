// ============================================================
//  PredictiveSearch — header search trigger + editorial sliding
//  panel with instant results (debounced /api/search). Enter
//  goes to the full /search page.
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { formatMoney } from '~/lib/utils';
import { useFocusTrap } from './useFocusTrap';

interface PProduct {
  id: string;
  title: string;
  handle: string;
  featuredImage?: { url: string; altText?: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
}
interface PCollection { id: string; title: string; handle: string }
interface Results { products: PProduct[]; collections: PCollection[] }
const EMPTY: Results = { products: [], collections: [] };

const TRENDING = ['Wool Coat', 'Silk Dress', 'Leather Tote', 'Cashmere', 'SS26 Edit', 'Tailoring'];

export default function PredictiveSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Results>(EMPTY);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useFocusTrap<HTMLDivElement>(open);

  // Debounced fetch.
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) { setResults(EMPTY); setLoading(false); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults({ products: data.products ?? [], collections: data.collections ?? [] });
      } catch {
        setResults(EMPTY);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [query, open]);

  // Scroll lock + Esc + autofocus on open.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
  };

  const hasResults = results.products.length > 0 || results.collections.length > 0;
  const showResults = query.trim().length >= 2;

  return (
    <>
      <button type="button" className="nav-icon" onClick={() => setOpen(true)} aria-label="Search">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
      </button>

      <div className={`search-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div ref={panelRef} className={`search-panel ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Search" aria-hidden={!open} inert={!open}>
        <div className="search-panel-inner">
          <form className="search-input-wrap" onSubmit={submit}>
            <span className="search-icon-wrap">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </span>
            <input
              ref={inputRef}
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search styles, fabrics, collections…"
              autoComplete="off"
              aria-label="Search"
            />
            <button type="button" className={`search-clear-btn ${query ? 'show' : ''}`} onClick={() => setQuery('')} aria-label="Clear search">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </form>

          <button className="search-close-btn" type="button" onClick={() => setOpen(false)} aria-label="Close search">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
            Close
          </button>

          <div className="search-bottom">
            <div>
              <span className="search-section-heading">Trending Now</span>
              <div className="search-tags">
                {TRENDING.map((t) => (
                  <button key={t} type="button" className="search-tag" onClick={() => setQuery(t)}>{t}</button>
                ))}
              </div>
            </div>

            <div>
              <span className="search-section-heading">{showResults ? 'Results' : 'Start typing'}</span>
              {!showResults ? (
                <p className="search-empty">Type at least two characters to search the collection.</p>
              ) : loading && !hasResults ? (
                <p className="search-loading">Searching…</p>
              ) : !hasResults ? (
                <p className="search-empty">No matches for “{query.trim()}”.</p>
              ) : (
                <div className="search-results">
                  {results.collections.map((c) => (
                    <a key={c.id} className="search-result" href={`/collections/${c.handle}`}>
                      <span className="search-result-name">{c.title}</span>
                      <span className="search-result-price">Collection</span>
                    </a>
                  ))}
                  {results.products.map((p) => (
                    <a key={p.id} className="search-result" href={`/products/${p.handle}`}>
                      <span className="search-result-img">
                        {p.featuredImage && <img src={p.featuredImage.url} alt={p.featuredImage.altText ?? p.title} loading="lazy" />}
                      </span>
                      <span className="search-result-name">{p.title}</span>
                      <span className="search-result-price">{formatMoney(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
