/**
 * Contrato de contenido de Thay Art.
 *
 * Este archivo sirve como índice estable para futuras integraciones con CMS/API.
 * Los datos originales permanecen en sus módulos canónicos y se reexportan aquí.
 */
export { translations } from '../i18n'
export {
  blogRelatedArticles,
  galleryCatalog,
  homeCategories,
  productImages,
} from '../data/productCatalog'
export { videoCatalog } from './videoCatalog'
export { catalogContact, catalogSections } from './catalog'

export const siteIdentity = {
  name: 'Thay Art',
  shortName: 'Thay Art',
  defaultLocale: 'es',
  locales: ['es', 'en'],
  craft: 'Artesanía en porcelana fría',
  visualDirection: 'Bosque encantado, artesanal, orgánico, verde profundo y oro cálido',
}

export const siteRoutes = [
  { path: '/', content: 'Inicio, hero, categorías, testimonios, procesos y llamada a la acción' },
  { path: '/catalogo', content: 'Catálogo editable de productos, precios, carruseles y contacto por WhatsApp' },
  { path: '/sobre-nosotros', content: 'Historia y proceso creativo de la marca' },
  { path: '/informacion-de-encargo', content: 'Explicación del proceso de encargos personalizados' },
  { path: '/encargos', content: 'Formulario y categorías de encargos' },
  { path: '/galeria', content: 'Catálogo, precios, historias y casos de éxito' },
  { path: '/noticias', content: 'Noticias destacadas y carrusel editorial' },
  { path: '/blog', content: 'Artículo editorial de respaldo' },
  { path: '/blog/[id]', content: 'Detalle de noticia por identificador' },
]

export const mediaManifest = {
  brand: ['/favicon.svg', '/icons.svg'],
  hero: ['/fondo2.jpeg', '/hero.png'],
  video: ['/promo.webm', '/promoMovil.webm'],
  legacy: ['/jarra.jpeg'],
  products: [
    '/productos/funko.jpeg',
    '/productos/funko2.jpeg',
    '/productos/funko3_messi.jpeg',
    '/productos/jarra1.jpeg',
    '/productos/jarra2.jpeg',
    '/productos/jarra3_flores.jpeg',
    '/productos/jarra3_flores1.jpeg',
    '/productos/aretes1.jpeg',
    '/productos/aretes2.jpeg',
    '/productos/aretes3.png',
    '/productos/promocion1.jpeg',
    '/productos/promocion2.jpeg',
    '/productos/Generated_Image_May_19,_2026_202605201500.jpeg',
  ],
  fonts: [
    '/fonts/playwrite/PlaywriteGBS-VariableFont_wght.ttf',
    '/fonts/playwrite/PlaywriteGBS-Italic-VariableFont_wght.ttf',
    '/fonts/bitcount/BitcountGridDoubleInk-VariableFont_CRSV,ELSH,ELXP,SZP1,SZP2,XPN1,XPN2,YPN1,YPN2,slnt,wght.ttf',
  ],
}

export const contentSources = {
  translations: 'src/i18n.jsx',
  productsAndCollections: 'src/data/productCatalog.js',
  videos: 'src/content/videoCatalog.js',
  media: 'public/',
  routes: 'src/app/',
  visualTokens: 'src/index.css',
}
