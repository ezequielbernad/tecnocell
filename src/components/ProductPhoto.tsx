import type { CategoryId, Product, Variant } from '../data/catalog';

/* ---------------------------------------------------------------------------
 * Foto de producto
 * ---------------------------------------------------------------------------
 * Muestra la fotografía real del equipo. Las fotos se cargan así:
 *
 *   1. Copiar el archivo en  public/productos/   (ver el README de esa carpeta)
 *   2. En src/data/catalog.ts, indicar la ruta en el producto:
 *        photo: '/productos/apple-iphone-15.jpg'
 *      y, si hay una foto por color, en la variante:
 *        { color: 'Azul', photo: '/productos/apple-iphone-15-azul.jpg', ... }
 *
 * Mientras un producto no tenga foto cargada se muestra un marcador neutro:
 * un contorno esquemático según la categoría, que NO intenta parecerse al
 * modelo. Nunca se representa un equipo concreto con una imagen inventada.
 * ------------------------------------------------------------------------- */

interface Props {
  product: Product;
  /** Variante elegida: si tiene foto propia, tiene prioridad. */
  variant?: Variant;
  /** Foto puntual (galería). */
  src?: string;
  className?: string;
  /** El texto alternativo vacío se usa cuando la imagen es decorativa. */
  alt?: string;
  /** La primera imagen visible de la página no debe diferirse. */
  priority?: boolean;
}

export function photoOf(product: Product, variant?: Variant): string | undefined {
  return variant?.photo ?? product.photo ?? product.photos?.[0];
}

export function ProductPhoto({ product, variant, src, className, alt, priority }: Props) {
  const source = src ?? photoOf(product, variant);
  const label = alt ?? `${product.brand} ${product.model}`;

  return (
    <div className={`photo ${className ?? ''}`.trim()}>
      {source ? (
        <img
          className="photo__img"
          src={source}
          alt={label}
          width={800}
          height={1000}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <span className="photo__placeholder" role="img" aria-label={`${label}: foto pendiente`}>
          <CategoryOutline category={product.category} />
          <span className="photo__label">Foto pendiente</span>
        </span>
      )}
    </div>
  );
}

/**
 * Contorno esquemático por categoría. Es deliberadamente genérico: sirve para
 * ocupar el lugar de la foto sin sugerir cómo es el equipo.
 */
function CategoryOutline({ category }: { category: CategoryId }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (category === 'auriculares') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M14 38V32a18 18 0 0 1 36 0v6" {...common} />
        <rect x="8" y="36" width="12" height="18" rx="6" {...common} />
        <rect x="44" y="36" width="12" height="18" rx="6" {...common} />
      </svg>
    );
  }

  if (category === 'cargadores') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="16" y="18" width="32" height="32" rx="6" {...common} />
        <path d="M26 18v-8M38 18v-8" {...common} />
      </svg>
    );
  }

  if (category === 'accesorios') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="12" y="16" width="40" height="34" rx="5" {...common} />
        <path d="M12 26h40" {...common} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="20" y="6" width="24" height="52" rx="5" {...common} />
      <path d="M28 12h8" {...common} />
    </svg>
  );
}
