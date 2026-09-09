// Traduccion entre lo que devuelve la API y la forma que ya consumen los
// componentes.
//
// El modelo del backend es el de un sistema de venta (sku, stock, proveedor)
// y la UI fue armada sobre una maqueta de tienda (puntaje, precio tachado,
// notas de cata). Todo eso se resuelve en un solo lugar, asi ningun
// componente tiene que saber de que forma viene el dato.

import { urlDeArchivo } from './api.js'
import { productImage } from './placeholder.js'

/**
 * Nombre de categoria -> segmento de URL.
 *
 * Las rutas son /catalogo/:categoria y tienen que seguir siendo legibles y
 * compartibles, asi que la URL lleva el nombre y no el id numerico de la API.
 * Se quitan las tildes para que "Cognac" y "Regaleria" no viajen escapadas.
 */
export function slugDeCategoria(nombre = '') {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Tono deterministico segun el nombre: sin foto real, dos productos
// distintos igual reciben botellas de colores distintos y estables.
function tonoDe(texto = '') {
  let h = 0
  for (let i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) % 360
  return h
}

function formaDe(producto) {
  const t = `${producto.name} ${producto.category?.name ?? ''}`.toLowerCase()
  if (/cerveza|lata|ipa|stout|lager/.test(t)) return 'can'
  if (/gin|whisky|vodka|ron|licor|aperitivo|vermut/.test(t)) return 'beer'
  return 'wine'
}

/** Producto de la API -> producto que espera ProductCard. */
export function adaptarProducto(p) {
  const hue = tonoDe(p.name ?? '')
  const shape = formaDe(p)
  const foto = urlDeArchivo(p.imageUrl)

  return {
    id: String(p.id),
    name: p.name,
    brand: p.brand ?? p.category?.name ?? '',
    price: Number(p.price),
    // El precio tachado solo se muestra si es mayor al actual: un oldPrice igual
    // o menor daria un descuento de 0% o negativo.
    oldPrice: p.oldPrice != null && Number(p.oldPrice) > Number(p.price) ? Number(p.oldPrice) : null,
    onOffer: Boolean(p.onOffer),
    // Tampoco hay reseñas: se omite el contador para no inventar un numero.
    rating: 0,
    reviews: null,
    stock: Number(p.stock ?? 0),
    badges: Number(p.stock ?? 0) === 0 ? ['agotado'] : [],
    dealEndsAt: null,
    // La descripcion viene en un solo texto; se corta en lineas para las
    // notas que muestra la tarjeta al pasar el mouse.
    notes: (p.description ?? '')
      .split(/\.\s+|\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3),
    image: foto ?? productImage({ hue, shape }),
    hoverImage: foto ?? productImage({ hue: hue + 12, shape, bg: '#efe7dd' }),
    // Datos propios de la API que la UI puede necesitar mas adelante.
    sku: p.sku ?? null,
    categoryId: p.categoryId ?? p.category?.id ?? null,
    category: p.category?.name ?? null,
  }
}

/** Categoria de la API -> categoria que espera el sidebar. */
export function adaptarCategoria(c) {
  return {
    id: String(c.id),
    name: c.name,
    // La ruta viaja por slug; el id es lo que despues se le manda a la API.
    slug: slugDeCategoria(c.name),
    description: c.description ?? null,
  }
}
