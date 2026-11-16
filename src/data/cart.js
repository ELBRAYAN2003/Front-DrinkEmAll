// Calculo de totales del carrito. Es una ESTIMACION para mostrar antes de
// confirmar: el costo de envio y el umbral de envio gratis salen de
// /shop/settings (no estan escritos aca) y el total que vale es el que devuelve
// la API al crear el pedido.

// El backend calcula el IVA con este porcentaje (IVA_PERCENTAGE en su .env).
export const IVA = 0.21

/**
 * @param ajustes  respuesta de /shop/settings, o null si todavia no llego. Sin ella
 *                 el envio queda en `null` (se calcula al confirmar).
 */
export function calcularTotales(lineas, { retiroEnLocal = false, ajustes = null } = {}) {
  const subtotal = lineas.reduce((acc, l) => acc + l.price * l.cantidad, 0)
  let envio = null
  if (retiroEnLocal || subtotal === 0) envio = 0
  else if (ajustes) envio = subtotal >= ajustes.freeShippingFrom ? 0 : ajustes.shippingCost
  // El precio de lista ya incluye IVA: se discrimina para mostrarlo, no se suma.
  const iva = ((subtotal + (envio ?? 0)) * IVA) / (1 + IVA)
  return { subtotal, envio, iva, total: subtotal + (envio ?? 0) }
}
