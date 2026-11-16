import { apiDelete, apiGet, apiPatch, apiPost } from '../lib/api.js'

// Libreta de la cuenta: domicilios y datos de facturacion guardados. Solo lo
// propio: la API contesta 404 ante un id ajeno.

const base = (ruta) => ({
  listar: () => apiGet(`/customers/me/${ruta}`, { auth: true }),
  crear: (datos) => apiPost(`/customers/me/${ruta}`, { body: datos, auth: true }),
  editar: (id, datos) => apiPatch(`/customers/me/${ruta}/${id}`, { body: datos, auth: true }),
  borrar: (id) => apiDelete(`/customers/me/${ruta}/${id}`, { auth: true }),
})

export const domicilios = base('addresses')
export const facturacion = base('billing-profiles')
