import { apiBlob, apiGet, apiPost } from '../lib/api.js'

// Pedidos online de la persona con sesion iniciada. La API solo devuelve los
// propios: un pedido ajeno contesta 404, igual que uno que no existe.

export const misPedidos = async (opciones) => {
  const r = await apiGet('/orders', { ...opciones, params: { pageSize: 50 }, auth: true })
  return r.data ?? []
}

export const unPedido = (id, opciones) => apiGet(`/orders/${id}`, { ...opciones, auth: true })

/** Crea el cobro del pedido en Mercado Pago y devuelve { url } del formulario de pago. */
export const pagarConMercadoPago = (id) => apiPost(`/orders/${id}/mercadopago`, { auth: true })

/** Le pregunta a Mercado Pago por el pago del pedido (al volver de pagar). Devuelve { result, order }. */
export const conciliarPago = (id) => apiPost(`/orders/${id}/mercadopago/sync`, { auth: true })

/** El cliente cancela su pedido (solo si no se pago y el local no empezo a prepararlo). */
export const cancelarMiPedido = (id) => apiPost(`/orders/${id}/cancel`, { auth: true })

/** El comprobante de compra y pago (PDF, sin valor fiscal) de un pedido con el pago acreditado. */
export const comprobanteDelPedido = (id) => apiBlob(`/orders/${id}/receipt`, { auth: true })
