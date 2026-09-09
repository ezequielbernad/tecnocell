# Fotos de producto

Acá van las fotografías reales de los equipos. Mientras un producto no tenga
foto cargada, la web muestra un marcador neutro en su lugar.

## Cómo agregar una foto

1. Copiá el archivo en esta carpeta, con un nombre en minúsculas y sin espacios.
   Lo más práctico es usar el mismo `slug` del producto:

   ```
   public/productos/apple-iphone-15.jpg
   public/productos/apple-iphone-15-azul.jpg
   ```

2. En `src/data/catalog.ts`, indicá la ruta en el producto:

   ```ts
   {
     slug: 'apple-iphone-15',
     photo: '/productos/apple-iphone-15.jpg',
     photos: ['/productos/apple-iphone-15.jpg', '/productos/apple-iphone-15-dorso.jpg'],
     ...
   }
   ```

   Y si tenés una foto por color, en la variante:

   ```ts
   { storage: '128 GB', color: 'Azul', hex: '#C6D4D8', photo: '/productos/apple-iphone-15-azul.jpg', ... }
   ```

   La ruta arranca con `/productos/...`, sin `public`.

## Recomendaciones

- **Proporción 4:5** (por ejemplo 1200 × 1500 px). La web recorta con
  `object-fit: contain`, así que una foto de otra proporción no se deforma,
  pero queda con aire a los costados.
- **Fondo blanco o gris muy claro**, para que se integre con el fondo del sitio.
- **JPG** para fotos, **WebP** si querés menos peso, **PNG** sólo si necesitás
  fondo transparente.
- Menos de 300 kB por archivo: se cargan varias juntas en el catálogo.
- Usá siempre las fotos oficiales del fabricante o fotos propias del equipo. No
  uses imágenes de terceros sin permiso ni imágenes generadas: la foto tiene
  que mostrar el producto tal como es.

## Foto de la portada

La imagen del banner de inicio se configura aparte, en
`src/config/site.ts` → `home.heroPhoto`.
