import { Link } from 'react-router-dom';
import { site, hasWhatsApp } from '../config/site';
import { brands, categories, products } from '../data/catalog';
import { useSeo } from '../hooks/useSeo';
import { ConsultaButton } from '../components/WhatsApp';
import { ProductCard } from '../components/ProductCard';

export function Home() {
  useSeo({
    title: site.name,
    description:
      'Catálogo de smartphones, auriculares, cargadores y accesorios. Mirá especificaciones y consultá precio y disponibilidad por WhatsApp.',
  });

  const featured = products.filter((p) => p.featured).slice(0, 8);
  const heroPhoto = site.home.heroPhoto;

  return (
    <>
      {/* ---------------------------------------------------------- Portada */}
      <section className="hero">
        <div className="container">
          <div className="hero__inner">
            <div>
              <h1 className="hero__title">Encontrá tu próximo smartphone</h1>
              <p className="hero__lead">
                Equipos nuevos de las marcas que más se usan, con las especificaciones y las
                capacidades a la vista. Elegí el tuyo y consultanos precio y disponibilidad.
              </p>
              <div className="hero__actions">
                <Link className="btn btn--primary btn--lg" to="/smartphones">
                  Ver equipos
                </Link>
                <ConsultaButton kind="general" tone="outline" size="lg">
                  Consultar por WhatsApp
                </ConsultaButton>
              </div>
              <div className="hero__links">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    className="hero__chip"
                    to={c.id === 'smartphones' ? '/smartphones' : `/catalogo?categoria=${c.id}`}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className={`hero__media ${heroPhoto ? '' : 'hero__media--empty'}`}>
              {heroPhoto ? (
                <div className="photo">
                  <img
                    className="photo__img"
                    src={heroPhoto}
                    alt="Equipos disponibles en Tecnocell"
                    width={800}
                    height={680}
                  />
                </div>
              ) : (
                <div className="photo">
                  <span className="photo__placeholder" role="img" aria-label="Foto de portada pendiente">
                    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="6" y="12" width="52" height="40" rx="5" strokeLinejoin="round" />
                      <circle cx="22" cy="26" r="5" />
                      <path d="m10 46 14-13 12 11 8-7 10 9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="photo__label">Foto de portada pendiente</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Destacados */}
      <section className="section">
        <div className="container">
          <div className="section__head">
            <div>
              <h2 className="section__title">Equipos destacados</h2>
              <p className="section__note">Los modelos que más nos consultan.</p>
            </div>
            <Link className="link-more" to="/smartphones">
              Ver todos los smartphones
            </Link>
          </div>

          <div className="grid-products">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} hideTag />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Categorías */}
      <section className="section section--muted">
        <div className="container">
          <div className="section__head">
            <h2 className="section__title">Categorías</h2>
            <Link className="link-more" to="/catalogo">
              Ver todo el catálogo
            </Link>
          </div>

          <ul className="cat-grid">
            {categories.map((c) => {
              const count = products.filter((p) => p.category === c.id).length;
              return (
                <li key={c.id}>
                  <Link
                    className="cat-card"
                    to={c.id === 'smartphones' ? '/smartphones' : `/catalogo?categoria=${c.id}`}
                  >
                    <span className="cat-card__name">
                      {c.label}
                      <span className="cat-card__blurb">{c.blurb}</span>
                    </span>
                    <span className="cat-card__count mono">{count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------------- Marcas */}
      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2 className="section__title">Marcas</h2>
          </div>
          <ul className="brand-row">
            {brands.map((b) => {
              const count = products.filter((p) => p.brand === b).length;
              return (
                <li key={b}>
                  <Link className="brand-tile" to={`/catalogo?marca=${encodeURIComponent(b)}`}>
                    <span className="brand-tile__name">{b}</span>
                    <span className="brand-tile__count mono">{count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------- Asesoramiento */}
      <section className="section section--line">
        <div className="container">
          <div className="advice">
            <div>
              <h2 className="advice__title">Te ayudamos a elegir tu próximo smartphone</h2>
              <p className="advice__lead">
                Contanos tres cosas y te proponemos dos o tres equipos concretos del catálogo, con
                los motivos de cada opción.
              </p>
              <ol className="advice__list">
                <li>
                  <span className="advice__num mono">1</span>
                  <span>
                    <strong>Para qué lo vas a usar.</strong> Fotos, juegos, trabajo o uso diario.
                  </span>
                </li>
                <li>
                  <span className="advice__num mono">2</span>
                  <span>
                    <strong>Cuánto querés gastar.</strong> Un rango aproximado alcanza.
                  </span>
                </li>
                <li>
                  <span className="advice__num mono">3</span>
                  <span>
                    <strong>Qué equipo tenés hoy.</strong> Así comparamos contra lo que usás.
                  </span>
                </li>
              </ol>
              <ConsultaButton kind="asesoramiento">Pedir una recomendación</ConsultaButton>
            </div>

            <div>
              <h2 className="section__title section__title--sm" id="preguntas">
                Preguntas frecuentes
              </h2>
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
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Contacto */}
      <section className="section section--muted" id="contacto-home">
        <div className="container">
          <div className="cta-panel">
            <div>
              <h2 className="cta-panel__title">¿Ya sabés qué equipo querés?</h2>
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
              <Link className="btn btn--outline btn--lg" to="/contacto">
                Ver datos de contacto
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
