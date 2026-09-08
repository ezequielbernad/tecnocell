import { products } from '../data/catalog';
import type { CategoryId, Product } from '../data/catalog';

export type { Product };

export interface StockLabel {
  text: string;
  tone: 'ok' | 'warn' | 'off';
}

export type SortId = 'relevancia' | 'precio-asc' | 'precio-desc' | 'nombre';

export const sortOptions: { id: SortId; label: string }[] = [
  { id: 'relevancia', label: 'Destacados primero' },
  { id: 'precio-asc', label: 'Precio: de menor a mayor' },
  { id: 'precio-desc', label: 'Precio: de mayor a menor' },
  { id: 'nombre', label: 'Nombre A-Z' },
];

export interface Filters {
  q: string;
  brands: string[];
  categories: CategoryId[];
  storages: string[];
  maxPrice: number | null;
  sort: SortId;
}

export const emptyFilters: Filters = {
  q: '',
  brands: [],
  categories: [],
  storages: [],
  maxPrice: null,
  sort: 'relevancia',
};

export function productName(p: Product): string {
  return `${p.brand} ${p.model}`;
}

/** Todas las capacidades presentes en el catálogo, ordenadas por tamaño. */
export const storageOptions: string[] = Array.from(
  new Set(products.flatMap((p) => p.variants.map((v) => v.storage).filter(Boolean) as string[])),
).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

/** Precio más alto del catálogo, base para el filtro de rango. */
export const priceCeiling: number = Math.max(
  0,
  ...products.flatMap((p) => p.variants.map((v) => v.price ?? 0)),
);

function priceOf(p: Product): number {
  const prices = p.variants.map((v) => v.price).filter((v): v is number => typeof v === 'number');
  return prices.length ? Math.min(...prices) : Number.POSITIVE_INFINITY;
}

/** Normaliza para buscar sin acentos ni mayúsculas. */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function matchesQuery(p: Product, q: string): boolean {
  if (!q) return true;
  const haystack = normalize(
    [p.brand, p.model, p.tagline, p.category, ...p.highlights, ...p.variants.map((v) => v.color)].join(' '),
  );
  return normalize(q)
    .split(/\s+/)
    .every((token) => haystack.includes(token));
}

export function applyFilters(list: Product[], f: Filters): Product[] {
  const filtered = list.filter((p) => {
    if (!matchesQuery(p, f.q)) return false;
    if (f.brands.length && !f.brands.includes(p.brand)) return false;
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.storages.length) {
      const has = p.variants.some((v) => v.storage && f.storages.includes(v.storage));
      if (!has) return false;
    }
    if (f.maxPrice !== null) {
      const min = priceOf(p);
      if (!Number.isFinite(min) || min > f.maxPrice) return false;
    }
    return true;
  });

  const sorted = [...filtered];
  switch (f.sort) {
    case 'precio-asc':
      sorted.sort((a, b) => priceOf(a) - priceOf(b));
      break;
    case 'precio-desc':
      sorted.sort((a, b) => priceOf(b) - priceOf(a));
      break;
    case 'nombre':
      sorted.sort((a, b) => productName(a).localeCompare(productName(b), 'es'));
      break;
    default:
      sorted.sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          productName(a).localeCompare(productName(b), 'es'),
      );
  }
  return sorted;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Productos relacionados: misma marca o misma categoría, sin repetir. */
export function relatedProducts(product: Product, limit = 3): Product[] {
  const sameBrand = products.filter((p) => p.slug !== product.slug && p.brand === product.brand);
  const sameCategory = products.filter(
    (p) => p.slug !== product.slug && p.category === product.category && p.brand !== product.brand,
  );
  return [...sameBrand, ...sameCategory].slice(0, limit);
}

/** Búsqueda rápida para el buscador del encabezado. */
export function quickSearch(q: string, limit = 6): Product[] {
  if (!normalize(q)) return [];
  return products.filter((p) => matchesQuery(p, q)).slice(0, limit);
}
