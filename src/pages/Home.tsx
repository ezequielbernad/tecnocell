import { Link } from 'react-router-dom';
import { site, hasWhatsApp } from '../config/site';
import { brands, categories, products } from '../data/catalog';
import { useSeo } from '../hooks/useSeo';
import { ConsultaButton } from '../components/WhatsApp';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';

const heroSlugs = ['apple-iphone-15-pro-max', 'samsung-galaxy-s24', 'xiaomi-redmi-note-13-pro'];

export function Home() {
  useSeo({
    title: site.name,
    description:
      'Catálogo de smartphones, auriculares, cargadores y accesorios. Mirá especificaciones y consultá precio y disponibilidad por WhatsApp.',
  });

  const featured = products.filter((p) => p.featured).slice(0, 6);
  const heroProducts = heroSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__text">
            <p className="eyebrow mono">Tienda de tecnología</p>
            <h1 className="hero__title">
              Tu próximo teléfono, <span className="accent">elegido con criterio</span>.
            </h1>
            <p className="hero__lead">
              Smartphones, auriculares y accesorios con las especificaciones a la vista. Mirá el
              catálogo, comparalo con calma y consultanos por el equipo que te interese: te
              respondemos con precio y disponibilidad.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--primary btn--lg" to="/smartphones">
                Ver smartphones
              </Link>
              <ConsultaButton kind="general" tone="outline" size="lg">
                Consultar por WhatsApp
              </ConsultaButton>
            </div>
            <dl className="hero__stats mono">
              <div>
                <dt>Productos</dt>
                <dd>{products.length}</dd>
              </div>
              <div>
                <dt>Marcas</dt>
                <dd>{brands.length}</dd>
              </div>
              <div>
                <dt>Categorías</dt>
                <dd>{categories.length}</dd>
              </div>
            </dl>
          </div>

          <div className="hero__stage" aria-hidden="true">
            {heroProducts.map((p, i) => (
              <div key={p.slug} className={`hero__device hero__device--${i + 1}`}>
                <ProductImage product={p} color={p.variants[0].hex} view={i === 1 ? 'frente' : 'dorso'} alt="" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Categorías */}
      <section className="section" aria-labelledby="categorias-title">
        <div className="section__head">
          <div>
            <p className="eyebrow mono">Categorías</p>
            <h2 id="categorias-title" className="section__title">
              Buscá por tipo de producto
            </h2>
          </div>
          <Link className="link-arrow" to="/catalogo">
            Ver todo el catálogo
          </Link>
        </div>

        <ul className="cat-grid">
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.id).length;
            const target =
              c.id === 'smartphones' ? '/smartphones' : `/catalogo?categoria=${c.id}`;
            return (
              <li key={c.id}>
                <Link className="cat-card" to={target}>
                  <span className="cat-card__count mono">{count}</span>
                  <span className="cat-card__name">{c.label}</span>
                  <span className="cat-card__blurb">{c.blurb}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---------------------------------------------------------- Destacados */}
      <section className="section" aria-labelledby="destacados-title">
        <div className="section__head">
          <div>
            <p className="eyebrow mono">Destacados</p>
            <h2 id="destacados-title" className="section__title">
              Los equipos que más nos consultan
            </h2>
          </div>
          <Link className="link-arrow" to="/smartphones">
            Ver todos los smartphones
          </Link>
        </div>

        <div className="grid-products">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- Marcas */}
      <section className="section" aria-labelledby="marcas-title">
        <div className="section__head">
          <div>
            <p className="eyebrow mono">Marcas</p>
            <h2 id="marcas-title" className="section__title">
              Explorá por marca
            </h2>
          </div>
        </div>
        <ul className="brand-row">
          {brands.map((b) => {
            const count = products.filter((p) => p.brand === b).length;
            return (
              <li key={b}>
                <Link className="brand-tile" to={`/catalogo?marca=${encodeURIComponent(b)}`}>
                  <span className="brand-tile__name">{b}</span>
                  <span className="brand-tile__count mono">
                    {count} {count === 1 ? 'producto' : 'productos'}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ------------------------------------------------------- Asesoramiento */}
      <section className="section" aria-labelledby="asesor-title">
        <div className="advice">
          <div className="advice__text">
            <p className="eyebrow mono">Asesoramiento</p>
            <h2 id="asesor-title" className="advice__title">
              Te ayudamos a elegir tu próximo smartphone
            </h2>
            <p className="advice__lead">
              Contanos tres cosas y te proponemos dos o tres equipos concretos del catálogo, con
              los motivos de cada opción.
            </p>
            <ol className="advice__list">
              <li>
                <span className="advice__num mono">01</span>
                <span>
                  <strong>Para qué lo vas a usar.</strong> Fotos, juegos, trabajo o uso diario.
                </span>
              </li>
              <li>
                <span className="advice__num mono">02</span>
                <span>
                  <strong>Cuánto querés gastar.</strong> Un rango aproximado alcanza.
                </span>
              </li>
              <li>
                <span className="advice__num mono">03</span>
                <span>
                  <strong>Qué tenés hoy.</strong> Así comparamos contra tu equipo actual.
                </span>
              </li>
            </ol>
            <ConsultaButton kind="asesoramiento" size="lg">
              Pedir una recomendación
            </ConsultaButton>
          </div>
          <div className="advice__aside" aria-hidden="true">
            <div className="advice__chat">
              <p className="advice__bubble advice__bubble--in">
                Busco algo para sacar buenas fotos, hasta $700.000
              </p>
              <p className="advice__bubble advice__bubble--out">
                Con ese presupuesto miraría el Redmi Note 13 Pro o el Edge 50 Fusion. Te paso las
                diferencias.
              </p>
            </div>
            <p className="advice__caption mono">Ejemplo de conversación</p>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Preguntas frecuentes */}
      <section className="section" id="preguntas" aria-labelledby="faq-title">
        <div className="section__head">
          <div>
            <p className="eyebrow mono">Preguntas frecuentes</p>
            <h2 id="faq-title" className="section__title">
              Antes de consultar
            </h2>
          </div>
        </div>
        <div className="faq">
          {site.faq.map((item) => (
            <details key={item.q} className="faq__item">
              <summary className="faq__q">
                <span>{item.q}</span>
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <p className="faq__a">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ Contacto */}
      <section className="section" id="contacto-home" aria-labelledby="contacto-title">
        <div className="cta-panel">
          <div>
            <p className="eyebrow mono">Contacto</p>
            <h2 id="contacto-title" className="cta-panel__title">
              ¿Ya sabés qué equipo querés?
            </h2>
            <p className="cta-panel__lead">
              Escribinos con el modelo, la capacidad y el color, y te confirmamos precio y
              disponibilidad.
              {!hasWhatsApp && ' El número de WhatsApp se publica apenas esté confirmado.'}
            </p>
          </div>
          <div className="cta-panel__actions">
            <ConsultaButton kind="general" size="lg">
              Consultar por WhatsApp
            </ConsultaButton>
            <Link className="btn btn--plain" to="/contacto">
              Ver datos de contacto
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
