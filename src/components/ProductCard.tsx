import { Link } from 'react-router-dom';
import { site, isDemoCatalog } from '../config/site';
import type { Product } from '../data/catalog';
import { formatPrice, minPrice, stockLabels } from '../lib/format';
import { ProductImage } from './ProductImage';

/** Capacidades distintas del producto, en orden. */
function storages(product: Product): string[] {
  return Array.from(new Set(product.variants.map((v) => v.storage).filter(Boolean) as string[]));
}

/** Mejor estado de stock entre las variantes. */
function bestStock(product: Product) {
  const order = ['disponible', 'a-pedido', 'sin-stock'];
  const best = [...product.variants].sort(
    (a, b) => order.indexOf(a.stock) - order.indexOf(b.stock),
  )[0];
  return stockLabels[best.stock];
}

export function ProductCard({ product }: { product: Product }) {
  const price = minPrice(product);
  const caps = storages(product);
  const stock = bestStock(product);
  const multiPrice = new Set(product.variants.map((v) => v.price)).size > 1;

  return (
    <article className="card">
      <Link className="card__link" to={`/producto/${product.slug}`}>
        <div className="card__plate">
          <ProductImage
            product={product}
            color={product.variants[0].hex}
            className="card__image"
            alt={`${product.brand} ${product.model}`}
          />
          {product.featured && <span className="tag tag--accent">Destacado</span>}
        </div>

        <div className="card__body">
          <p className="card__brand mono">{product.brand}</p>
          <h3 className="card__title">{product.model}</h3>
          <p className="card__tagline">{product.tagline}</p>

          {caps.length > 0 && (
            <ul className="chip-row" aria-label="Capacidades disponibles">
              {caps.map((c) => (
                <li key={c} className="chip mono">
                  {c}
                </li>
              ))}
            </ul>
          )}

          <div className="card__foot">
            <div className="card__price">
              {site.catalog.showPrices && price !== null ? (
                <>
                  <span className="card__price-value">
                    {multiPrice && <span className="card__price-from">desde </span>}
                    {formatPrice(price)}
                  </span>
                  {isDemoCatalog && <span className="card__price-note mono">precio de referencia</span>}
                </>
              ) : (
                <span className="card__price-value card__price-value--ask">Consultar precio</span>
              )}
            </div>
            <span className={`stock stock--${stock.tone}`}>
              <span className="stock__dot" aria-hidden="true" />
              {stock.text}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
