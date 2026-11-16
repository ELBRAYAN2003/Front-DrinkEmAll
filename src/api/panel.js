import { apiDelete, apiGet, apiPatch } from '../lib/api.js'

// Operaciones del comercio (vendedor, admin). Cada una exige el rol en la API: aca no se
// decide nada, solo se llama.

/** Pedidos online de todos los clientes. `filtros`: { status, code }. Con detalle (items, pago, cliente). */
export const pedidosDelComercio = async (filtros = {}, opciones) => {
  const r = await apiGet('/orders', { ...opciones, params: { pageSize: 100, ...filtros }, auth: true })
  return r.data ?? []
}

export const pedidoDelComercio = (id, opciones) => apiGet(`/orders/${id}`, { ...opciones, auth: true })

/** Avanza el estado de un pedido: { status, note?, idChecked? }. */
export const cambiarEstadoDelPedido = (id, cuerpo) => apiPatch(`/orders/${id}/status`, { body: cuerpo, auth: true })

/** Marca un pago como pagado (efectivo o transferencia; Mercado Pago se acredita solo). */
export const marcarPagado = (idPago) => apiPatch(`/payments/${idPago}/mark-paid`, { auth: true })

/** Solicitudes del boton de arrepentimiento. `estado`: 'pendiente' | 'atendida'. */
export const arrepentimientos = async (estado) => {
  const r = await apiGet('/revocations', { params: { pageSize: 100, ...(estado && { status: estado }) }, auth: true })
  return r.data ?? []
}
export const atenderArrepentimiento = (id, nota) =>
  apiPatch(`/revocations/${id}`, { body: { status: 'atendida', ...(nota && { note: nota }) }, auth: true })

/** Productos para el panel: busca por nombre, marca o codigo (sku); incluye los inactivos. */
export const productosDelComercio = (params) =>
  apiGet('/products', { params: { pageSize: 25, includeSku: true, ...params }, auth: true })
export const actualizarProducto = (id, cuerpo) => apiPatch(`/products/${id}`, { body: cuerpo, auth: true })
export const desactivarProducto = (id) => apiDelete(`/products/${id}`, { auth: true })
