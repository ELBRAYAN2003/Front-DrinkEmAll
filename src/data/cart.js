// Reglas de precio del carrito. Las lineas las maneja CarritoProvider; aca
// solo vive el calculo, compartido por el carrito y el checkout.

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
