// ============================================================
//  QuickView — editorial "peek" modal opened from a product card's
//  eye button. Mounted once, globally (like CartDrawer). Fetches
//  the full product on demand from /api/products/:handle so the
//  card grids can keep shipping the lightweight ProductCard shape.
//  Markup/classes (.qv-*) match the Quick View modal already
//  designed in Shop.html / home.css — this wires it to real data.
// ============================================================
import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { useFocusTrap } from './useFocusTrap';
import { $quickviewHandle, closeQuickview } from '~/stores/quickview';
import { addItem } from '~/stores/cart';
import type { Product } from '~/lib/shopify/types';
import { formatMoney, isOnSale, discountPercent } from '~/lib/utils';
import { isDefaultOnly, isColorOption, swatchColor, findVariant } from '~/lib/variant-options';

export default function QuickView() {
  const handle = useStore($quickviewHandle);
  const open = handle !== null;
  const panelRef = useFocusTrap<HTMLDivElement>(open);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [adding, setAdding] = useState(false);

  // Fetch the full product whenever a new handle is opened.
  useEffect(() => {
    if (!handle) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setProduct(null);
    setSelected({});

    fetch(`/api/products/${handle}`, { headers: { accept: 'application/json' } })
      .then((res) => res.json())
      .then((data: { product: Product | null }) => {
        if (cancelled) return;
        if (!data.product) {
          setError('This product could not be loaded.');
          return;
        }
        setProduct(data.product);
        const base = data.product.variants.find((v) => v.availableForSale) ?? data.product.variants[0];
        const map: Record<string, string> = {};
        base?.selectedOptions.forEach((o) => (map[o.name] = o.value));
        setSelected(map);
      })
      .catch(() => {
        if (!cancelled) setError('This product could not be loaded.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [handle]);

  // Esc to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeQuickview();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const options = product?.options ?? [];
  const variants = product?.variants ?? [];
  const singleVariant = !product || isDefaultOnly(options) || options.length === 0;
  const variant = findVariant(variants, selected);
  const available = variant?.availableForSale ?? false;
  const onSale = isOnSale(variant?.price, variant?.compareAtPrice);
  const off = discountPercent(variant?.price, variant?.compareAtPrice);
  const currency = variant?.price.currencyCode ?? product?.priceRange.minVariantPrice.currencyCode ?? 'USD';
  const priceLabel = variant
    ? formatMoney(variant.price.amount, currency)
    : product
      ? formatMoney(product.priceRange.minVariantPrice.amount, currency)
      : '';

  const valueAvailable = (optionName: string, value: string) =>
    variants.some(
      (v) =>
        v.availableForSale &&
        v.selectedOptions.some((o) => o.name === optionName && o.value === value) &&
        v.selectedOptions.every((o) => o.name === optionName || selected[o.name] === o.value),
    );

  const pick = (name: string, value: string) => setSelected((prev) => ({ ...prev, [name]: value }));

  const handleAdd = async () => {
    if (!variant || !available) return;
    setAdding(true);
    await addItem(variant.id, 1);
    setAdding(false);
    closeQuickview();
  };

  return (
    <>
      <div className={`qv-overlay ${open ? 'open' : ''}`} onClick={closeQuickview} aria-hidden="true" />
      <div
        ref={panelRef}
        className={`qv-modal ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={product ? `Quick view — ${product.title}` : 'Quick view'}
        aria-hidden={!open}
        inert={!open}
        tabIndex={-1}
      >
        <div className="qv-media">
          {product?.featuredImage && (
            <img src={product.featuredImage.url} alt={product.featuredImage.altText ?? product.title} />
          )}
        </div>

        <div className="qv-body">
          <button type="button" className="qv-close" onClick={closeQuickview} aria-label="Close quick view">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {loading && <p className="qv-desc">Loading…</p>}
          {!loading && error && <p className="qv-desc">{error}</p>}

          {!loading && !error && product && (
            <>
              {product.vendor && <span className="qv-cat">{product.vendor}</span>}
              <h3 className="qv-name">{product.title}</h3>
              <p className="qv-price">
                {priceLabel}
                {onSale && variant?.compareAtPrice && (
                  <>
                    <del>{formatMoney(variant.compareAtPrice.amount, currency)}</del>
                    {off != null && <span className="pdp-off">−{off}%</span>}
                  </>
                )}
              </p>
              {product.description && <p className="qv-desc clamp">{product.description}</p>}

              {!singleVariant &&
                options.map((option) => {
                  const colour = isColorOption(option.name);
                  return (
                    <div key={option.id}>
                      <span className="qv-label">{option.name}</span>
                      {colour ? (
                        <div className="qv-swatches">
                          {option.optionValues.map((ov) => {
                            const active = selected[option.name] === ov.name;
                            const possible = valueAvailable(option.name, ov.name);
                            return (
                              <button
                                key={ov.id}
                                type="button"
                                className={`swatch ${active ? 'active' : ''} ${!possible && !active ? 'unavailable' : ''}`}
                                style={{ background: swatchColor(ov.name) }}
                                aria-pressed={active}
                                aria-label={ov.name}
                                title={ov.name}
                                onClick={() => pick(option.name, ov.name)}
                              />
                            );
                          })}
                        </div>
                      ) : (
                        <div className="qv-sizes">
                          {option.optionValues.map((ov) => {
                            const active = selected[option.name] === ov.name;
                            const possible = valueAvailable(option.name, ov.name);
                            return (
                              <button
                                key={ov.id}
                                type="button"
                                className={`qv-size ${active ? 'active' : ''} ${!possible && !active ? 'unavailable' : ''}`}
                                aria-pressed={active}
                                aria-label={!possible && !active ? `${ov.name} (unavailable)` : ov.name}
                                onClick={() => pick(option.name, ov.name)}
                              >
                                {ov.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

              <button type="button" className="qv-add" onClick={handleAdd} disabled={!available || adding}>
                {adding ? 'Adding…' : available ? 'Add to Bag' : 'Sold Out'}
              </button>

              <a href={`/products/${product.handle}`} className="qv-fulllink" onClick={closeQuickview}>
                View full details
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
}
