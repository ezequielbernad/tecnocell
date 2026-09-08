import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories, products } from '../data/catalog';
import type { CategoryId, Product } from '../data/catalog';
import { applyFilters, sortOptions } from '../lib/catalog';
import type { Filters, SortId } from '../lib/catalog';
import { formatPrice, plural } from '../lib/format';
import { site } from '../config/site';
import { useSeo } from '../hooks/useSeo';
import { ProductCard } from '../components/ProductCard';
import { ConsultaButton } from '../components/WhatsApp';

type Scope = 'todo' | 'smartphones' | 'accesorios';

const scopeConfig: Record<
  Scope,
  { categories: CategoryId[]; title: string; eyebrow: string; lead: string; seo: string }
> = {
  todo: {
    categories: ['smartphones', 'auriculares', 'cargadores', 'accesorios'],
    title: 'Catálogo completo',
    eyebrow: 'Catálogo',
    lead: 'Todos los equipos y accesorios cargados. Filtrá por marca, categoría, capacidad o precio.',
    seo: 'Catálogo completo de Tecnocell: smartphones, auriculares, cargadores y accesorios, con filtros por marca, capacidad y precio.',
  },
  smartphones: {
    categories: ['smartphones'],
    title: 'Smartphones',
    eyebrow: 'Catálogo',
    lead: 'Equipos de entrada, gama media y gama alta. Filtrá por marca, capacidad o precio para acotar la búsqueda.',
    seo: 'Smartphones en Tecnocell: Apple, Samsung, Xiaomi, Motorola y Google. Filtrá por marca, capacidad y precio, y consultá por WhatsApp.',
  },
  accesorios: {
    categories: ['auriculares', 'cargadores', 'accesorios'],
    title: 'Accesorios',
    eyebrow: 'Catálogo',
    lead: 'Auriculares, cargadores, cables, baterías portátiles y protección para tu equipo.',
    seo: 'Accesorios en Tecnocell: auriculares, cargadores, cables, baterías portátiles, fundas y vidrios templados.',
  },
};

function parseList(value: string | null): string[] {
  return value ? value.split(',').map((v) => v.trim()).filter(Boolean) : [];
}

export function Catalog({ scope }: { scope: Scope }) {
  const config = scopeConfig[scope];
  const [params, setParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useSeo({ title: config.title, description: config.seo });

  const universe = useMemo(
    () => products.filter((p) => config.categories.includes(p.category)),
    [config.categories],
  );

  const availableBrands = useMemo(
    () => Array.from(new Set(universe.map((p) => p.brand))).sort((a, b) => a.localeCompare(b, 'es')),
    [universe],
  );
  const availableStorages = useMemo(
    () =>
      Array.from(
        new Set(universe.flatMap((p) => p.variants.map((v) => v.storage).filter(Boolean) as string[])),
      ).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)),
    [universe],
  );
  const ceiling = useMemo(() => {
    const values = universe.flatMap((p) => p.variants.map((v) => v.price ?? 0));
    return Math.ceil(Math.max(0, ...values) / 50000) * 50000;
  }, [universe]);

  const filters: Filters = {
    q: params.get('q') ?? '',
    brands: parseList(params.get('marca')),
    categories: parseList(params.get('categoria')) as CategoryId[],
    storages: parseList(params.get('gb')),
    maxPrice: params.get('max') ? Number(params.get('max')) : null,
    sort: (params.get('orden') as SortId) || 'relevancia',
  };

  const results = useMemo(() => applyFilters(universe, filters), [universe, params]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeCount =
    filters.brands.length +
    filters.categories.length +
    filters.storages.length +
    (filters.maxPrice !== null ? 1 : 0) +
    (filters.q ? 1 : 0);

  function update(patch: Record<string, string | null>) {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === '') next.delete(key);
      else next.set(key, value);
    });
    setParams(next, { replace: true });
  }

  function toggle(key: 'marca' | 'categoria' | 'gb', value: string) {
    const current = parseList(params.get(key));
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    update({ [key]: next.join(',') });
  }

  function clearAll() {
    setParams(new URLSearchParams(), { replace: true });
  }

  // Cierra el panel de filtros al pasar a escritorio.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 981px)');
    const onChange = () => mq.matches && setDrawerOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const filterPanel = (
    <div className="filters">
      <FilterGroup title="Marca">
        {availableBrands.map((b) => (
          <Check
            key={b}
            label={b}
            count={universe.filter((p) => p.brand === b).length}
            checked={filters.brands.includes(b)}
            onChange={() => toggle('marca', b)}
          />
        ))}
      </FilterGroup>

      {config.categories.length > 1 && (
        <FilterGroup title="Categoría">
          {config.categories.map((id) => {
            const cat = categories.find((c) => c.id === id)!;
            return (
              <Check
                key={id}
                label={cat.label}
                count={universe.filter((p) => p.category === id).length}
                checked={filters.categories.includes(id)}
                onChange={() => toggle('categoria', id)}
              />
            );
          })}
        </FilterGroup>
      )}

      {availableStorages.length > 0 && (
        <FilterGroup title="Almacenamiento">
          {availableStorages.map((s) => (
            <Check
              key={s}
              label={s}
              mono
              count={universe.filter((p) => p.variants.some((v) => v.storage === s)).length}
              checked={filters.storages.includes(s)}
              onChange={() => toggle('gb', s)}
            />
          ))}
        </FilterGroup>
      )}

      {site.catalog.showPrices && ceiling > 0 && (
        <FilterGroup title="Precio máximo">
          <label className="range">
            <span className="range__value mono">
              {filters.maxPrice === null ? 'Sin límite' : `Hasta ${formatPrice(filters.maxPrice)}`}
            </span>
            <input
              type="range"
              min={50000}
              max={ceiling}
              step={50000}
              value={filters.maxPrice ?? ceiling}
              onChange={(e) => {
                const value = Number(e.target.value);
                update({ max: value >= ceiling ? null : String(value) });
              }}
              aria-label="Precio máximo"
            />
            <span className="range__ends mono">
              <span>{formatPrice(50000)}</span>
              <span>{formatPrice(ceiling)}</span>
            </span>
          </label>
        </FilterGroup>
      )}

      {activeCount > 0 && (
        <button type="button" className="btn btn--plain filters__clear" onClick={clearAll}>
          Limpiar filtros ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="catalog">
      <header className="catalog__head">
        <p className="eyebrow mono">{config.eyebrow}</p>
        <h1 className="catalog__title">{config.title}</h1>
        <p className="catalog__lead">{config.lead}</p>
      </header>

      <div className="catalog__toolbar">
        <div className="field field--search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={filters.q}
            placeholder="Buscar por marca o modelo"
            aria-label="Buscar por marca o modelo"
            onChange={(e) => update({ q: e.target.value })}
          />
        </div>

        <div className="catalog__toolbar-right">
          <button
            type="button"
            className="btn btn--outline catalog__filters-btn"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
          >
            Filtros{activeCount > 0 ? ` (${activeCount})` : ''}
          </button>

          <label className="field field--select">
            <span className="visually-hidden">Ordenar por</span>
            <select value={filters.sort} onChange={(e) => update({ orden: e.target.value })}>
              {sortOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="catalog__body">
        <aside className="catalog__sidebar" aria-label="Filtros">
          {filterPanel}
        </aside>

        <div className="catalog__results">
          <p className="catalog__count mono" role="status">
            {plural(results.length, 'resultado', 'resultados')}
            {activeCount > 0 && (
              <>
                {' · '}
                <button type="button" className="link-btn" onClick={clearAll}>
                  limpiar filtros
                </button>
              </>
            )}
          </p>

          {results.length > 0 ? (
            <div className="grid-products">
              {results.map((p: Product) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h2 className="empty__title">No hay equipos con esos filtros</h2>
              <p className="empty__text">
                Probá quitar algún filtro o buscar sólo por marca. Si tenés un modelo puntual en
                mente, escribinos: podemos conseguirlo a pedido.
              </p>
              <div className="empty__actions">
                <button type="button" className="btn btn--primary" onClick={clearAll}>
                  Limpiar filtros
                </button>
                <ConsultaButton kind="general" tone="outline">
                  Consultar por WhatsApp
                </ConsultaButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div className="overlay overlay--bottom" onClick={() => setDrawerOpen(false)}>
          <div
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer__head">
              <h2 className="drawer__title">Filtros</h2>
              <button type="button" className="icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Cerrar filtros">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="drawer__body">{filterPanel}</div>
            <div className="drawer__foot">
              <button type="button" className="btn btn--primary btn--block" onClick={() => setDrawerOpen(false)}>
                Ver {plural(results.length, 'resultado', 'resultados')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="filter-group">
      <legend className="filter-group__title mono">{title}</legend>
      <div className="filter-group__body">{children}</div>
    </fieldset>
  );
}

function Check({
  label,
  count,
  checked,
  onChange,
  mono,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
  mono?: boolean;
}) {
  return (
    <label className={`check ${checked ? 'is-checked' : ''}`}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={`check__label ${mono ? 'mono' : ''}`}>{label}</span>
      <span className="check__count mono">{count}</span>
    </label>
  );
}
