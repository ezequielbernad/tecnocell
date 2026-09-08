import { site, hasWhatsApp } from '../config/site';
import type { Product, Variant } from '../data/catalog';

export type ConsultaKind = 'general' | 'asesoramiento' | 'producto';

/**
 * Arma el texto de la consulta. El mensaje siempre incluye el nombre del
 * producto y, cuando corresponde, la capacidad y el color elegidos.
 */
export function buildMessage(
  kind: ConsultaKind,
  product?: Product,
  variant?: Variant,
): string {
  const hola = site.whatsapp.greeting;

  if (kind === 'asesoramiento') {
    return `${hola} Quiero ayuda para elegir un smartphone. ¿Me pasan un par de opciones?`;
  }

  if (kind === 'producto' && product) {
    const nombre = `${product.brand} ${product.model}`;
    const partes = [`Quiero consultar por el ${nombre}`];
    if (variant?.storage) partes.push(`de ${variant.storage}`);
    if (variant?.color) partes.push(`en color ${variant.color}`);
    return `${hola} ${partes.join(', ')}. ¿Me pasan precio y disponibilidad?`;
  }

  return `${hola} Quiero consultar por los equipos disponibles. ¿Me pasan precios?`;
}

/**
 * Devuelve el enlace wa.me sólo si hay un número real configurado.
 * Si no lo hay, devuelve null y la interfaz muestra el mensaje para copiar
 * en lugar de un enlace que no funciona.
 */
export function whatsappUrl(message: string): string | null {
  if (!hasWhatsApp) return null;
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
