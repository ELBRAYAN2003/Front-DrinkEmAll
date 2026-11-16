import { apiGet, apiPatch, apiPost } from '../lib/api.js'

// Ajustes publicos de la tienda y pedidos online. Los importes que se muestran
// salen de aca: el que cobra es siempre el servidor.

/** Costo de envio, envio gratis desde, medios de pago online y datos de retiro. */
export const ajustesDeLaTienda = (opciones) => apiGet('/shop/settings', opciones)

/** Medios de pago cargados en la API ({ id, name }); el pedido necesita el id. */
export const mediosDePago = async (opciones) => {
  const r = await apiGet('/payment-methods', { ...opciones, params: { pageSize: 50 } })
  return r.data ?? r
}

/** Completa datos que la ficha no tenia (telefono, fecha de nacimiento, DNI). */
export const completarPerfil = (datos) => apiPatch('/customers/me', { body: datos, auth: true })

export const crearPedido = (pedido) => apiPost('/orders', { body: pedido, auth: true })
