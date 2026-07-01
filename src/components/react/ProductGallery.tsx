// ============================================================
//  ProductGallery — editorial PDP gallery: vertical thumb rail
//  + large main image with a soft swap fade.
// ============================================================
import { useState } from 'react';
import type { Image } from '~/lib/shopify/types';

interface Props {
  images: Image[];
  title: string;
}

export default function ProductGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);
  const gallery = images.length ? images : [];
  const current = gallery[active];

  const Main = (
    <div className="pdp-main">
      {current ? (
        <img
          src={current.url}
          alt={current.altText ?? title}
          width={current.width ?? undefined}
          height={current.height ?? undefined}
          fetchPriority="high"
        />
      ) : (
        <div className="pdp-noimg">No image</div>
      )}
    </div>
  );

  // Single image — no thumb rail.
  if (gallery.length <= 1) {
    return <div>{Main}</div>;
  }

  return (
    <div className="pdp-gallery">
      <div className="pdp-thumbs" aria-label={`${title} images`}>
        {gallery.map((img, i) => (
          <button
            key={img.id ?? img.url}
            type="button"
            className={`pdp-thumb ${i === active ? 'active' : ''}`}
            aria-pressed={i === active}
            aria-label={`Show image ${i + 1}`}
            onClick={() => setActive(i)}
          >
            <img src={img.url} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      {Main}
    </div>
  );
}
