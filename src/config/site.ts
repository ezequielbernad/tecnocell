/* ---------------------------------------------------------------------------
 * CONFIGURACIÓN DEL NEGOCIO — Tecnocell
 * ---------------------------------------------------------------------------
 * Este es el ÚNICO archivo que hay que editar para poner la web en producción.
 * Todo lo que está en `null` o en `[]` no se muestra en la web hasta que se
 * complete con datos reales. No hay datos de contacto inventados.
 *
 * Ver README.md → "Datos pendientes" para el checklist de publicación.
 * ------------------------------------------------------------------------- */

export type StockState = 'disponible' | 'a-pedido' | 'sin-stock';

export interface SocialLink {
  label: string;
  href: string;
}

export interface OpeningHours {
  days: string;
  hours: string;
}

export const site = {
  /** Nombre comercial. Se usa en el logo, los títulos y el mensaje de WhatsApp. */
  name: 'Tecnocell',
  /** Descripción corta: aparece en metadatos y en el footer. */
  tagline: 'Smartphones y accesorios',
  description:
    'Tienda de tecnología especializada en smartphones. Consultá precio y disponibilidad por WhatsApp.',

  /**
   * Dominio público del sitio (sin barra final). Se usa para las URLs
   * canónicas y Open Graph. Dejar en null hasta tener el dominio definitivo.
   */
  url: null as string | null,

  /* --- WhatsApp: la conversión principal del sitio ------------------------ */
  whatsapp: {
    /**
     * Número en formato internacional, SOLO dígitos y sin "+".
     * Ejemplo de formato (Argentina): '5491122334455'.
     *
     * Mientras esté en null, los botones de consulta siguen funcionando pero
     * abren un panel que muestra el mensaje listo para copiar, en lugar de un
     * enlace roto o inventado.
     */
    number: null as string | null,
    /** Texto que se antepone a todos los mensajes generados. */
    greeting: 'Hola, Tecnocell.',
  },

  /* --- Contacto: se muestra sólo lo que esté cargado ---------------------- */
  contact: {
    email: null as string | null,
    phone: null as string | null,
    /** Dirección del local. null = no se muestra la sección de dirección. */
    address: null as string | null,
    /** Localidad / ciudad, para mostrar junto a la dirección. */
    city: null as string | null,
    /** Enlace a Google Maps del local. */
    mapUrl: null as string | null,
  },

  /** Horarios de atención. Array vacío = no se muestra el bloque. */
  openingHours: [] as OpeningHours[],

  /** Redes sociales. Array vacío = no se muestra el bloque. */
  social: [] as SocialLink[],

  /* --- Catálogo ----------------------------------------------------------- */
  catalog: {
    /**
     * 'demo'  → el catálogo actual es de demostración: la web lo aclara en
     *           todas las pantallas y marca los precios como referencia.
     * 'real'  → los datos de src/data/catalog.ts están confirmados por el
     *           negocio y se muestran sin advertencias.
     */
    source: 'demo' as 'demo' | 'real',
    currency: 'ARS',
    locale: 'es-AR',
    /**
     * Mostrar precios en las tarjetas y fichas. Poner en false si se prefiere
     * trabajar sólo con "consultar precio".
     */
    showPrices: true,
  },

  /* --- Portada ------------------------------------------------------------ */
  home: {
    /**
     * Foto del banner principal: archivo dentro de public/productos/,
     * ej. '/productos/portada.jpg'. Conviene una foto de producto propia o del
     * fabricante, apaisada y con fondo claro. Sin foto, se muestra un marcador.
     */
    heroPhoto: null as string | null,
  },

  /* --- Preguntas frecuentes ---------------------------------------------- *
   * Respuestas neutras y verificables. Reemplazar por las políticas reales
   * del negocio antes de publicar (garantía, pagos, envíos).                */
  faq: [
    {
      q: '¿Los equipos publicados están en stock?',
      a: 'El catálogo se actualiza de forma manual. Antes de cerrar una compra confirmamos por WhatsApp el stock del modelo, la capacidad y el color que elegiste.',
    },
    {
      q: '¿Qué medios de pago aceptan?',
      a: 'Los medios de pago y las opciones de financiación se confirman en la consulta, porque pueden variar según el equipo y el momento.',
    },
    {
      q: '¿Hacen envíos?',
      a: 'Coordinamos la entrega por WhatsApp según tu ubicación. Contanos dónde estás y te indicamos las opciones disponibles.',
    },
    {
      q: '¿Los equipos tienen garantía?',
      a: 'Cada equipo se entrega con el comprobante correspondiente. Las condiciones y el plazo de garantía te los detallamos por escrito antes de la compra.',
    },
    {
      q: '¿Me ayudan a elegir un modelo?',
      a: 'Sí. Contanos para qué lo vas a usar y cuánto querés gastar, y te proponemos dos o tres opciones concretas del catálogo.',
    },
  ],
} as const;

export type Site = typeof site;

/** true cuando el catálogo cargado es de demostración. */
export const isDemoCatalog = site.catalog.source === 'demo';

/** true cuando hay un número de WhatsApp real configurado. */
export const hasWhatsApp =
  typeof site.whatsapp.number === 'string' && /^\d{8,15}$/.test(site.whatsapp.number);
