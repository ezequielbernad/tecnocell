import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { site } from '../config/site';
import { quickSearch } from '../lib/catalog';
import { minPrice, formatPrice } from '../lib/format';
import { ConsultaButton } from './WhatsApp';
import { ProductImage } from './ProductImage';

const navItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/smartphones', label: 'Smartphones', end: false },
  { to: '/accesorios', label: 'Accesorios', end: false },
  { to: '/contacto', label: 'Contacto', end: false },
];

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`logo ${className}`.trim()}>
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
          <rect x="10" y="3" width="12" height="26" rx="3.5" stroke="currentColor" strokeWidth="2" />
          <rect x="13.5" y="9" width="5" height="8" rx="1.2" fill="currentColor" />
          <circle cx="16" cy="23" r="1.6" fill="currentColor" />
        </svg>
      </span>
      <span className="logo__word">
        tecno<strong>cell</strong>
      </span>
    </span>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuBtn.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className="header">
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <div className="header__inner">
        <Link to="/" className="header__brand" onClick={() => setMenuOpen(false)} aria-label={`${site.name}, inicio`}>
          <Logo />
        </Link>

        <nav className="header__nav" aria-label="Principal">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `header__link ${isActive ? 'is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <button
            type="button"
            className="header__search-trigger"
            onClick={() => setSearchOpen(true)}
            aria-label="Buscar productos"
          >
            <SearchIcon />
            <span className="header__search-text">Buscar equipos</span>
          </button>

          <ConsultaButton kind="general" className="header__cta">
            Consultar
          </ConsultaButton>

          <button
            ref={menuBtn}
            type="button"
            className="header__burger"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="visually-hidden">{menuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      <div id="menu-movil" className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} hidden={!menuOpen}>
        <nav className="mobile-menu__nav" aria-label="Principal, móvil">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `mobile-menu__link ${isActive ? 'is-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mobile-menu__actions">
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(true);
            }}
          >
            <SearchIcon />
            <span>Buscar equipos</span>
          </button>
          <ConsultaButton kind="general">Consultar por WhatsApp</ConsultaButton>
        </div>
      </div>

      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const results = quickSearch(q);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/catalogo?q=${encodeURIComponent(q.trim())}`);
    onClose();
  };

  return (
    <div className="overlay overlay--top" onClick={onClose}>
      <div
        className="search-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Buscar productos"
        onClick={(e) => e.stopPropagation()}
      >
        <form className="search-panel__form" onSubmit={submit} role="search">
          <SearchIcon />
          <input
            ref={inputRef}
            type="search"
            className="search-panel__input"
            placeholder="Buscá por marca o modelo: iPhone, Redmi, auriculares…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar por marca o modelo"
          />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar búsqueda">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </form>

        {q.trim() !== '' && (
          <div className="search-panel__results">
            {results.length === 0 ? (
              <p className="search-panel__empty">
                No encontramos equipos para “{q}”. Probá con la marca (Samsung, Xiaomi) o mirá el{' '}
                <Link to="/catalogo" onClick={onClose}>
                  catálogo completo
                </Link>
                .
              </p>
            ) : (
              <ul className="search-panel__list">
                {results.map((p) => {
                  const price = minPrice(p);
                  return (
                    <li key={p.slug}>
                      <Link className="search-result" to={`/producto/${p.slug}`} onClick={onClose}>
                        <span className="search-result__thumb">
                          <ProductImage product={p} color={p.variants[0].hex} alt="" />
                        </span>
                        <span className="search-result__text">
                          <span className="search-result__name">
                            {p.brand} {p.model}
                          </span>
                          <span className="search-result__meta mono">
                            {site.catalog.showPrices && price ? `desde ${formatPrice(price)}` : 'Consultar precio'}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
