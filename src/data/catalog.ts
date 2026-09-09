/* ---------------------------------------------------------------------------
 * CATÁLOGO — Tecnocell
 * ---------------------------------------------------------------------------
 * CATÁLOGO DE DEMOSTRACIÓN
 * Los productos, precios y estados de stock de este archivo son de ejemplo y
 * sirven para que la web se pueda ver y probar completa. Antes de publicar:
 *   1. Reemplazar estos productos por el catálogo real.
 *   2. Poner `site.catalog.source = 'real'` en src/config/site.ts para que la
 *      web deje de mostrar los avisos de "datos de demostración".
 *
 * Cada producto es un objeto plano: se puede editar a mano o generar desde una
 * planilla / API sin tocar los componentes.
 * ------------------------------------------------------------------------- */

import type { StockState } from '../config/site';

export type CategoryId = 'smartphones' | 'auriculares' | 'cargadores' | 'accesorios';

export type DeviceKind =
  | 'phone'
  | 'buds'
  | 'headphones'
  | 'charger'
  | 'cable'
  | 'powerbank'
  | 'case';

export interface Variant {
  /** Capacidad de almacenamiento, ej. '128 GB'. Omitir si no aplica. */
  storage?: string;
  /** Nombre comercial del color. */
  color: string;
  /** Color aproximado, sólo para el círculo del selector de color. */
  hex: string;
  /** Foto de este color, ej. '/productos/apple-iphone-15-azul.jpg'. */
  photo?: string;
  /** Precio en la moneda de site.catalog.currency. null = a consultar. */
  price: number | null;
  stock: StockState;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  brand: string;
  model: string;
  category: CategoryId;
  device: DeviceKind;
  /** Frase corta de una línea para las tarjetas. */
  tagline: string;
  /** Descripción orientada a la decisión de compra. */
  description: string;
  highlights: string[];
  specs: Spec[];
  variants: Variant[];
  featured?: boolean;
  /**
   * Foto principal del producto: archivo dentro de public/productos/,
   * ej. '/productos/apple-iphone-15.jpg'. Ver public/productos/README.md.
   * Sin foto cargada, la web muestra un marcador neutro.
   */
  photo?: string;
  /** Fotos adicionales para la galería de la ficha. */
  photos?: string[];
}

export const categories: { id: CategoryId; label: string; blurb: string }[] = [
  { id: 'smartphones', label: 'Smartphones', blurb: 'Gama de entrada, media y alta' },
  { id: 'auriculares', label: 'Auriculares', blurb: 'In-ear, true wireless y vincha' },
  { id: 'cargadores', label: 'Cargadores', blurb: 'Fuentes, cables y carga rápida' },
  { id: 'accesorios', label: 'Accesorios', blurb: 'Fundas, vidrios y baterías' },
];

export const products: Product[] = [
  {
    slug: 'apple-iphone-15',
    brand: 'Apple',
    model: 'iPhone 15',
    category: 'smartphones',
    device: 'phone',
    featured: true,
    tagline: 'El iPhone equilibrado: cámara de 48 MP y USB-C.',
    description:
      'Es el iPhone que recomendamos si querés la experiencia completa sin pagar la gama Pro. Suma USB-C, Dynamic Island y una cámara principal de 48 MP que permite un zoom 2x sin perder detalle. Buena opción si venís de un iPhone 11 o anterior.',
    highlights: ['Cámara principal de 48 MP', 'USB-C', 'Dynamic Island', 'Chip A16 Bionic'],
    specs: [
      { label: 'Pantalla', value: '6,1" OLED Super Retina XDR, 60 Hz' },
      { label: 'Procesador', value: 'Apple A16 Bionic' },
      { label: 'Cámara principal', value: '48 MP + ultra gran angular 12 MP' },
      { label: 'Cámara frontal', value: '12 MP TrueDepth' },
      { label: 'Batería', value: 'Hasta 20 h de video (dato de Apple)' },
      { label: 'Carga', value: 'USB-C, carga rápida y MagSafe' },
      { label: 'Resistencia', value: 'IP68' },
      { label: 'SIM', value: 'Nano SIM + eSIM' },
    ],
    variants: [
      { storage: '128 GB', color: 'Negro', hex: '#2B2B2E', price: 1399000, stock: 'disponible' },
      { storage: '128 GB', color: 'Azul', hex: '#C6D4D8', price: 1399000, stock: 'disponible' },
      { storage: '128 GB', color: 'Rosa', hex: '#EFD1D4', price: 1399000, stock: 'a-pedido' },
      { storage: '256 GB', color: 'Negro', hex: '#2B2B2E', price: 1549000, stock: 'disponible' },
      { storage: '256 GB', color: 'Azul', hex: '#C6D4D8', price: 1549000, stock: 'a-pedido' },
    ],
  },
  {
    slug: 'apple-iphone-15-pro-max',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    category: 'smartphones',
    device: 'phone',
    featured: true,
    tagline: 'Titanio, teleobjetivo 5x y pantalla de 6,7".',
    description:
      'El tope de línea de Apple. Se justifica sobre todo por el teleobjetivo de 5x y por la pantalla grande a 120 Hz: si sacás muchas fotos a distancia o editás video en el teléfono, es el salto real frente al iPhone 15.',
    highlights: ['Teleobjetivo 5x', 'Pantalla 120 Hz', 'Cuerpo de titanio', 'Chip A17 Pro'],
    specs: [
      { label: 'Pantalla', value: '6,7" OLED, ProMotion 120 Hz' },
      { label: 'Procesador', value: 'Apple A17 Pro' },
      { label: 'Cámaras', value: '48 MP principal + 12 MP ultra gran angular + 12 MP tele 5x' },
      { label: 'Cámara frontal', value: '12 MP TrueDepth' },
      { label: 'Batería', value: 'Hasta 29 h de video (dato de Apple)' },
      { label: 'Carga', value: 'USB-C 3.0, MagSafe' },
      { label: 'Materiales', value: 'Marco de titanio grado 5' },
      { label: 'Resistencia', value: 'IP68' },
    ],
    variants: [
      { storage: '256 GB', color: 'Titanio natural', hex: '#BEB8AF', price: 2399000, stock: 'disponible' },
      { storage: '256 GB', color: 'Titanio negro', hex: '#3B3B3E', price: 2399000, stock: 'disponible' },
      { storage: '512 GB', color: 'Titanio natural', hex: '#BEB8AF', price: 2699000, stock: 'a-pedido' },
      { storage: '512 GB', color: 'Titanio azul', hex: '#59606C', price: 2699000, stock: 'a-pedido' },
    ],
  },
  {
    slug: 'samsung-galaxy-s24',
    brand: 'Samsung',
    model: 'Galaxy S24',
    category: 'smartphones',
    device: 'phone',
    featured: true,
    tagline: 'Gama alta compacta con pantalla muy brillante.',
    description:
      'Un tope de gama que entra cómodo en el bolsillo. La pantalla de 2600 nits se lee bien al sol y Samsung sostiene siete años de actualizaciones, así que es una compra pensada para durar.',
    highlights: ['Pantalla 120 Hz de 2600 nits', '7 años de actualizaciones', 'Zoom óptico 3x'],
    specs: [
      { label: 'Pantalla', value: '6,2" AMOLED 2X, 120 Hz, 2600 nits' },
      { label: 'Procesador', value: 'Exynos 2400 o Snapdragon 8 Gen 3, según mercado' },
      { label: 'Memoria', value: '8 GB RAM' },
      { label: 'Cámaras', value: '50 MP principal + 12 MP ultra gran angular + 10 MP tele 3x' },
      { label: 'Batería', value: '4000 mAh' },
      { label: 'Carga', value: '25 W por cable, 15 W inalámbrica' },
      { label: 'Resistencia', value: 'IP68' },
      { label: 'SIM', value: 'Nano SIM + eSIM' },
    ],
    variants: [
      { storage: '128 GB', color: 'Ónix', hex: '#2A2C2E', price: 1199000, stock: 'disponible' },
      { storage: '256 GB', color: 'Ónix', hex: '#2A2C2E', price: 1319000, stock: 'disponible' },
      { storage: '256 GB', color: 'Violeta', hex: '#B5A6C7', price: 1319000, stock: 'a-pedido' },
      { storage: '256 GB', color: 'Amarillo', hex: '#E0CE88', price: 1319000, stock: 'sin-stock' },
    ],
  },
  {
    slug: 'samsung-galaxy-a55-5g',
    brand: 'Samsung',
    model: 'Galaxy A55 5G',
    category: 'smartphones',
    device: 'phone',
    featured: true,
    tagline: 'La gama media más pedida, ahora con marco de metal.',
    description:
      'El punto dulce de Samsung: pantalla grande a 120 Hz, batería de 5000 mAh y cuatro años de actualizaciones. Es el equipo que sugerimos cuando el presupuesto es intermedio y se busca algo que aguante.',
    highlights: ['Batería 5000 mAh', 'Pantalla 120 Hz', 'Marco de aluminio', 'Resistencia IP67'],
    specs: [
      { label: 'Pantalla', value: '6,6" Super AMOLED, 120 Hz' },
      { label: 'Procesador', value: 'Exynos 1480' },
      { label: 'Memoria', value: '8 GB RAM' },
      { label: 'Cámaras', value: '50 MP principal + 12 MP ultra gran angular + 5 MP macro' },
      { label: 'Batería', value: '5000 mAh' },
      { label: 'Carga', value: '25 W (no incluye cargador)' },
      { label: 'Resistencia', value: 'IP67' },
      { label: 'Extras', value: 'Ranura microSD y lector de huella en pantalla' },
    ],
    variants: [
      { storage: '128 GB', color: 'Azul marino', hex: '#2F3B55', price: 749000, stock: 'disponible' },
      { storage: '256 GB', color: 'Azul marino', hex: '#2F3B55', price: 819000, stock: 'disponible' },
      { storage: '256 GB', color: 'Lila', hex: '#C4B9D6', price: 819000, stock: 'disponible' },
    ],
  },
  {
    slug: 'samsung-galaxy-a15',
    brand: 'Samsung',
    model: 'Galaxy A15',
    category: 'smartphones',
    device: 'phone',
    tagline: 'Entrada de gama con pantalla AMOLED.',
    description:
      'Para quien necesita un teléfono confiable para mensajería, redes y fotos ocasionales. Sorprende por la pantalla AMOLED, poco habitual en este precio, y por la batería de 5000 mAh que llega bien al final del día.',
    highlights: ['Pantalla AMOLED 90 Hz', 'Batería 5000 mAh', 'Ranura microSD'],
    specs: [
      { label: 'Pantalla', value: '6,5" Super AMOLED, 90 Hz' },
      { label: 'Procesador', value: 'MediaTek Helio G99' },
      { label: 'Memoria', value: '4 GB RAM' },
      { label: 'Cámaras', value: '50 MP principal + 5 MP ultra gran angular + 2 MP macro' },
      { label: 'Batería', value: '5000 mAh' },
      { label: 'Carga', value: '25 W' },
      { label: 'Extras', value: 'Doble SIM y ranura microSD' },
    ],
    variants: [
      { storage: '128 GB', color: 'Azul negro', hex: '#232B36', price: 349000, stock: 'disponible' },
      { storage: '128 GB', color: 'Celeste', hex: '#A5C0D3', price: 349000, stock: 'a-pedido' },
    ],
  },
  {
    slug: 'xiaomi-14',
    brand: 'Xiaomi',
    model: 'Xiaomi 14',
    category: 'smartphones',
    device: 'phone',
    featured: true,
    tagline: 'Cámaras Leica en un cuerpo compacto.',
    description:
      'Gama alta con óptica desarrollada junto a Leica y carga de 90 W, que lo deja listo en poco más de media hora. Buena elección si te importa la fotografía y no querés un teléfono enorme.',
    highlights: ['Óptica Leica', 'Carga de 90 W', 'Snapdragon 8 Gen 3', 'Pantalla 3000 nits'],
    specs: [
      { label: 'Pantalla', value: '6,36" LTPO AMOLED, 120 Hz, 3000 nits' },
      { label: 'Procesador', value: 'Snapdragon 8 Gen 3' },
      { label: 'Memoria', value: '12 GB RAM' },
      { label: 'Cámaras', value: 'Triple 50 MP Leica: principal, tele 3,2x y ultra gran angular' },
      { label: 'Batería', value: '4610 mAh' },
      { label: 'Carga', value: '90 W por cable, 50 W inalámbrica' },
      { label: 'Resistencia', value: 'IP68' },
    ],
    variants: [
      { storage: '256 GB', color: 'Negro', hex: '#1F2124', price: 1249000, stock: 'disponible' },
      { storage: '512 GB', color: 'Negro', hex: '#1F2124', price: 1389000, stock: 'a-pedido' },
      { storage: '512 GB', color: 'Verde jade', hex: '#4C6A56', price: 1389000, stock: 'a-pedido' },
    ],
  },
  {
    slug: 'xiaomi-redmi-note-13-pro',
    brand: 'Xiaomi',
    model: 'Redmi Note 13 Pro',
    category: 'smartphones',
    device: 'phone',
    featured: true,
    tagline: 'Cámara de 200 MP a precio de gama media.',
    description:
      'El clásico "mucho por poco" de Xiaomi: pantalla de 1,5K a 120 Hz, carga de 67 W y una cámara principal de 200 MP con estabilización. Es la consulta más frecuente del catálogo.',
    highlights: ['Cámara de 200 MP', 'Carga 67 W', 'Pantalla 1,5K 120 Hz', 'Batería 5100 mAh'],
    specs: [
      { label: 'Pantalla', value: '6,67" AMOLED 1,5K, 120 Hz' },
      { label: 'Procesador', value: 'Snapdragon 7s Gen 2' },
      { label: 'Memoria', value: '8 GB RAM' },
      { label: 'Cámaras', value: '200 MP con OIS + 8 MP ultra gran angular + 2 MP macro' },
      { label: 'Batería', value: '5100 mAh' },
      { label: 'Carga', value: '67 W, cargador incluido' },
      { label: 'Resistencia', value: 'IP54' },
    ],
    variants: [
      { storage: '128 GB', color: 'Negro medianoche', hex: '#22242A', price: 529000, stock: 'disponible' },
      { storage: '256 GB', color: 'Negro medianoche', hex: '#22242A', price: 589000, stock: 'disponible' },
      { storage: '256 GB', color: 'Azul océano', hex: '#37587F', price: 589000, stock: 'disponible' },
      { storage: '256 GB', color: 'Violeta', hex: '#8B78AC', price: 589000, stock: 'a-pedido' },
    ],
  },
  {
    slug: 'xiaomi-redmi-13c',
    brand: 'Xiaomi',
    model: 'Redmi 13C',
    category: 'smartphones',
    device: 'phone',
    tagline: 'El más accesible del catálogo.',
    description:
      'Un equipo básico para llamadas, mensajería y redes. Pantalla grande de 90 Hz y batería de 5000 mAh. Sirve muy bien como segundo teléfono o como primer smartphone.',
    highlights: ['Batería 5000 mAh', 'Pantalla 6,74" 90 Hz', 'Doble SIM + microSD'],
    specs: [
      { label: 'Pantalla', value: '6,74" LCD, 90 Hz' },
      { label: 'Procesador', value: 'MediaTek Helio G85' },
      { label: 'Memoria', value: '4 GB RAM' },
      { label: 'Cámaras', value: '50 MP principal + 2 MP macro' },
      { label: 'Batería', value: '5000 mAh' },
      { label: 'Carga', value: '18 W' },
      { label: 'Extras', value: 'Jack de 3,5 mm y ranura microSD' },
    ],
    variants: [
      { storage: '128 GB', color: 'Negro medianoche', hex: '#25272B', price: 259000, stock: 'disponible' },
      { storage: '128 GB', color: 'Verde menta', hex: '#9AC0A5', price: 259000, stock: 'disponible' },
    ],
  },
  {
    slug: 'motorola-moto-g84-5g',
    brand: 'Motorola',
    model: 'Moto G84 5G',
    category: 'smartphones',
    device: 'phone',
    tagline: 'Pantalla pOLED y Android sin capas.',
    description:
      'Motorola apuesta a un Android casi sin agregados, que se siente rápido y ordenado. Suma pantalla pOLED, 256 GB de base y una batería de 5000 mAh. Buena compra si te molesta el software cargado de aplicaciones.',
    highlights: ['256 GB de base', 'Pantalla pOLED 120 Hz', 'Android casi puro', 'Batería 5000 mAh'],
    specs: [
      { label: 'Pantalla', value: '6,5" pOLED FHD+, 120 Hz' },
      { label: 'Procesador', value: 'Snapdragon 695 5G' },
      { label: 'Memoria', value: '8 GB RAM' },
      { label: 'Cámaras', value: '50 MP con OIS + 8 MP ultra gran angular' },
      { label: 'Batería', value: '5000 mAh' },
      { label: 'Carga', value: '30 W TurboPower' },
      { label: 'Resistencia', value: 'IP54' },
    ],
    variants: [
      { storage: '256 GB', color: 'Azul índigo', hex: '#38507E', price: 469000, stock: 'disponible' },
      { storage: '256 GB', color: 'Magenta', hex: '#98406A', price: 469000, stock: 'a-pedido' },
    ],
  },
  {
    slug: 'motorola-edge-50-fusion',
    brand: 'Motorola',
    model: 'Edge 50 Fusion',
    category: 'smartphones',
    device: 'phone',
    featured: true,
    tagline: 'Pantalla curva de 144 Hz y acabado textil.',
    description:
      'El más lindo de tener en la mano dentro de la gama media: acabado de tela vegana y pantalla curva muy fluida. Rinde bien en fotos con buena luz y la carga de 68 W es rápida de verdad.',
    highlights: ['Pantalla curva 144 Hz', 'Carga 68 W', 'Acabado textil', 'IP68'],
    specs: [
      { label: 'Pantalla', value: '6,7" pOLED curva, 144 Hz' },
      { label: 'Procesador', value: 'Snapdragon 7s Gen 2' },
      { label: 'Memoria', value: '8 GB RAM' },
      { label: 'Cámaras', value: '50 MP con OIS + 13 MP ultra gran angular' },
      { label: 'Batería', value: '5000 mAh' },
      { label: 'Carga', value: '68 W TurboPower' },
      { label: 'Resistencia', value: 'IP68' },
    ],
    variants: [
      { storage: '256 GB', color: 'Gris marengo', hex: '#4A4E55', price: 649000, stock: 'disponible' },
      { storage: '256 GB', color: 'Verde salvia', hex: '#7C8F77', price: 649000, stock: 'disponible' },
    ],
  },
  {
    slug: 'google-pixel-8a',
    brand: 'Google',
    model: 'Pixel 8a',
    category: 'smartphones',
    device: 'phone',
    featured: true,
    tagline: 'La mejor cámara por lo que sale.',
    description:
      'Google resuelve la fotografía por software: sale muy bien de noche y en retratos sin que tengas que tocar nada. Además tiene siete años de actualizaciones garantizadas, algo raro en este segmento.',
    highlights: ['Procesado fotográfico de Google', '7 años de actualizaciones', 'Pantalla 120 Hz', 'IP67'],
    specs: [
      { label: 'Pantalla', value: '6,1" OLED Actua, 120 Hz' },
      { label: 'Procesador', value: 'Google Tensor G3' },
      { label: 'Memoria', value: '8 GB RAM' },
      { label: 'Cámaras', value: '64 MP con OIS + 13 MP ultra gran angular' },
      { label: 'Batería', value: '4492 mAh' },
      { label: 'Carga', value: '18 W por cable, 7,5 W inalámbrica' },
      { label: 'Resistencia', value: 'IP67' },
    ],
    variants: [
      { storage: '128 GB', color: 'Obsidiana', hex: '#2C2E30', price: 899000, stock: 'disponible' },
      { storage: '128 GB', color: 'Porcelana', hex: '#E2DDD4', price: 899000, stock: 'a-pedido' },
      { storage: '256 GB', color: 'Obsidiana', hex: '#2C2E30', price: 999000, stock: 'a-pedido' },
    ],
  },

  /* --- Auriculares -------------------------------------------------------- */
  {
    slug: 'apple-airpods-3',
    brand: 'Apple',
    model: 'AirPods (3.ª generación)',
    category: 'auriculares',
    device: 'buds',
    tagline: 'Audio espacial y ajuste abierto.',
    description:
      'Los AirPods de ajuste abierto, sin goma dentro del oído. Cómodos para usar muchas horas y con emparejamiento inmediato en iPhone, iPad y Mac.',
    highlights: ['Audio espacial', 'Resistencia IPX4', 'Estuche con carga MagSafe'],
    specs: [
      { label: 'Tipo', value: 'True wireless de ajuste abierto' },
      { label: 'Autonomía', value: 'Hasta 6 h; 30 h con el estuche' },
      { label: 'Carga', value: 'Lightning o MagSafe' },
      { label: 'Resistencia', value: 'IPX4 en auriculares y estuche' },
      { label: 'Controles', value: 'Sensor de presión en el vástago' },
    ],
    variants: [{ color: 'Blanco', hex: '#F2F2F0', price: 329000, stock: 'disponible' }],
  },
  {
    slug: 'samsung-galaxy-buds-fe',
    brand: 'Samsung',
    model: 'Galaxy Buds FE',
    category: 'auriculares',
    device: 'buds',
    tagline: 'Cancelación de ruido a buen precio.',
    description:
      'Cancelación activa de ruido con aleta de sujeción, así que no se caen al moverse. Funcionan con cualquier teléfono Android o iPhone por Bluetooth.',
    highlights: ['Cancelación activa de ruido', 'Modo sonido ambiente', 'Aleta de sujeción'],
    specs: [
      { label: 'Tipo', value: 'True wireless in-ear' },
      { label: 'Autonomía', value: 'Hasta 6 h con ANC; 21 h con el estuche' },
      { label: 'Carga', value: 'USB-C' },
      { label: 'Resistencia', value: 'IPX2' },
      { label: 'Conexión', value: 'Bluetooth 5.2' },
    ],
    variants: [
      { color: 'Grafito', hex: '#33363B', price: 189000, stock: 'disponible' },
      { color: 'Blanco', hex: '#EDEDEA', price: 189000, stock: 'a-pedido' },
    ],
  },
  {
    slug: 'jbl-tune-520bt',
    brand: 'JBL',
    model: 'Tune 520BT',
    category: 'auriculares',
    device: 'headphones',
    tagline: 'Vincha inalámbrica con 57 h de batería.',
    description:
      'Auriculares de vincha, plegables y livianos, con una autonomía muy alta. Buena opción para viajes largos o para trabajar con llamadas todo el día.',
    highlights: ['Hasta 57 h de batería', 'Plegables', 'Carga rápida USB-C'],
    specs: [
      { label: 'Tipo', value: 'Vincha supraaural' },
      { label: 'Autonomía', value: 'Hasta 57 h' },
      { label: 'Carga', value: 'USB-C; 5 minutos dan 3 h de uso' },
      { label: 'Conexión', value: 'Bluetooth 5.3 con multipunto' },
      { label: 'Peso', value: '160 g' },
    ],
    variants: [
      { color: 'Negro', hex: '#242628', price: 99000, stock: 'disponible' },
      { color: 'Azul', hex: '#2E4E86', price: 99000, stock: 'disponible' },
    ],
  },

  /* --- Cargadores --------------------------------------------------------- */
  {
    slug: 'anker-323-33w',
    brand: 'Anker',
    model: '323 Cargador 33 W',
    category: 'cargadores',
    device: 'charger',
    tagline: 'Dos puertos para cargar teléfono y auriculares a la vez.',
    description:
      'Fuente compacta con un puerto USB-C y uno USB-A. Entrega 33 W en total, suficiente para la carga rápida de la mayoría de los teléfonos Android.',
    highlights: ['USB-C + USB-A', '33 W totales', 'Protección contra sobrecarga'],
    specs: [
      { label: 'Potencia', value: '33 W totales, 30 W máx. en USB-C' },
      { label: 'Puertos', value: '1× USB-C, 1× USB-A' },
      { label: 'Protocolos', value: 'Power Delivery y Quick Charge' },
      { label: 'Ficha', value: 'Enchufe plano' },
    ],
    variants: [
      { color: 'Blanco', hex: '#F0F0EE', price: 42000, stock: 'disponible' },
      { color: 'Negro', hex: '#2A2C2F', price: 42000, stock: 'a-pedido' },
    ],
  },
  {
    slug: 'apple-adaptador-20w',
    brand: 'Apple',
    model: 'Adaptador USB-C de 20 W',
    category: 'cargadores',
    device: 'charger',
    tagline: 'El cargador original para iPhone y iPad.',
    description:
      'El adaptador oficial de Apple, el mismo que se necesita para la carga rápida del iPhone. Tené en cuenta que el iPhone no incluye cargador en la caja.',
    highlights: ['20 W', 'Compatible con iPhone y iPad', 'Producto original'],
    specs: [
      { label: 'Potencia', value: '20 W' },
      { label: 'Puertos', value: '1× USB-C' },
      { label: 'Protocolo', value: 'USB Power Delivery' },
      { label: 'Cable', value: 'No incluye cable' },
    ],
    variants: [{ color: 'Blanco', hex: '#F4F4F2', price: 39000, stock: 'disponible' }],
  },
  {
    slug: 'baseus-cable-usb-c-100w',
    brand: 'Baseus',
    model: 'Cable USB-C a USB-C 100 W',
    category: 'cargadores',
    device: 'cable',
    tagline: 'Cable reforzado de 1 metro para carga rápida.',
    description:
      'Cable trenzado que soporta hasta 100 W, así que sirve tanto para el teléfono como para una notebook USB-C. La malla externa evita que se pele en la zona de la ficha.',
    highlights: ['Hasta 100 W', 'Malla trenzada', 'Transferencia de 480 Mb/s'],
    specs: [
      { label: 'Largo', value: '1 m' },
      { label: 'Potencia máxima', value: '100 W (20 V / 5 A)' },
      { label: 'Conectores', value: 'USB-C a USB-C' },
      { label: 'Datos', value: 'USB 2.0, 480 Mb/s' },
    ],
    variants: [
      { color: 'Negro', hex: '#2C2E31', price: 18000, stock: 'disponible' },
      { color: 'Azul', hex: '#33538A', price: 18000, stock: 'disponible' },
    ],
  },

  /* --- Accesorios --------------------------------------------------------- */
  {
    slug: 'anker-powercore-20000',
    brand: 'Anker',
    model: 'PowerCore 20.000 mAh',
    category: 'accesorios',
    device: 'powerbank',
    tagline: 'Tres o cuatro cargas completas fuera de casa.',
    description:
      'Batería portátil de alta capacidad con carga rápida de 22,5 W. Pensada para viajes o jornadas largas; carga un teléfono típico entre tres y cuatro veces.',
    highlights: ['20.000 mAh', 'Carga rápida 22,5 W', 'Tres salidas simultáneas'],
    specs: [
      { label: 'Capacidad', value: '20.000 mAh' },
      { label: 'Salida máxima', value: '22,5 W' },
      { label: 'Puertos', value: '2× USB-A, 1× USB-C de entrada y salida' },
      { label: 'Indicador', value: 'LED de nivel de carga' },
    ],
    variants: [{ color: 'Negro', hex: '#26282B', price: 89000, stock: 'disponible' }],
  },
  {
    slug: 'spigen-liquid-air',
    brand: 'Spigen',
    model: 'Funda Liquid Air',
    category: 'accesorios',
    device: 'case',
    tagline: 'Funda delgada con buen agarre y bordes elevados.',
    description:
      'Funda de TPU con textura geométrica que no resbala. Los bordes elevados protegen la pantalla y el módulo de cámara al apoyar el teléfono. Se pide indicando el modelo exacto.',
    highlights: ['Bordes elevados', 'Textura antideslizante', 'Compatible con carga inalámbrica'],
    specs: [
      { label: 'Material', value: 'TPU flexible' },
      { label: 'Protección', value: 'Bordes elevados en pantalla y cámara' },
      { label: 'Carga inalámbrica', value: 'Compatible' },
      { label: 'Compatibilidad', value: 'Se fabrica por modelo: indicá el tuyo al consultar' },
    ],
    variants: [
      { color: 'Negro mate', hex: '#26282A', price: 26000, stock: 'disponible' },
      { color: 'Transparente', hex: '#D6DAE0', price: 26000, stock: 'disponible' },
    ],
  },
  {
    slug: 'spigen-vidrio-templado',
    brand: 'Spigen',
    model: 'Vidrio templado Glas.tR',
    category: 'accesorios',
    device: 'case',
    tagline: 'Protección de pantalla con marco de colocación.',
    description:
      'Vidrio templado de dureza 9H con kit de alineación, así que queda derecho y sin burbujas. Lo colocamos al momento de la entrega si el equipo se compra con nosotros.',
    highlights: ['Dureza 9H', 'Kit de alineación incluido', 'Colocación sin burbujas'],
    specs: [
      { label: 'Dureza', value: '9H' },
      { label: 'Espesor', value: '0,33 mm' },
      { label: 'Incluye', value: 'Marco de alineación y kit de limpieza' },
      { label: 'Compatibilidad', value: 'Se fabrica por modelo: indicá el tuyo al consultar' },
    ],
    variants: [{ color: 'Transparente', hex: '#DCE1E8', price: 14000, stock: 'disponible' }],
  },
];

/** Marcas presentes en el catálogo, ordenadas por cantidad de productos. */
export const brands: string[] = Array.from(new Set(products.map((p) => p.brand))).sort((a, b) => {
  const count = (brand: string) => products.filter((p) => p.brand === brand).length;
  return count(b) - count(a) || a.localeCompare(b, 'es');
});
