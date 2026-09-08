import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '../config/site';

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export interface Seo {
  title: string;
  description: string;
}

/**
 * Metadatos por página. La URL canónica sólo se emite si `site.url` está
 * configurado; no se inventa un dominio.
 */
export function useSeo({ title, description }: Seo) {
  const { pathname } = useLocation();

  useEffect(() => {
    const full = title === site.name ? `${site.name} — ${site.tagline}` : `${title} | ${site.name}`;
    document.title = full;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: full });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: site.name });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });

    if (site.url) {
      upsertMeta('meta[property="og:url"]', { property: 'og:url', content: site.url + pathname });
      upsertLink('canonical', site.url + pathname);
    }
  }, [title, description, pathname]);
}
