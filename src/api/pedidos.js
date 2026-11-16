import { apiGet } from '../lib/api.js'

// Pedidos online de la persona con sesion iniciada. La API solo devuelve los
// propios: un pedido ajeno contesta 404, igual que uno que no existe.

export const misPedidos = async (opciones) => {
  const r = await apiGet('/orders', { ...opciones, params: { pageSize: 50 }, auth: true })
  return r.data ?? []
}

export const unPedido = (id, opciones) => apiGet(`/orders/${id}`, { ...opciones, auth: true })
