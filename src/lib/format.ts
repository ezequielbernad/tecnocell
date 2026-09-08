import { site } from '../config/site';
import type { Product, StockLabel } from './catalog';

const money = new Intl.NumberFormat(site.catalog.locale, {
  style: 'currency',
  currency: site.catalog.currency,
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return money.format(value);
}

/** Precio mínimo del producto, o null si ninguna variante tiene precio. */
export function minPrice(product: Product): number | null {
  const prices = product.variants
    .map((v) => v.price)
    .filter((p): p is number => typeof p === 'number');
  return prices.length ? Math.min(...prices) : null;
}

export function maxPrice(product: Product): number | null {
  const prices = product.variants
    .map((v) => v.price)
    .filter((p): p is number => typeof p === 'number');
  return prices.length ? Math.max(...prices) : null;
}

export const stockLabels: Record<string, StockLabel> = {
  disponible: { text: 'Disponible', tone: 'ok' },
  'a-pedido': { text: 'A pedido', tone: 'warn' },
  'sin-stock': { text: 'Sin stock', tone: 'off' },
};

/** "3 resultados" / "1 resultado" */
export function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}
