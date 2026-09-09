# Tecnocell — web de catálogo

Sitio de catálogo para Tecnocell (smartphones y accesorios). La conversión
principal es **consultar por WhatsApp**: cada botón arma el mensaje con el
producto, la capacidad y el color elegidos.

Stack: **Vite + React + TypeScript**, CSS propio con variables. Sin frameworks
de UI ni dependencias de estilo.

---

## Cómo ejecutarlo

```bash
cd tecnocell
npm install
npm run dev
```

Queda en `http://localhost:5173`.

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Verifica tipos y compila a `dist/` |
| `npm run preview` | Sirve el build de producción |
| `npm run typecheck` | Sólo verificación de tipos |
| `npm run build:artifact` | Versión en **un solo archivo** → `artifact/tecnocell.html` |

El build de `dist/` usa rutas normales (`/smartphones`), así que el hosting
tiene que reescribir todas las rutas a `index.html` (Netlify, Vercel, Cloudflare
Pages lo hacen con una línea de configuración). El build de un solo archivo usa
rutas por hash (`#/smartphones`) y funciona en cualquier lado sin configurar
nada.

---

## Publicar

El repositorio ya trae la configuración de las tres opciones más comunes:

| Dónde | Qué hace falta |
| --- | --- |
| **GitHub Pages** | Settings → Pages → Source: **GitHub Actions**. El workflow `.github/workflows/deploy.yml` compila y publica en cada push a `main`, usando rutas por hash. |
| **Netlify** | Conectar el repo. `netlify.toml` ya define el comando, la carpeta y la reescritura de rutas. |
| **Vercel** | Importar el repo. `vercel.json` ya define la reescritura a `index.html`. |

En Netlify y Vercel las URLs quedan limpias (`/smartphones`); en GitHub Pages
quedan con hash (`#/smartphones`), porque Pages no reescribe rutas.

---

## Dónde se edita cada cosa

| Qué | Archivo |
| --- | --- |
| **Datos del negocio** (WhatsApp, contacto, horarios, redes, moneda, FAQ) | `src/config/site.ts` |
| **Catálogo** (productos, variantes, precios, stock, specs) | `src/data/catalog.ts` |
| Filtros, orden y búsqueda | `src/lib/catalog.ts` |
| Armado del mensaje de WhatsApp | `src/lib/whatsapp.ts` |
| Estilos e identidad visual | `src/styles/global.css` |
| Ilustraciones de producto | `src/components/ProductImage.tsx` |

### Poner el WhatsApp real

En `src/config/site.ts`:

```ts
whatsapp: {
  number: '5491122334455', // sólo dígitos, con código de país, sin "+"
  greeting: 'Hola, Tecnocell.',
},
```

Mientras `number` sea `null`, los botones **siguen funcionando** pero abren un
panel con el mensaje listo para copiar, en lugar de un enlace inventado. Apenas
se carga el número, los mismos botones pasan a ser enlaces `wa.me` directos.

### Pasar de catálogo demo a catálogo real

1. Reemplazar los productos de `src/data/catalog.ts`.
2. Cambiar `catalog.source` de `'demo'` a `'real'` en `src/config/site.ts`.

Eso saca la barra de aviso, la leyenda "precio de referencia" de las tarjetas y
la nota de la ficha de producto.

---

## Qué incluye

- **Inicio**: hero, categorías, destacados, marcas presentes en el catálogo,
  sección de asesoramiento, preguntas frecuentes y contacto.
- **Catálogo** (`/catalogo`, `/smartphones`, `/accesorios`): búsqueda por marca o
  modelo (ignora acentos y mayúsculas), filtros por marca, categoría,
  almacenamiento y precio máximo, orden por precio y nombre, contador de
  resultados, limpiar filtros y estado vacío con acciones. Los filtros viven en
  la URL, así que un resultado filtrado se puede compartir. En celular los
  filtros se abren en un panel inferior.
- **Ficha de producto** (`/producto/:slug`): galería con tres vistas, selector de
  capacidad y color, precio y disponibilidad de la variante, descripción,
  especificaciones, relacionados y barra de consulta fija en celular.
- **Contacto** (`/contacto`) y **404**.

Accesibilidad y UX: HTML semántico con un solo `h1` por página, enlace para
saltar al contenido, foco visible, `Escape` cierra buscador, menú y paneles,
`aria-expanded` en los controles que abren capas, áreas táctiles de 44 px,
sin desbordamiento horizontal y soporte de `prefers-reduced-motion`.

SEO: título y descripción propios por página, Open Graph y `lang="es"`. La URL
canónica y `og:url` se emiten sólo cuando se complete `site.url`.

### Fotos de producto

Las fotos reales van en `public/productos/` y se enlazan desde el catálogo con
el campo `photo` (y `photo` por variante, si hay una foto por color). Las
instrucciones completas, con nombres de archivo y tamaños recomendados, están
en `public/productos/README.md`.

Mientras un producto no tenga foto cargada, la web muestra un **marcador neutro**
con un contorno esquemático según la categoría. Es deliberado: no se representa
un modelo concreto con una imagen inventada, porque alteraría cómo es el equipo
en realidad. La foto de la portada se configura en `site.home.heroPhoto`.

---

## Datos pendientes para publicar

Nada de esto está inventado en el código: son los campos que hay que completar.

1. **Número de WhatsApp** (`site.whatsapp.number`) — bloqueante: es la conversión
   principal.
2. **Fotos de los productos** en `public/productos/` y la foto de portada en
   `site.home.heroPhoto`. Es lo que más cambia la percepción de la tienda.
3. **Catálogo real**: productos, precios, capacidades, colores y stock; después
   `catalog.source = 'real'`.
4. **Dominio** (`site.url`) — necesario para las URLs canónicas, Open Graph y
   para poder agregar datos estructurados.
5. **Contacto**: dirección, localidad, enlace de Google Maps, teléfono y email
   (`site.contact`). Hoy la web oculta lo que no está cargado.
5. **Horarios de atención** (`site.openingHours`).
7. **Redes sociales** (`site.social`).
8. **Respuestas reales de las preguntas frecuentes** (`site.faq`): medios de
   pago, financiación, envíos y condiciones de garantía. Las actuales son
   neutras a propósito, para no afirmar políticas que no fueron confirmadas.
9. **Logo definitivo**: hoy hay una solución tipográfica provisional en
   `Logo` (`src/components/Header.tsx`) y `public/favicon.svg`.
10. **Imagen de Open Graph** para compartir en redes.

Cosas deliberadamente **no** incluidas, por no tener respaldo: testimonios,
cifras de ventas, sellos de confianza, promociones, cuotas y plazos de envío.
Tampoco hay carrito, checkout, formulario de contacto ni cuentas de usuario:
serían interfaces que simulan funcionar sin backend. La separación entre
`config`, `data` y componentes deja el camino abierto para conectar un
ecommerce real más adelante.
