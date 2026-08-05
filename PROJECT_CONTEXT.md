# Contexto maestro — Thay Art

Este documento conserva el contexto funcional, editorial y visual de la web original. Debe consultarse antes de modificar páginas, conectar un CMS o sustituir los datos locales por un backend.

## Identidad

- Marca: **Thay Art**.
- Nombre corto: **Thay Art**.
- Actividad: piezas artesanales y personalizadas de porcelana fría.
- Idiomas: español por defecto e inglés alternativo.
- Tono: cercano, artesanal, evocador y ligado a la naturaleza.
- Dirección visual: bosque encantado, verdes profundos, crema y oro cálido; tipografía manuscrita; composiciones orgánicas y animaciones suaves.

## Contenido que debe preservarse

La aplicación Next.js contiene el contenido completo de la web original:

- Textos y traducciones ES/EN: `src/i18n.jsx`.
- Imágenes, nombres, historias y precios de productos: `src/data/productCatalog.js`.
- Identificadores de vídeos de YouTube, Instagram y Facebook: `src/content/videoCatalog.js`.
- Inventario de imágenes, vídeos y tipografías: `public/media-manifest.json`.
- Índice importable de todo el contenido: `src/content/siteContext.js`.
- Tokens visuales, fuentes, colores y animaciones: `src/index.css`.

No se debe borrar un recurso de `public/` solamente porque no aparezca en la pantalla actual. El manifiesto también conserva recursos originales y alternativos que pueden reutilizarse en cambios futuros.

## Páginas y propósito

| Ruta | Contenido preservado |
| --- | --- |
| `/` | Hero, propuesta de valor, colecciones, testimonios, procesos creativos y CTA. |
| `/sobre-nosotros` | Historia de la marca presentada como árbol narrativo animado. |
| `/informacion-de-encargo` | Explicación de materiales, proceso y condiciones del encargo. |
| `/encargos` | Categorías, tiempos estimados, precios y formulario de solicitud. |
| `/galeria` | Catálogo de Funkos, jarras y aretes con historias, precios y casos de éxito. |
| `/noticias` | Noticias destacadas y artículos secundarios. |
| `/blog/[id]` | Detalle editorial de una noticia mediante identificador estable. |
| Cualquier ruta inválida | Pantalla 404 con accesos de recuperación. |

## Productos originales

- Funkos Pop personalizados — precio base original: **30 USD**.
- Jarras artesanales — precio base original: **15 USD**.
- Aretes artesanales — precio base original: **5 USD**.

Las historias completas, imágenes y traducciones están en las fuentes canónicas indicadas arriba. No deben duplicarse dentro de componentes nuevos.

## Reglas para cambios futuros

1. Modificar textos traducibles en `src/i18n.jsx`, manteniendo las mismas claves en `es` y `en`.
2. Modificar productos e imágenes en `src/data/productCatalog.js`.
3. Modificar referencias audiovisuales en `src/content/videoCatalog.js`.
4. Añadir cualquier recurso nuevo tanto a `public/` como a `public/media-manifest.json` y `mediaManifest` en `src/content/siteContext.js`.
5. Mantener las rutas públicas actuales o añadir redirecciones si alguna cambia.
6. Conservar los identificadores de noticias porque alimentan `/blog/[id]`.
7. No reemplazar las fuentes Playwrite GB y Bitcount Grid sin una decisión explícita de rediseño.
8. No eliminar las animaciones GSAP o el cursor personalizado durante cambios de datos/backend.

## Contrato recomendado para el backend

Cuando se conecte un backend o CMS, debe devolver entidades equivalentes a estas:

```ts
type LocalizedText = { es: string; en: string }

type Product = {
  id: string
  name: LocalizedText
  price: { amount: number; currency: 'USD' }
  story: LocalizedText
  images: string[]
}

type Article = {
  id: string
  category: LocalizedText
  date: string
  title: LocalizedText
  excerpt: LocalizedText
  body?: LocalizedText
  image: string
  author?: string
  readTime?: LocalizedText
}

type OrderCategory = {
  id: string
  name: LocalizedText
  eta: LocalizedText
  basePrice?: { amount: number; currency: 'USD' }
}
```

Mientras no exista el backend, los módulos locales son la fuente oficial. La capa visual no debe depender directamente de una URL de API; la futura integración debe sustituir la fuente de datos manteniendo estas formas.

## Lista de comprobación antes de publicar cambios

- La portada conserva fondo, título, subtítulo y CTA.
- El selector ES/EN sigue cambiando todo el contenido visible.
- Las tres colecciones conservan nombre, precio, historia e imágenes.
- Noticias abre `/blog/[id]` con el artículo correcto.
- El formulario de encargos mantiene categorías y tiempos estimados.
- `pnpm lint` y `pnpm build` terminan correctamente.
- No hay referencias rotas respecto a `public/media-manifest.json`.
