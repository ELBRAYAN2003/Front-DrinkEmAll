// Carrito de maqueta. Vive aparte de home.js porque cuando exista el backend
// esto se reemplaza por estado real (contexto o store), no por otra constante.

import { allProducts } from './home.js'

// Se toman productos del catalogo para no duplicar nombres ni precios.
const elegir = (indices) => indices.map((i) => allProducts[i]).filter(Boolean)

export const lineasIniciales = elegir([0, 2, 9]).map((p, i) => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  price: p.price,
  image: p.image,
  stock: p.stock,
  cantidad: [2, 6, 1][i] ?? 1,
}))

// El backend calcula el IVA con este porcentaje (IVA_PERCENTAGE en su .env).
export const IVA = 0.21

export const ENVIO_GRATIS_DESDE = 80
export const COSTO_ENVIO = 8

export function calcularTotales(lineas, { retiroEnLocal = false } = {}) {
  const subtotal = lineas.reduce((acc, l) => acc + l.price * l.cantidad, 0)
  const envio = retiroEnLocal || subtotal === 0 || subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO
  // El precio de lista ya incluye IVA: se discrimina para mostrarlo, no se suma.
  const iva = (subtotal * IVA) / (1 + IVA)
  return { subtotal, envio, iva, total: subtotal + envio }
}
