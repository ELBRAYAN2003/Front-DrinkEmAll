// Traduccion entre lo que devuelve la API y la forma que ya consumen los
// componentes.
//
// El modelo del backend es el de un sistema de venta (sku, stock, proveedor)
// y la UI fue armada sobre una maqueta de tienda (puntaje, precio tachado,
// notas de cata). Todo eso se resuelve en un solo lugar, asi ningun
// componente tiene que saber de que forma viene el dato.

import { urlDeArchivo } from './api.js'
import { productImage } from './placeholder.js'

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
    // El modelo no maneja precio anterior ni ofertas todavia.
    oldPrice: null,
    // Tampoco hay reseñas: se omite el contador para no inventar un numero.
    rating: 0,
    reviews: null,
    stock: Number(p.stock ?? 0),
    badges: Number(p.stock ?? 0) === 0 ? ['agotado'] : [],
    // La descripcion viene en un solo texto; se corta en lineas para las
    // notas que muestra la tarjeta al pasar el mouse.
    notes: (p.description ?? '')
      .split(/\.\s+|\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3),
    dealEndsAt: null,
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
    description: c.description ?? null,
  }
}
