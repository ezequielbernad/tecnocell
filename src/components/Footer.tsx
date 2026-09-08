import { Link } from 'react-router-dom';
import { site, isDemoCatalog, hasWhatsApp } from '../config/site';
import { Logo } from './Header';

const catalogo = [
  { to: '/smartphones', label: 'Smartphones' },
  { to: '/catalogo?categoria=auriculares', label: 'Auriculares' },
  { to: '/catalogo?categoria=cargadores', label: 'Cargadores' },
  { to: '/accesorios', label: 'Accesorios' },
];

export function Footer() {
  const year = new Date().getFullYear();
  const hasContacto =
    hasWhatsApp ||
    site.contact.email ||
    site.contact.phone ||
    site.contact.address ||
    site.openingHours.length > 0;

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Logo />
          <p className="footer__blurb">{site.description}</p>
        </div>

        <nav className="footer__col" aria-label="Catálogo">
          <h2 className="footer__heading mono">Catálogo</h2>
          <ul>
            {catalogo.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer__col" aria-label="Tienda">
          <h2 className="footer__heading mono">Tienda</h2>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/catalogo">Todo el catálogo</Link>
            </li>
            <li>
              <Link to="/contacto">Contacto</Link>
            </li>
            <li>
              <Link to="/#preguntas">Preguntas frecuentes</Link>
            </li>
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__heading mono">Contacto</h2>
          {hasContacto ? (
            <ul>
              {site.contact.phone && (
                <li>
                  <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`}>{site.contact.phone}</a>
                </li>
              )}
              {site.contact.email && (
                <li>
                  <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                </li>
              )}
              {site.contact.address && (
                <li>
                  {site.contact.address}
                  {site.contact.city ? `, ${site.contact.city}` : ''}
                </li>
              )}
              {site.openingHours.map((h) => (
                <li key={h.days}>
                  {h.days}: {h.hours}
                </li>
              ))}
              {site.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="footer__pending">
              Los datos de contacto se publican cuando estén confirmados. Mientras tanto, las
              consultas se hacen desde los botones de WhatsApp.
            </p>
          )}
        </div>
      </div>

      <div className="footer__bottom">
        <p>
          © {year} {site.name}. {site.tagline}.
        </p>
        {isDemoCatalog && (
          <p className="footer__demo mono">
            Catálogo de demostración: productos, precios y stock son de ejemplo.
          </p>
        )}
      </div>
    </footer>
  );
}
