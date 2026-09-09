/* ---------------------------------------------------------------------------
 * Tema claro / oscuro
 * ---------------------------------------------------------------------------
 * El tema por defecto es el claro, que es la identidad de la tienda. Quien
 * prefiera el oscuro lo elige con el botón del encabezado y la elección queda
 * guardada en el navegador de esa persona.
 *
 * Si en algún momento se prefiere que la web siga la preferencia del sistema
 * operativo mientras nadie eligió nada, cambiar `readTheme` por:
 *
 *   const guardado = leerGuardado();
 *   if (guardado) return guardado;
 *   return window.matchMedia('(prefers-color-scheme: dark)').matches
 *     ? 'oscuro'
 *     : 'claro';
 * ------------------------------------------------------------------------- */

export type Theme = 'claro' | 'oscuro';

const STORAGE_KEY = 'tecnocell:tema';

/** Color de la barra del navegador en cada tema. */
const themeColor: Record<Theme, string> = {
  claro: '#fafaf8',
  oscuro: '#14161a',
};

function leerGuardado(): Theme | null {
  try {
    const valor = localStorage.getItem(STORAGE_KEY);
    return valor === 'claro' || valor === 'oscuro' ? valor : null;
  } catch {
    // Navegación privada o almacenamiento bloqueado: se usa el tema por defecto.
    return null;
  }
}

export function readTheme(): Theme {
  return leerGuardado() ?? 'claro';
}

/** Marca el tema en <html> y actualiza el color de la barra del navegador. */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme === 'oscuro' ? 'dark' : 'light';
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = themeColor[theme];
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Sin almacenamiento, el tema vale sólo para esta visita.
  }
}
