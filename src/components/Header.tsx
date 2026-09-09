import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { site } from '../config/site';
import { quickSearch } from '../lib/catalog';
import { minPrice, formatPrice } from '../lib/format';
import { ConsultaButton } from './WhatsApp';
import { ProductPhoto } from './ProductPhoto';

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
        <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
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

export function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchRow, setSearchRow] = useState(false);
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
      <div className="container">
        <div className="header__inner">
          <Link
            to="/"
            className="header__brand"
            onClick={() => setMenuOpen(false)}
            aria-label={`${site.name}, inicio`}
          >
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

          <div className="header__search">
            <SearchField id="buscador" />
          </div>

          <div className="header__actions">
            <button
              type="button"
              className="icon-btn header__search-toggle"
              onClick={() => setSearchRow((v) => !v)}
              aria-expanded={searchRow}
              aria-controls="buscador-movil"
            >
              <span className="visually-hidden">Buscar equipos</span>
              <SearchIcon size={18} />
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>

        <div id="buscador-movil" className={`header__searchrow ${searchRow ? 'is-open' : ''}`}>
          <SearchField id="buscador-mobile" autoFocus={searchRow} onNavigate={() => setSearchRow(false)} />
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
          <ConsultaButton kind="general">Consultar por WhatsApp</ConsultaButton>
        </div>
      </div>
    </header>
  );
}

interface SearchFieldProps {
  id: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
  placeholder?: string;
  /** Cuando se usa en el catálogo, el texto lo maneja la página. */
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * Buscador con sugerencias. Si recibe `value`/`onChange` funciona como campo
 * controlado (catálogo); si no, mantiene su propio estado y navega al buscar.
 */
export function SearchField({
  id,
  autoFocus,
  onNavigate,
  placeholder = 'Buscar por marca o modelo',
  value,
  onChange,
}: SearchFieldProps) {
  const controlled = typeof value === 'string';
  const [inner, setInner] = useState('');
  const [open, setOpen] = useState(false);
  const q = controlled ? value : inner;
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const results = open && !controlled ? quickSearch(q, 5) : [];

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function update(next: string) {
    if (controlled) onChange?.(next);
    else setInner(next);
    setOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (controlled) return;
    setOpen(false);
    navigate(`/catalogo?q=${encodeURIComponent(q.trim())}`);
    onNavigate?.();
  }

  return (
    <div className="searchfield" ref={boxRef}>
      <form className="searchfield__form" onSubmit={submit} role="search">
        <SearchIcon />
        <input
          ref={inputRef}
          id={id}
          type="search"
          className="searchfield__input"
          placeholder={placeholder}
          value={q}
          onChange={(e) => update(e.target.value)}
          onFocus={() => setOpen(true)}
          aria-label="Buscar por marca o modelo"
          autoComplete="off"
        />
        {q !== '' && (
          <button
            type="button"
            className="searchfield__clear"
            onClick={() => {
              update('');
              inputRef.current?.focus();
            }}
            aria-label="Borrar búsqueda"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {!controlled && open && q.trim() !== '' && (
        <div className="searchfield__results">
          {results.length === 0 ? (
            <p className="searchfield__empty">
              No encontramos equipos para “{q}”. Probá con la marca, o mirá el{' '}
              <Link to="/catalogo" onClick={() => setOpen(false)}>
                catálogo completo
              </Link>
              .
            </p>
          ) : (
            <ul>
              {results.map((p) => {
                const price = minPrice(p);
                return (
                  <li key={p.slug}>
                    <Link
                      className="search-result"
                      to={`/producto/${p.slug}`}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                    >
                      <ProductPhoto product={p} className="search-result__thumb" alt="" />
                      <span className="search-result__text">
                        <span className="search-result__name">
                          {p.brand} {p.model}
                        </span>
                        <span className="search-result__meta">
                          {site.catalog.showPrices && price
                            ? `desde ${formatPrice(price)}`
                            : 'Consultar precio'}
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
  );
}
