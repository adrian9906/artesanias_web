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
  { path: '/galeria', content: 'Catálogo, precios, historias y casos de éxito' },
  { path: '/noticias', content: 'Noticias destacadas y carrusel editorial' },
  { path: '/blog', content: 'Artículo editorial de respaldo' },
  { path: '/blog/[id]', content: 'Detalle de noticia por identificador' },
]

export const mediaManifest = {
  brand: [
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
  ],
  hero: ['https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562874/thay-art/fondo2.jpg', 'https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562881/thay-art/hero.png'],
  video: ['/promo.webm', '/promoMovil.webm'],
  legacy: ['https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562904/thay-art/jarra.jpg'],
  products: [
    'https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562911/thay-art/productos/funko.jpg',
    'https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562920/thay-art/productos/funko2.jpg',
    'https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562923/thay-art/productos/funko3_messi.jpg',
    'https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562927/thay-art/productos/jarra1.jpg',
    'https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562930/thay-art/productos/jarra2.jpg',
    'https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562933/thay-art/productos/jarra3_flores.jpg',
    'https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562933/thay-art/productos/jarra3_flores1.jpg',
    'https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562938/thay-art/productos/aretes1.jpg',
    'https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562940/thay-art/productos/aretes2.jpg',
    'https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562942/thay-art/productos/aretes3.png',
    'https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562945/thay-art/productos/promocion1.jpg',
    'https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562947/thay-art/productos/promocion2.jpg',
    'https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562949/thay-art/productos/Generated_Image_May_19-_2026_202605201500.jpg',
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
