import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { site, isDemoCatalog } from '../config/site';
import { categories } from '../data/catalog';
import { getProduct, relatedProducts } from '../lib/catalog';
import { formatPrice, stockLabels } from '../lib/format';
import { useSeo } from '../hooks/useSeo';
import { ProductPhoto, photoOf } from '../components/ProductPhoto';
import { ConsultaButton } from '../components/WhatsApp';
import { ProductCard } from '../components/ProductCard';
import { NotFound } from './NotFound';

export function ProductPage() {
  const { slug } = useParams();
  const product = slug ? getProduct(slug) : undefined;

  if (!product) return <NotFound />;

  return <ProductDetail key={product.slug} slug={product.slug} />;
}

function ProductDetail({ slug }: { slug: string }) {
  const product = getProduct(slug)!;
  const storages = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.storage).filter(Boolean) as string[])),
    [product],
  );

  const [storage, setStorage] = useState<string | undefined>(storages[0]);
  const colorsFor = (s: string | undefined) =>
    Array.from(
      new Map(
        product.variants
          .filter((v) => (s ? v.storage === s : true))
          .map((v) => [v.color, v] as const),
      ).values(),
    );

  const colors = colorsFor(storage);
  const [color, setColor] = useState<string>(colors[0]?.color ?? product.variants[0].color);
  const [photoIndex, setPhotoIndex] = useState(0);

  const variant =
    product.variants.find((v) => v.color === color && (!storage || v.storage === storage)) ??
    colors[0] ??
    product.variants[0];

  const stock = stockLabels[variant.stock];
  const category = categories.find((c) => c.id === product.category)!;
  const related = relatedProducts(product);

  /* La foto del color elegido manda; si no hay, se usan las del producto. */
  const gallery = variant.photo ? [variant.photo] : (product.photos ?? []);
  const currentPhoto = gallery[photoIndex] ?? photoOf(product, variant);

  useSeo({
    title: `${product.brand} ${product.model}`,
    description: `${product.brand} ${product.model}: ${product.tagline} Especificaciones, capacidades y colores. Consultá precio y disponibilidad por WhatsApp.`,
  });

  function pickStorage(next: string) {
    setStorage(next);
    const available = colorsFor(next);
    if (!available.some((v) => v.color === color)) setColor(available[0].color);
    setPhotoIndex(0);
  }

  return (
    <article className="product">
      <nav className="breadcrumb" aria-label="Migas de pan">
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <Link
          to={product.category === 'smartphones' ? '/smartphones' : `/catalogo?categoria=${product.category}`}
        >
          {category.label}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.model}</span>
      </nav>

      <div className="product__top">
        {/* --------------------------------------------------------- Fotos */}
        <div className="gallery">
          <ProductPhoto
            product={product}
            variant={variant}
            src={currentPhoto}
            priority
            alt={`${product.brand} ${product.model}, color ${variant.color}`}
          />

          {gallery.length > 1 && (
            <div className="gallery__thumbs">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={`gallery__thumb ${photoIndex === i ? 'is-active' : ''}`}
                  onClick={() => setPhotoIndex(i)}
                  aria-label={`Ver foto ${i + 1} de ${gallery.length}`}
                  aria-pressed={photoIndex === i}
                >
                  <ProductPhoto product={product} src={src} alt="" />
                </button>
              ))}
            </div>
          )}

          {!currentPhoto && (
            <p className="gallery__note">
              Todavía no cargamos las fotos de este equipo. Si querés verlo antes de decidir,
              pedinos fotos reales por WhatsApp.
            </p>
          )}
        </div>

        {/* --------------------------------------------------------- Datos */}
        <div className="product__info">
          <p className="eyebrow">{product.brand}</p>
          <h1 className="product__title">{product.model}</h1>
          <p className="product__tagline">{product.tagline}</p>

          <div className="product__price-row">
            {site.catalog.showPrices && variant.price !== null ? (
              <p className="product__price">{formatPrice(variant.price)}</p>
            ) : (
              <p className="product__price product__price--ask">Precio a consultar</p>
            )}
            <span className={`stock stock--${stock.tone}`}>
              <span className="stock__dot" aria-hidden="true" />
              {stock.text}
            </span>
          </div>
          {isDemoCatalog && (
            <p className="product__price-note">
              Precio y disponibilidad de referencia del catálogo de demostración. El valor final se
              confirma por WhatsApp.
            </p>
          )}

          {storages.length > 0 && (
            <div className="selector">
              <p className="selector__label">
                Capacidad<span className="selector__value">{storage}</span>
              </p>
              <div className="selector__options">
                {storages.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`opt mono ${storage === s ? 'is-active' : ''}`}
                    onClick={() => pickStorage(s)}
                    aria-pressed={storage === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="selector">
            <p className="selector__label">Color</p>
            <div className="selector__options">
              {colors.map((v) => (
                <button
                  key={v.color}
                  type="button"
                  className={`swatch ${color === v.color ? 'is-active' : ''}`}
                  onClick={() => {
                    setColor(v.color);
                    setPhotoIndex(0);
                  }}
                  aria-pressed={color === v.color}
                >
                  <span className="swatch__dot" style={{ background: v.hex }} aria-hidden="true" />
                  {v.color}
                </button>
              ))}
            </div>
          </div>

          <div className="product__actions">
            <ConsultaButton kind="producto" product={product} variant={variant} size="lg">
              Consultar por este producto
            </ConsultaButton>
          </div>

          <p className="product__description">{product.description}</p>

          <ul className="highlights">
            {product.highlights.map((h) => (
              <li key={h}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                  <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ------------------------------------------------- Especificaciones */}
      <section className="section section--tight">
        <h2 className="section__title section__title--sm">Especificaciones</h2>
        <dl className="specs">
          {product.specs.map((s) => (
            <div key={s.label} className="specs__row">
              <dt className="specs__key">{s.label}</dt>
              <dd className="specs__value">{s.value}</dd>
            </div>
          ))}
          <div className="specs__row">
            <dt className="specs__key">Capacidades</dt>
            <dd className="specs__value mono">{storages.length ? storages.join(' · ') : 'Única'}</dd>
          </div>
          <div className="specs__row">
            <dt className="specs__key">Colores</dt>
            <dd className="specs__value">
              {Array.from(new Set(product.variants.map((v) => v.color))).join(' · ')}
            </dd>
          </div>
        </dl>
      </section>

      {/* ------------------------------------------------------ Relacionados */}
      {related.length > 0 && (
        <section className="section section--tight section--line">
          <div className="section__head">
            <h2 className="section__title">Productos relacionados</h2>
          </div>
          <div className="grid-products">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* --------------------------------------------- Barra fija en móvil */}
      <div className="sticky-cta">
        <div className="sticky-cta__info">
          <span className="sticky-cta__name">{product.model}</span>
          <span className="sticky-cta__meta mono">
            {[storage, variant.color].filter(Boolean).join(' · ')}
          </span>
        </div>
        <ConsultaButton kind="producto" product={product} variant={variant}>
          Consultar
        </ConsultaButton>
      </div>
    </article>
  );
}
