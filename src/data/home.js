// Contenido de la home. Todo esto es data de maqueta: cuando exista el backend,
// cada bloque se reemplaza por la respuesta de la API con la misma forma.

import { productImage, tileImage } from '../lib/placeholder.js'

export const topBar = {
  message: 'Envio sin cargo en pedidos de mas de $80',
  links: [
    { label: 'Seguir mi pedido', href: '#' },
    { label: 'Ayuda', href: '#' },
    { label: 'Contacto', href: '#' },
  ],
  languages: ['ES', 'EN', 'PT'],
  currencies: ['ARS $', 'USD $', 'EUR €'],
}

export const searchCategories = [
  'Todas las categorias',
  'Vinos',
  'Cervezas',
  'Destilados',
  'Sin alcohol',
  'Accesorios',
]

export const navigation = [
  {
    label: 'Vinos',
    to: '/catalogo/tinto',
    columns: [
      {
        title: 'Por tipo',
        links: ['Tinto', 'Blanco', 'Rosado', 'Espumante', 'Naranjo'],
      },
      {
        title: 'Por varietal',
        links: ['Malbec', 'Cabernet Franc', 'Chardonnay', 'Torrontes', 'Pinot Noir'],
      },
      {
        title: 'Por region',
        links: ['Mendoza', 'Salta', 'Patagonia', 'San Juan', 'La Rioja'],
      },
    ],
    promo: {
      title: 'Seleccion de bodega',
      subtitle: 'Hasta 25% off',
      hue: 344,
    },
  },
  {
    label: 'Cervezas',
    to: '/catalogo/cerveza',
    columns: [
      {
        title: 'Estilos',
        links: ['IPA', 'Stout', 'Lager', 'Golden Ale', 'Trigo'],
      },
      {
        title: 'Formato',
        links: ['Lata 473ml', 'Botella 500ml', 'Growler 1L', 'Barril 5L'],
      },
    ],
  },
  { label: 'Destilados', to: '/catalogo/destilado' },
  { label: 'Sin alcohol', to: '/catalogo/sin-alcohol' },
  { label: 'Combos', to: '/catalogo', highlight: 'Nuevo' },
  { label: 'Ofertas', to: '/catalogo' },
]

export const slides = [
  {
    id: 'slide-1',
    eyebrow: 'Todo lo que buscabas',
    title: 'Malbec de altura',
    subtitle: 'Seleccion de bodega',
    off: '20%',
    cta: 'Comprar ahora',
    bg: '#e8f1fa',
    hue: 344,
    shape: 'wine',
  },
  {
    id: 'slide-2',
    eyebrow: 'Cerveceria independiente',
    title: 'Frio y bien lupulado',
    subtitle: 'Rotamos todas las semanas',
    off: '15%',
    cta: 'Explorar cervezas',
    bg: '#fdf1e3',
    hue: 34,
    shape: 'can',
  },
  {
    id: 'slide-3',
    eyebrow: 'Para regalar',
    title: 'Combos a tu gusto',
    subtitle: 'Caja, papel y tarjeta incluidos',
    off: '25%',
    cta: 'Armar un combo',
    bg: '#efeaf7',
    hue: 268,
    shape: 'wine',
  },
]

// Tarjetas de la columna derecha del hero.
export const heroPromos = [
  {
    id: 'hp-1',
    price: 'Desde $9',
    title: 'Cervezas',
    subtitle: 'artesanales',
    cta: 'Ver ahora',
    bg: '#f0f2f5',
    ink: '#1c1418',
    hue: 28,
    shape: 'can',
  },
  {
    id: 'hp-2',
    price: 'Solo $210',
    title: 'Caja',
    subtitle: 'degustacion',
    cta: 'Ver ahora',
    bg: '#f2c14e',
    ink: '#3a2a08',
    hue: 344,
    shape: 'wine',
  },
].map((p) => ({ ...p, image: productImage({ hue: p.hue, shape: p.shape, bg: p.bg }) }))

export const slideArt = Object.fromEntries(
  slides.map((sl) => [sl.id, productImage({ hue: sl.hue, shape: sl.shape, bg: sl.bg })]),
)

export const services = [
  {
    id: 'envio',
    icon: 'truck',
    title: 'Envio en 24 horas',
    text: 'Gratis desde $80 en todo el pais',
  },
  {
    id: 'devolucion',
    icon: 'refresh',
    title: 'Cambios sin vueltas',
    text: '30 dias para arrepentirte',
  },
  {
    id: 'pago',
    icon: 'shield',
    title: 'Pago protegido',
    text: 'Devolucion garantizada',
  },
  {
    id: 'soporte',
    icon: 'headset',
    title: 'Sommelier online',
    text: 'Te asesoramos de 9 a 21 h',
  },
]

export const categories = [
  { id: 'tinto', name: 'Vinos tintos', hue: 344, image: tileImage({ hue: 344 }) },
  { id: 'blanco', name: 'Vinos blancos', hue: 48, image: tileImage({ hue: 48 }) },
  { id: 'rosado', name: 'Vinos rosados', hue: 320, image: tileImage({ hue: 320 }) },
  { id: 'espumante', name: 'Espumantes', hue: 42, image: tileImage({ hue: 42 }) },
  { id: 'cerveza', name: 'Cervezas', hue: 28, image: tileImage({ hue: 28 }) },
  { id: 'destilado', name: 'Destilados', hue: 196, image: tileImage({ hue: 196 }) },
  { id: 'sin-alcohol', name: 'Sin alcohol', hue: 152, image: tileImage({ hue: 152 }) },
]


// Helper para no repetir la construccion de cada producto.
let seq = 0
const OPENED_AT = Date.now()
const make = ({ hue, shape = 'wine', dealEndsInHours, ...rest }) => ({
  id: `p-${++seq}`,
  image: productImage({ hue, shape }),
  hoverImage: productImage({ hue: hue + 12, shape, bg: '#efe7dd' }),
  // Absoluto y fijado al importar el modulo: asi el contador sigue corriendo
  // aunque la tarjeta se desmonte al cambiar de pestana.
  dealEndsAt: dealEndsInHours ? OPENED_AT + dealEndsInHours * 3600_000 : null,
  ...rest,
})

const CATALOG = [
  make({
    hue: 344,
    name: 'Malbec Reserva de Altura 750ml',
    category: 'tinto',
    brand: 'Finca del Sauce',
    price: 52,
    oldPrice: 65,
    rating: 4.5,
    reviews: 34,
    stock: 17,
    badges: ['nuevo'],
    notes: ['Ciruela madura y un dejo de vainilla', 'Doce meses en roble frances', 'Cuerpo medio, taninos redondos'],
    tabs: ['destacados', 'nuevos'],
    dealEndsInHours: 34,
  }),
  make({
    hue: 48,
    name: 'Torrontes Cosecha Temprana 750ml',
    category: 'blanco',
    brand: 'Alto Calchaqui',
    price: 38,
    rating: 4,
    reviews: 21,
    stock: 110,
    badges: ['nuevo'],
    notes: ['Jazmin y ralladura de pomelo', 'Fermentado en tanque de acero', 'Fresco, seco y muy facil de tomar'],
    tabs: ['destacados', 'nuevos'],
  }),
  make({
    hue: 28,
    shape: 'can',
    name: 'IPA Sesion Doble Lupulo 473ml',
    category: 'cerveza',
    brand: 'Barrio Nueve',
    price: 9,
    rating: 5,
    reviews: 87,
    stock: 240,
    notes: ['Mango, maracuya y pino', 'Amargor medio, 4.8% ABV', 'Lata unitaria, se vende por seis'],
    tabs: ['destacados', 'vendidos'],
  }),
  make({
    hue: 268,
    name: 'Cabernet Franc Parcela 4 750ml',
    category: 'tinto',
    brand: 'Vina Trelew',
    price: 71,
    oldPrice: 79,
    rating: 4.5,
    reviews: 52,
    stock: 140,
    notes: ['Pimiento asado y frutos negros', 'Guarda de dieciocho meses', 'Ideal con carnes a la parrilla'],
    tabs: ['destacados', 'vendidos'],
    dealEndsInHours: 12,
  }),
  make({
    hue: 12,
    name: 'Blend de Corte Cinco Barricas 750ml',
    category: 'tinto',
    brand: 'Casa Miramar',
    price: 58,
    oldPrice: 68,
    rating: 4,
    reviews: 29,
    stock: 62,
    notes: ['Cassis, tabaco y cacao amargo', 'Corte de malbec, merlot y syrah', 'Se abre mejor tras media hora'],
    tabs: ['destacados', 'vendidos'],
  }),
  make({
    hue: 196,
    shape: 'beer',
    name: 'Gin Botanico Serie Limitada 700ml',
    category: 'destilado',
    brand: 'Destileria Sur',
    price: 84,
    rating: 4.5,
    reviews: 18,
    stock: 0,
    badges: ['agotado'],
    notes: ['Enebro, cardamomo y citricos', 'Destilado en alambique de cobre', 'Cuarenta y dos grados'],
    tabs: ['nuevos'],
  }),
  make({
    hue: 88,
    name: 'Chardonnay sin Madera 750ml',
    category: 'blanco',
    brand: 'Finca del Sauce',
    price: 44,
    oldPrice: 52,
    rating: 4,
    reviews: 44,
    stock: 120,
    notes: ['Manzana verde y almendra', 'Sin paso por roble', 'Servir bien frio, entre 8 y 10 grados'],
    tabs: ['nuevos', 'vendidos'],
    dealEndsInHours: 60,
  }),
  make({
    hue: 320,
    name: 'Rosado de Prensa Directa 750ml',
    category: 'rosado',
    brand: 'Vina Trelew',
    price: 36,
    rating: 4.5,
    reviews: 63,
    stock: 88,
    badges: ['nuevo'],
    notes: ['Frutilla, sandia y hierbas', 'Prensado suave, color palido', 'Aperitivo de tarde'],
    tabs: ['nuevos'],
  }),
  make({
    hue: 4,
    shape: 'can',
    name: 'Stout Imperial Cafe y Cacao 473ml',
    category: 'cerveza',
    brand: 'Barrio Nueve',
    price: 11,
    oldPrice: 14,
    rating: 5,
    reviews: 95,
    stock: 76,
    notes: ['Cafe tostado y chocolate negro', 'Nueve grados, para tomar de a poco', 'Guarda bien hasta dos anos'],
    tabs: ['vendidos'],
  }),
  make({
    hue: 42,
    name: 'Espumante Metodo Tradicional 750ml',
    category: 'espumante',
    brand: 'Casa Miramar',
    price: 62,
    oldPrice: 74,
    rating: 4.5,
    reviews: 40,
    stock: 54,
    notes: ['Burbuja fina y persistente', 'Veinticuatro meses sobre lias', 'Brut nature, sin azucar agregada'],
    tabs: ['destacados', 'nuevos', 'vendidos'],
    dealEndsInHours: 20,
  }),
  make({
    hue: 152,
    shape: 'beer',
    name: 'Vermut Blanco de Autor 750ml',
    category: 'destilado',
    brand: 'Destileria Sur',
    price: 33,
    rating: 4,
    reviews: 12,
    stock: 90,
    notes: ['Manzanilla, ajenjo y naranja', 'Macerado en frio', 'Con hielo y una rodaja de naranja'],
    tabs: ['nuevos'],
  }),
  make({
    hue: 232,
    shape: 'can',
    name: 'Kombucha de Jengibre 473ml',
    category: 'sin-alcohol',
    brand: 'Fermento Vivo',
    price: 6,
    rating: 4,
    reviews: 58,
    stock: 300,
    notes: ['Jengibre fresco y limon', 'Sin alcohol, sin azucar agregada', 'Fermentado treinta dias'],
    tabs: ['nuevos', 'vendidos'],
  }),
  make({
    hue: 350, category: 'tinto',
    name: 'Syrah de Guarda Larga 750ml', brand: 'Casa Miramar',
    price: 66, rating: 4.5, reviews: 27, stock: 48,
    notes: ['Pimienta negra y mora', 'Veinte meses en barrica', 'Para descorchar con tiempo'],
    tabs: [],
  }),
  make({
    hue: 12, category: 'tinto',
    name: 'Pinot Noir de Clima Frio 750ml', brand: 'Vina Trelew',
    price: 78, oldPrice: 92, rating: 5, reviews: 61, stock: 33,
    badges: ['nuevo'],
    notes: ['Frutilla, hongo y tierra humeda', 'Delicado pero persistente', 'Servir apenas fresco'],
    tabs: [],
  }),
  make({
    hue: 40, category: 'blanco',
    name: 'Sauvignon Blanc de Rio 750ml', brand: 'Alto Calchaqui',
    price: 41, rating: 4, reviews: 19, stock: 92,
    notes: ['Pomelo y hoja de tomate', 'Acidez filosa', 'Ideal con pescados'],
    tabs: [],
  }),
  make({
    hue: 56, category: 'blanco',
    name: 'Semillon de Parcela Vieja 750ml', brand: 'Finca del Sauce',
    price: 49, oldPrice: 58, rating: 4.5, reviews: 23, stock: 40,
    notes: ['Membrillo y cera de abeja', 'Vinas de mas de sesenta anos', 'Gana con el tiempo en copa'],
    tabs: [],
  }),
  make({
    hue: 326, category: 'rosado',
    name: 'Rosado de Malbec Fresco 750ml', brand: 'Casa Miramar',
    price: 34, rating: 4, reviews: 37, stock: 130,
    notes: ['Cereza y pomelo rosado', 'Muy seco, poco alcohol', 'Para la tarde'],
    tabs: [],
  }),
  make({
    hue: 46, category: 'espumante',
    name: 'Extra Brut de Guarda 750ml', brand: 'Vina Trelew',
    price: 71, oldPrice: 84, rating: 4.5, reviews: 31, stock: 26,
    notes: ['Manzana al horno y pan tostado', 'Treinta meses sobre lias', 'Burbuja fina'],
    tabs: [],
  }),
  make({
    hue: 20, shape: 'can', category: 'cerveza',
    name: 'Golden Ale Facil de Tomar 473ml', brand: 'Barrio Nueve',
    price: 7, rating: 4, reviews: 74, stock: 320,
    notes: ['Cereal y un toque citrico', 'Cuatro grados y medio', 'La cerveza de entrada'],
    tabs: [],
  }),
  make({
    hue: 36, shape: 'can', category: 'cerveza',
    name: 'Cerveza de Trigo Turbia 473ml', brand: 'Barrio Nueve',
    price: 8, oldPrice: 10, rating: 4.5, reviews: 52, stock: 180,
    notes: ['Banana y clavo de olor', 'Sin filtrar', 'Servir en vaso alto'],
    tabs: [],
  }),
  make({
    hue: 186, shape: 'beer', category: 'destilado',
    name: 'Aperitivo Amargo de Hierbas 750ml', brand: 'Destileria Sur',
    price: 39, rating: 4, reviews: 16, stock: 70,
    notes: ['Genciana, naranja amarga y ruibarbo', 'Macerado tres meses', 'Con soda y hielo'],
    tabs: [],
  }),
  make({
    hue: 210, shape: 'beer', category: 'destilado',
    name: 'Whisky de Malta Doble Barrica 700ml', brand: 'Destileria Sur',
    price: 128, oldPrice: 149, rating: 5, reviews: 44, stock: 0,
    badges: ['agotado'],
    notes: ['Caramelo, humo y nuez', 'Terminado en barrica de jerez', 'Cuarenta y seis grados'],
    tabs: [],
  }),
  make({
    hue: 140, shape: 'can', category: 'sin-alcohol',
    name: 'Gaseosa Artesanal de Pomelo 473ml', brand: 'Fermento Vivo',
    price: 5, rating: 4, reviews: 88, stock: 400,
    notes: ['Pomelo rosado exprimido', 'Poca azucar, mucha burbuja', 'Bien fria'],
    tabs: [],
  }),
  make({
    hue: 168, category: 'sin-alcohol',
    name: 'Vino Desalcoholizado Blanco 750ml', brand: 'Alto Calchaqui',
    price: 22, oldPrice: 28, rating: 3.5, reviews: 29, stock: 65,
    badges: ['nuevo'],
    notes: ['Aromatico y liviano', 'Menos de medio grado', 'Para brindar sin alcohol'],
    tabs: [],
  }),
]

// Catalogo completo, para la pagina de listado.
export const allProducts = CATALOG

export const productTabs = [
  { id: 'destacados', label: 'Destacados' },
  { id: 'nuevos', label: 'Recien llegados' },
  { id: 'vendidos', label: 'Mas vendidos' },
]

export const productsByTab = Object.fromEntries(
  productTabs.map(({ id }) => [id, CATALOG.filter((p) => p.tabs.includes(id))]),
)

export const specialProducts = CATALOG.filter((p) => p.oldPrice).slice(0, 8)

export const gallery = [
  { id: 'g1', title: 'Como leer una etiqueta sin marearte', tag: 'Guias', hue: 344 },
  { id: 'g2', title: 'Seis maridajes que nunca fallan', tag: 'Cocina', hue: 28 },
  { id: 'g3', title: 'A que temperatura servir cada vino', tag: 'Basicos', hue: 196 },
  { id: 'g4', title: 'Que es realmente una IPA', tag: 'Cerveza', hue: 88 },
].map((post) => ({ ...post, image: tileImage({ hue: post.hue }) }))

export const testimonials = [
  {
    id: 't1',
    quote:
      'Pedi un combo para un cumpleanos y llego al otro dia, bien embalado y frio. La ficha de cata fue un golazo.',
    name: 'Marina Ledesma',
    role: 'Compro tres veces',
    hue: 344,
  },
  {
    id: 't2',
    quote:
      'Me asesoraron por chat para elegir un tinto de guarda sin gastar una fortuna. Acertaron de una.',
    name: 'Diego Ferreyra',
    role: 'Cliente desde 2024',
    hue: 28,
  },
  {
    id: 't3',
    quote:
      'La rotacion de cervezas artesanales es lo mejor que tienen. Siempre hay algo nuevo para probar.',
    name: 'Sol Barrientos',
    role: 'Suscripta al club',
    hue: 196,
  },
]

export const brands = ['Finca del Sauce', 'Alto Calchaqui', 'Barrio Nueve', 'Vina Trelew', 'Casa Miramar', 'Destileria Sur']

export const contact = [
  { id: 'tel', icon: 'phone', title: 'Llamanos gratis', value: '0800 555 0199' },
  { id: 'dir', icon: 'pin', title: 'Nuestro local', value: 'Av. Sarmiento 1420, Resistencia' },
  { id: 'mail', icon: 'mail', title: 'Escribinos', value: 'hola@drinkemall.com' },
]

// La columna "Tienda" no esta aca: se arma con las categorias reales del
// catalogo. Estas dos todavia no tienen destino, asi que el pie las muestra
// como texto y no como enlaces: un enlace que no lleva a ningun lado miente.
export const footerColumns = [
  {
    title: 'Tu cuenta',
    links: ['Mis pedidos', 'Direcciones', 'Lista de deseos', 'Cupones', 'Club DrinkEmAll'],
  },
  {
    title: 'Ayuda',
    links: ['Envios y plazos', 'Cambios y devoluciones', 'Medios de pago', 'Preguntas frecuentes', 'Contacto'],
  },
]
