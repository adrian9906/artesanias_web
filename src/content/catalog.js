import { productImages } from '../data/productCatalog'

function carouselPreview(src) {
  if (src.includes("res.cloudinary.com/")) {
    return src.replace("/upload/", "/upload/c_limit,f_auto,q_auto,w_640/")
  }

  return src
    .replace('/productos/', '/productos/carousel/')
    .replace(/\.[^.]+$/, '_carousel.webp')
}

export const catalogContact = {
  countryCode: '53',
  localNumber: '54024066',
  whatsappNumber: '5354024066',
}

export const catalogSections = [
  {
    id: 'jarras-de-autor',
    status: 'available',
    title: { es: 'Jarras de autor', en: 'Signature jars' },
    eyebrow: { es: 'Mesa y ritual', en: 'Table and ritual' },
    description: {
      es: 'Jarras modeladas y decoradas a mano, inspiradas en flores, cortezas y pequeños rituales cotidianos. Cada acabado presenta variaciones propias del proceso artesanal.',
      en: 'Hand-shaped and decorated jars inspired by flowers, bark, and everyday rituals. Every finish has natural variations from the handmade process.',
    },
    materials: {
      es: ['Porcelana fría modelada a mano', 'Pigmentos y pintura acrílica', 'Sellador protector de acabado mate'],
      en: ['Hand-shaped cold porcelain', 'Pigments and acrylic paint', 'Matte protective sealant'],
    },
    turnaround: {
      es: '10–14 días',
      en: '10–14 days',
    },
    price: { amount: 15, currency: 'USD' },
    images: productImages.jarras.map((src, index) => ({
      src,
      previewSrc: carouselPreview(src),
      alt: {
        es: `Jarra artesanal de la colección, vista ${index + 1}`,
        en: `Handmade jar from the collection, view ${index + 1}`,
      },
    })),
  },
  {
    id: 'figuras-personalizadas',
    status: 'made-to-order',
    title: { es: 'Figuras personalizadas', en: 'Custom figures' },
    eyebrow: { es: 'Historias en miniatura', en: 'Stories in miniature' },
    description: {
      es: 'Personajes creados a partir de fotografías, profesiones, aficiones y detalles importantes. La pieza se diseña contigo antes de comenzar el modelado.',
      en: 'Characters created from photographs, professions, hobbies, and meaningful details. Each piece is designed with you before sculpting begins.',
    },
    materials: {
      es: ['Porcelana fría de alta resistencia', 'Estructura interior ligera', 'Pintura acrílica y barniz protector'],
      en: ['High-strength cold porcelain', 'Lightweight inner structure', 'Acrylic paint and protective varnish'],
    },
    turnaround: {
      es: '14–20 días',
      en: '14–20 days',
    },
    price: { amount: 30, currency: 'USD' },
    images: productImages.funkos.map((src, index) => ({
      src,
      previewSrc: carouselPreview(src),
      alt: {
        es: `Figura personalizada, vista ${index + 1}`,
        en: `Custom figure, view ${index + 1}`,
      },
    })),
  },
  {
    id: 'aretes-botanicos',
    status: 'available',
    title: { es: 'Aretes botánicos', en: 'Botanical earrings' },
    eyebrow: { es: 'Pequeñas piezas para vestir', en: 'Small pieces to wear' },
    description: {
      es: 'Flores y formas orgánicas ligeras, elaboradas una a una y pensadas para acompañar el día a día. Los colores pueden adaptarse por encargo.',
      en: 'Lightweight flowers and organic shapes, made one by one for everyday wear. Colors can be customized on request.',
    },
    materials: {
      es: ['Porcelana fría ligera', 'Pintura y pigmentos acrílicos', 'Ganchos metálicos para bisutería'],
      en: ['Lightweight cold porcelain', 'Acrylic paint and pigments', 'Metal jewelry hooks'],
    },
    turnaround: {
      es: '8–12 días',
      en: '8–12 days',
    },
    price: { amount: 5, currency: 'USD' },
    images: productImages.aretes.map((src, index) => ({
      src,
      previewSrc: carouselPreview(src),
      alt: {
        es: `Aretes artesanales, vista ${index + 1}`,
        en: `Handmade earrings, view ${index + 1}`,
      },
    })),
  },
]
