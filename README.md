# Thay Art — Next.js

Frontend de Thay Art en Next.js con App Router. Conserva el diseño, las animaciones, el catálogo, el selector ES/EN y los recursos audiovisuales de la web original.

## Desarrollo

```bash
pnpm install
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Comandos

- `pnpm dev`: servidor de desarrollo.
- `pnpm build`: compilación optimizada de producción.
- `pnpm start`: inicia la compilación de producción.
- `pnpm lint`: comprueba el código fuente.

## Estructura

- `src/app`: rutas y layouts de Next.js.
- `src/views`: pantallas visuales migradas de la aplicación original.
- `src/components`: componentes compartidos y animaciones.
- `src/data`: datos locales provisionales del catálogo y contenidos.
- `public`: imágenes, vídeos y tipografías.

## Integración futura del backend

Los datos siguen aislados en `src/data` y en el proveedor de traducciones. Cuando exista el backend, se pueden sustituir por funciones de acceso a API sin cambiar las rutas ni los componentes visuales. Las rutas de artículos ya usan identificadores (`/blog/[id]`) para facilitar esa integración.

Antes de hacer cambios editoriales o conectar un CMS, consulta `PROJECT_CONTEXT.md`. El índice importable de contenido está en `src/content/siteContext.js` y el inventario multimedia en `public/media-manifest.json`.
