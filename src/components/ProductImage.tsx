import { useId } from 'react';
import type { DeviceKind, Product } from '../data/catalog';

/* ---------------------------------------------------------------------------
 * Ilustración de producto
 * ---------------------------------------------------------------------------
 * El catálogo de demostración no incluye fotografías reales de producto, así
 * que cada equipo se dibuja como SVG a partir de su tipo (`device`) y del color
 * de la variante elegida. Ventajas: pesa poco, no se deforma nunca, se adapta
 * al color seleccionado y no hay imágenes rotas.
 *
 * Para usar fotos reales: reemplazar este componente por un <img> con
 * `loading="lazy"`, `width`/`height` y la misma relación de aspecto 4:5.
 * ------------------------------------------------------------------------- */

export type View = 'frente' | 'dorso' | 'angulo';

export const viewLabels: Record<View, string> = {
  frente: 'Frente',
  dorso: 'Dorso',
  angulo: 'Ángulo',
};

/** Vistas disponibles según el tipo de producto. */
export function viewsFor(device: DeviceKind): View[] {
  return device === 'phone' ? ['frente', 'dorso', 'angulo'] : ['frente', 'angulo'];
}

function clamp(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function parseHex(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** amount > 0 aclara, amount < 0 oscurece. */
function shade(hex: string, amount: number): string {
  const [r, g, b] = parseHex(hex);
  const target = amount > 0 ? 255 : 0;
  const t = Math.abs(amount);
  const mix = (c: number) => clamp(c + (target - c) * t);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

/** Cantidad de lentes que se dibujan en el dorso, leída de las specs. */
function lensCount(product: Product): number {
  const spec = product.specs.find((s) => s.label.toLowerCase().startsWith('cámara'));
  const matches = spec ? spec.value.match(/MP/g) : null;
  return Math.max(2, Math.min(3, matches ? matches.length : 2));
}

interface Props {
  product: Product;
  color: string;
  view?: View;
  /** Título accesible; si se omite se arma con marca y modelo. */
  alt?: string;
  className?: string;
}

export function ProductImage({ product, color, view = 'frente', alt, className }: Props) {
  const uid = useId().replace(/:/g, '');
  const label = alt ?? `${product.brand} ${product.model}, color ${color}`;

  const body = `bo${uid}`;
  const screen = `sc${uid}`;
  const glow = `gl${uid}`;
  const soft = `sf${uid}`;

  const light = shade(color, 0.28);
  const dark = shade(color, -0.35);
  const edge = shade(color, 0.55);

  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{label}</title>
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="45%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id={screen} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#171B26" />
          <stop offset="55%" stopColor="#0C0F17" />
          <stop offset="100%" stopColor="#141A2B" />
        </linearGradient>
        <radialGradient id={glow} cx="0.5" cy="0.42" r="0.6">
          <stop offset="0%" stopColor="#2E6BFF" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#1A56E8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#1A56E8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={soft} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Luz de estudio detrás del equipo */}
      <ellipse cx="200" cy="210" rx="150" ry="170" fill={`url(#${glow})`} />
      {/* Sombra de apoyo */}
      <ellipse cx="200" cy="452" rx="128" ry="26" fill={`url(#${soft})`} />

      <DeviceShape
        product={product}
        view={view}
        bodyFill={`url(#${body})`}
        screenFill={`url(#${screen})`}
        edge={edge}
        dark={dark}
        light={light}
      />
    </svg>
  );
}

interface ShapeProps {
  product: Product;
  view: View;
  bodyFill: string;
  screenFill: string;
  edge: string;
  dark: string;
  light: string;
}

function DeviceShape({ product, view, bodyFill, screenFill, edge, dark, light }: ShapeProps) {
  const stroke = { stroke: edge, strokeOpacity: 0.85, strokeWidth: 1.8 };

  switch (product.device) {
    case 'phone': {
      const lenses = lensCount(product);
      const isApple = product.brand === 'Apple';

      const front = (
        <g>
          <rect x="118" y="52" width="164" height="352" rx="30" fill={bodyFill} {...stroke} />
          <rect x="125" y="59" width="150" height="338" rx="24" fill={screenFill} />
          <rect x="125" y="59" width="150" height="338" rx="24" fill="#6EA2FF" fillOpacity="0.06" />
          {isApple ? (
            <rect x="177" y="70" width="46" height="13" rx="6.5" fill="#0A0B0F" />
          ) : (
            <circle cx="200" cy="77" r="6" fill="#0A0B0F" />
          )}
          <rect x="176" y="384" width="48" height="4" rx="2" fill="#FFFFFF" fillOpacity="0.35" />
          <rect x="282" y="140" width="3" height="44" rx="1.5" fill={dark} />
          <rect x="115" y="128" width="3" height="28" rx="1.5" fill={dark} />
        </g>
      );

      const back = (
        <g>
          <rect x="118" y="52" width="164" height="352" rx="30" fill={bodyFill} {...stroke} />
          <rect
            x="136"
            y="70"
            width={lenses === 3 ? 84 : 66}
            height={lenses === 3 ? 84 : 66}
            rx="20"
            fill={dark}
            fillOpacity="0.85"
          />
          <circle cx="160" cy="94" r="14" fill="#0C0E13" stroke={light} strokeOpacity="0.35" />
          <circle cx="160" cy="94" r="6" fill="#1E2740" />
          <circle cx={lenses === 3 ? 196 : 190} cy="94" r="14" fill="#0C0E13" stroke={light} strokeOpacity="0.35" />
          <circle cx={lenses === 3 ? 196 : 190} cy="94" r="6" fill="#1E2740" />
          {lenses === 3 && (
            <>
              <circle cx="160" cy="128" r="14" fill="#0C0E13" stroke={light} strokeOpacity="0.35" />
              <circle cx="160" cy="128" r="6" fill="#1E2740" />
              <circle cx="196" cy="128" r="7" fill="#141821" />
            </>
          )}
          <rect x="176" y="360" width="48" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.12" />
        </g>
      );

      const angle = (
        <g>
          <g transform="rotate(-9 200 228) translate(-46 10)" opacity="0.92">
            <rect x="118" y="52" width="150" height="330" rx="28" fill={bodyFill} {...stroke} />
            <rect x="136" y="70" width="60" height="60" rx="18" fill={dark} fillOpacity="0.85" />
            <circle cx="157" cy="91" r="12" fill="#0C0E13" />
            <circle cx="185" cy="91" r="12" fill="#0C0E13" />
          </g>
          <g transform="rotate(7 200 228) translate(52 -6)">
            <rect x="118" y="52" width="150" height="330" rx="28" fill={bodyFill} {...stroke} />
            <rect x="125" y="59" width="136" height="316" rx="23" fill={screenFill} />
            <rect x="125" y="59" width="136" height="316" rx="23" fill="#6EA2FF" fillOpacity="0.07" />
            <rect x="170" y="69" width="42" height="12" rx="6" fill="#0A0B0F" />
          </g>
        </g>
      );

      return view === 'dorso' ? back : view === 'angulo' ? angle : front;
    }

    case 'buds': {
      const bud = (x: number, y: number, rotate: number) => (
        <g transform={`rotate(${rotate} ${x} ${y})`}>
          <rect x={x - 22} y={y - 24} width="44" height="48" rx="21" fill={bodyFill} {...stroke} />
          <rect x={x - 9} y={y + 18} width="18" height="58" rx="9" fill={bodyFill} {...stroke} />
          <ellipse cx={x} cy={y - 4} rx="12" ry="13" fill={dark} fillOpacity="0.55" />
        </g>
      );
      const view1 = (
        <g>
          <rect x="132" y="230" width="136" height="118" rx="34" fill={bodyFill} {...stroke} />
          <rect x="132" y="272" width="136" height="3" fill={dark} fillOpacity="0.4" />
          <circle cx="200" cy="330" r="5" fill={dark} fillOpacity="0.6" />
          {bud(158, 150, -12)}
          {bud(244, 150, 12)}
        </g>
      );
      const view2 = (
        <g>
          <rect x="118" y="196" width="164" height="140" rx="42" fill={bodyFill} {...stroke} />
          <path d="M118 262 h164" stroke={dark} strokeOpacity="0.45" strokeWidth="2" />
          <circle cx="200" cy="312" r="6" fill={dark} fillOpacity="0.6" />
          <ellipse cx="160" cy="232" rx="26" ry="20" fill={dark} fillOpacity="0.35" />
          <ellipse cx="240" cy="232" rx="26" ry="20" fill={dark} fillOpacity="0.35" />
        </g>
      );
      return view === 'angulo' ? view2 : view1;
    }

    case 'headphones': {
      const base = (
        <g>
          <path
            d="M112 268 V210 a88 88 0 0 1 176 0 V268"
            fill="none"
            stroke={bodyFill}
            strokeWidth="22"
            strokeLinecap="round"
          />
          <rect x="82" y="252" width="66" height="96" rx="30" fill={bodyFill} {...stroke} />
          <rect x="252" y="252" width="66" height="96" rx="30" fill={bodyFill} {...stroke} />
          <ellipse cx="115" cy="300" rx="20" ry="30" fill={dark} fillOpacity="0.5" />
          <ellipse cx="285" cy="300" rx="20" ry="30" fill={dark} fillOpacity="0.5" />
        </g>
      );
      const angled = (
        <g transform="rotate(-10 200 260)">
          {base}
          <rect x="188" y="140" width="24" height="10" rx="5" fill={light} fillOpacity="0.3" />
        </g>
      );
      return view === 'angulo' ? angled : base;
    }

    case 'charger': {
      const base = (
        <g>
          <rect x="132" y="176" width="136" height="148" rx="26" fill={bodyFill} {...stroke} />
          <rect x="168" y="146" width="12" height="34" rx="3" fill="#9AA3B2" />
          <rect x="220" y="146" width="12" height="34" rx="3" fill="#9AA3B2" />
          <rect x="176" y="292" width="20" height="12" rx="6" fill={dark} fillOpacity="0.8" />
          <rect x="206" y="292" width="24" height="10" rx="3" fill={dark} fillOpacity="0.8" />
          <rect x="160" y="212" width="80" height="3" rx="1.5" fill={dark} fillOpacity="0.4" />
        </g>
      );
      const angled = <g transform="rotate(-12 200 250) scale(1.02) translate(-4 -6)">{base}</g>;
      return view === 'angulo' ? angled : base;
    }

    case 'cable': {
      const base = (
        <g>
          <path
            d="M150 130 C 96 210, 300 246, 250 330 C 224 374, 176 372, 156 348"
            fill="none"
            stroke={bodyFill}
            strokeWidth="16"
            strokeLinecap="round"
          />
          <rect x="138" y="106" width="26" height="42" rx="8" fill={dark} />
          <rect x="143" y="98" width="16" height="12" rx="4" fill="#9AA3B2" />
          <rect x="140" y="336" width="26" height="42" rx="8" fill={dark} transform="rotate(24 153 357)" />
        </g>
      );
      const angled = <g transform="rotate(-14 200 250)">{base}</g>;
      return view === 'angulo' ? angled : base;
    }

    case 'powerbank': {
      const base = (
        <g>
          <rect x="128" y="128" width="144" height="248" rx="24" fill={bodyFill} {...stroke} />
          <rect x="150" y="160" width="100" height="36" rx="10" fill={dark} fillOpacity="0.55" />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={168 + i * 22} cy="178" r="4.5" fill="#6EA2FF" fillOpacity={i < 3 ? 0.9 : 0.25} />
          ))}
          <rect x="156" y="330" width="26" height="12" rx="3" fill={dark} fillOpacity="0.8" />
          <rect x="192" y="330" width="26" height="12" rx="3" fill={dark} fillOpacity="0.8" />
          <rect x="228" y="332" width="18" height="9" rx="4.5" fill={dark} fillOpacity="0.8" />
        </g>
      );
      const angled = <g transform="rotate(-11 200 252) translate(0 -4)">{base}</g>;
      return view === 'angulo' ? angled : base;
    }

    case 'case':
    default: {
      const base = (
        <g>
          <rect x="122" y="56" width="156" height="344" rx="30" fill={bodyFill} {...stroke} />
          <rect x="134" y="68" width="132" height="320" rx="22" fill="#0A0B0F" fillOpacity="0.45" />
          <rect x="146" y="80" width="72" height="72" rx="20" fill="#0A0B0F" fillOpacity="0.7" />
          <rect x="272" y="140" width="8" height="46" rx="4" fill={dark} fillOpacity="0.7" />
        </g>
      );
      const angled = <g transform="rotate(-10 200 228) translate(0 -4)">{base}</g>;
      return view === 'angulo' ? angled : base;
    }
  }
}
