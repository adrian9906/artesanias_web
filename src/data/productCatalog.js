export const productImages = {
  funkos: [
    "/productos/funko.jpeg",
    "/productos/funko2.jpeg",
    "/productos/funko3_messi.jpeg",
  ],
  jarras: [
    "/productos/jarra1.jpeg",
    "/productos/jarra2.jpeg",
    "/productos/jarra3_flores.jpeg",
  ],
  aretes: [
    "/productos/aretes1.jpeg",
    "/productos/aretes2.jpeg",
    "/productos/Generated_Image_May_19,_2026_202605201500.jpeg",
  ],
}

export const galleryCatalog = [
  {
    id: "funkos",
    nombre: "Funkos Pop personalizados",
    precio: "30 USD",
    historia:
      "Cada Funko nace de una historia real: profesiones, bandas favoritas y personajes que marcaron momentos importantes. Modelamos rasgos, colores y detalles para que cada pieza sea un recuerdo vivo.",
    casosExito: productImages.funkos,
  },
  {
    id: "jarras",
    nombre: "Jarras artesanales",
    precio: "15 USD",
    historia:
      "Nuestras jarras se inspiran en mesas familiares y cafecitos de domingo. Cada pieza se termina a mano, con acabados orgánicos y tonos cálidos para que cada bebida tenga su propio ritual.",
    casosExito: productImages.jarras,
  },
  {
    id: "aretes",
    nombre: "Aretes artesanales",
    precio: "5 USD",
    historia:
      "Los aretes son nuestra colección más juguetona: pequeños acentos de color para usar todos los días. Livianos, resistentes y hechos para combinar con estilos casuales o elegantes.",
    casosExito: productImages.aretes,
  },
]

export const homeCategories = [
  {
    title: "Jarras de Autor",
    desc: "Diseños orgánicos únicos que elevan tu mesa diaria.",
    story:
      "Cada jarra nace del estudio de formas naturales y termina con acabados que imitan piedra, corteza y musgo. Son piezas para convertir una mesa cotidiana en una escena ritual.",
    img: productImages.jarras[0],
    cta: "Ver colección",
  },
  {
    title: "Funkos Personalizados",
    desc: "Tus personajes favoritos capturados en porcelana fría.",
    story:
      "Tomamos referencias, bocetos y expresiones clave para modelar versiones únicas de tus personajes. Cada figura conserva personalidad, gesto y narrativa.",
    img: productImages.funkos[1],
    cta: "Saber más",
  },
  {
    title: "Joyería Botánica",
    desc: "Naturaleza preservada en piezas de arte para vestir.",
    story:
      "Flores, hojas y texturas orgánicas se traducen en joyas ligeras con detalle escultórico. Es una línea pensada para llevar naturaleza contigo todos los días.",
    img: productImages.aretes[0],
    cta: "Explorar",
  },
]

export const blogRelatedArticles = [
  {
    category: "Rituales",
    categoryColor: "text-yellow-600",
    title: "Cantos de arcilla al amanecer",
    excerpt: "Descubre cómo los sonidos del bosque influyen en el ritmo del modelado manual.",
    image: productImages.jarras[1],
  },
  {
    category: "Técnica",
    categoryColor: "text-pink-400",
    title: "Pigmentos de la tierra viva",
    excerpt: "Una guía sobre la extracción de colores naturales a partir de raíces y líquenes.",
    image: productImages.aretes[1],
  },
  {
    category: "Inspiración",
    categoryColor: "text-blue-400",
    title: "Donde habitan las sombras",
    excerpt: "Explorando la estética de la melancolía y la belleza en la penumbra del bosque.",
    image: productImages.funkos[0],
  },
]

