// ============================================================
//  VariantSelector — editorial PDP buy box (mirrors Product.html).
//  Price → description → colour swatches + size pills → stock →
//  qty + "Add to Bag — $price" + wishlist heart. One island so
//  option + qty + variant state stay consistent.
// ============================================================
import { useEffect, useMemo, useState } from 'react';
import type { ProductOption, ProductVariant } from '~/lib/shopify/types';
import { formatMoney, isOnSale, discountPercent } from '~/lib/utils';
import { addItem } from '~/stores/cart';
import { hasWish, toggleWish, WISHLIST_EVENT } from '~/lib/wishlist';
import { isDefaultOnly, isColorOption, swatchColor, findVariant } from '~/lib/variant-options';

interface Props {
  options: ProductOption[];
  variants: ProductVariant[];
  currencyCode: string;
  /** Wishlist payload (matches the global localStorage wishlist). */
  handle: string;
  title: string;
  image?: string;
  vendor?: string;
}

export default function VariantSelector({
  options,
  variants,
  currencyCode,
  handle,
  title,
  image,
  vendor,
}: Props) {
  const singleVariant = isDefaultOnly(options) || options.length === 0;

  const initial = useMemo(() => {
    const base = variants.find((v) => v.availableForSale) ?? variants[0];
    const map: Record<string, string> = {};
    base?.selectedOptions.forEach((o) => (map[o.name] = o.value));
    return map;
  }, [variants]);

  const [selected, setSelected] = useState<Record<string, string>>(initial);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [wished, setWished] = useState(false);

  const variant = findVariant(variants, selected);
  const available = variant?.availableForSale ?? false;
  const onSale = isOnSale(variant?.price, variant?.compareAtPrice);
  const off = discountPercent(variant?.price, variant?.compareAtPrice);
  const priceLabel = variant ? formatMoney(variant.price.amount, currencyCode) : '—';

  // Keep the heart in sync with the shared wishlist store.
  useEffect(() => {
    const sync = () => setWished(hasWish(handle));
    sync();
    window.addEventListener(WISHLIST_EVENT, sync);
    return () => window.removeEventListener(WISHLIST_EVENT, sync);
  }, [handle]);

  const valueAvailable = (optionName: string, value: string) =>
    variants.some(
      (v) =>
        v.availableForSale &&
        v.selectedOptions.some((o) => o.name === optionName && o.value === value) &&
        v.selectedOptions.every(
          (o) => o.name === optionName || selected[o.name] === o.value,
        ),
    );

  const pick = (name: string, value: string) =>
    setSelected((prev) => ({ ...prev, [name]: value }));

  const handleAdd = async () => {
    if (!variant || !available) return;
    setAdding(true);
    await addItem(variant.id, quantity);
    setAdding(false);
  };

  const toggleWishlist = () =>
    setWished(
      toggleWish({
        handle,
        title,
        image: image ?? '',
        price: priceLabel,
        vendor: vendor ?? '',
      }),
    );

  return (
    <div>
      {/* Price */}
      <div className="pdp-price">
        <span>{priceLabel}</span>
        {onSale && variant?.compareAtPrice && (
          <>
            <del>{formatMoney(variant.compareAtPrice.amount, currencyCode)}</del>
            {off != null && <span className="pdp-off">−{off}%</span>}
          </>
        )}
      </div>

      {/* Stock */}
      <p className={`stock-note ${available ? 'in' : 'out'}`}>
        <span className="dot" />
        {available ? 'In stock — ships within 48 hours' : 'Currently out of stock'}
      </p>

      {/* Options — colour as swatches, everything else as pills */}
      {!singleVariant &&
        options.map((option) => {
          const colour = isColorOption(option.name);
          return (
            <div className="pdp-opt" key={option.id}>
              <div className="opt-label">
                <span style={{ color: 'var(--ink)', fontWeight: 700, letterSpacing: '1.2px' }}>
                  {option.name}
                </span>
                <span>{selected[option.name]}</span>
              </div>

              {colour ? (
                <div className="pdp-sw">
                  {option.optionValues.map((ov) => {
                    const active = selected[option.name] === ov.name;
                    const possible = valueAvailable(option.name, ov.name);
                    return (
                      <button
                        key={ov.id}
                        type="button"
                        className={`psw ${active ? 'active' : ''} ${!possible && !active ? 'unavailable' : ''}`}
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
                <div className="pdp-sizes">
                  {option.optionValues.map((ov) => {
                    const active = selected[option.name] === ov.name;
                    const possible = valueAvailable(option.name, ov.name);
                    return (
                      <button
                        key={ov.id}
                        type="button"
                        className={`psize ${active ? 'active' : ''} ${!possible && !active ? 'unavailable' : ''}`}
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

      {/* Buy row: qty + add (with live price) + wishlist heart */}
      <div className="pdp-buy">
        <div className="pdp-qty">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            disabled={quantity >= 20}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button type="button" className="pdp-add" onClick={handleAdd} disabled={!available || adding}>
          {adding
            ? 'Adding…'
            : available
              ? `Add to Bag — ${priceLabel}`
              : 'Sold Out'}
        </button>
        <button
          type="button"
          className={`pdp-wish ${wished ? 'active' : ''}`}
          onClick={toggleWishlist}
          aria-pressed={wished}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="18" height="18" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
