// Reglas del panel del comercio. El servidor es el que decide (valida cada cambio de
// estado y cada pago); aca solo se ofrecen las acciones que tienen sentido en cada paso.
import { esDeMercadoPago } from './estadosPedido.js'

/** Estados a los que puede pasar un pedido (espejo de la maquina de estados del backend). */
export function siguientesEstados(estado, deliveryMethod) {
  switch (estado) {
    case 'recibido':
      return ['preparando', 'cancelado']
    case 'preparando':
      return [deliveryMethod === 'retiro' ? 'listo_para_retirar' : 'en_camino', 'cancelado']
    case 'en_camino':
    case 'listo_para_retirar':
      return ['entregado']
    default:
      return []
  }
}

export const ACCION_DE_ESTADO = {
  preparando: 'Empezar a preparar',
  en_camino: 'Salió a repartir',
  listo_para_retirar: 'Listo para retirar',
  entregado: 'Marcar como entregado',
  cancelado: 'Cancelar pedido',
}

export const pagoDelPedido = (pedido) => pedido?.payments?.[0] ?? null

/** Mercado Pago sin acreditar: todavia no se puede preparar (el servidor tambien lo impide). */
export const esperaAcreditacion = (pedido) =>
  esDeMercadoPago(pedido) && pagoDelPedido(pedido)?.status === 'pendiente'

/** Pedidos que el local tiene que atender (no entregados ni cancelados). */
export const EN_CURSO = ['recibido', 'preparando', 'en_camino', 'listo_para_retirar']

/**
 * "Que preparar": productos y cantidades sumados de los pedidos que hay que armar, con
 * de que pedidos sale cada uno. Se arma con los pedidos nuevos (menos los de Mercado Pago
 * que todavia no se pagaron) y los que ya se estan preparando.
 */
export function quePreparar(pedidos) {
  const porProducto = new Map()
  for (const p of pedidos) {
    const aArmar = p.fulfillmentStatus === 'preparando' || (p.fulfillmentStatus === 'recibido' && !esperaAcreditacion(p))
    if (!aArmar) continue
    for (const it of p.items ?? []) {
      const previo = porProducto.get(it.productId) ?? {
        productId: it.productId,
        nombre: it.product?.name ?? `Producto ${it.productId}`,
        stock: it.product?.stock ?? null,
        cantidad: 0,
        pedidos: [],
      }
      previo.cantidad += it.quantity
      previo.pedidos.push({ id: p.id, code: p.code, cantidad: it.quantity, enPreparacion: p.fulfillmentStatus === 'preparando' })
      porProducto.set(it.productId, previo)
    }
  }
  return [...porProducto.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}

/** "hace 3 h", "hace 12 min": para saber cuanto lleva esperando algo. */
export function haceCuanto(iso, ahora = Date.now()) {
  const min = Math.max(0, Math.round((ahora - new Date(iso).getTime()) / 60000))
  if (min < 1) return 'recién'
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 48) return `hace ${h} h`
  return `hace ${Math.floor(h / 24)} días`
}
