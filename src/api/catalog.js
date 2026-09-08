// Endpoints del catalogo.

import { apiGet } from '../lib/api.js'
import { adaptarCategoria, adaptarProducto } from '../lib/adapters.js'

/**
 * Listado paginado de productos.
 *
 * El backend acepta page, pageSize, categoryId, search y active. NO acepta
 * marca, rango de precio ni orden: eso se resuelve en el cliente sobre la
 * pagina recibida, con la limitacion que implica.
 */
export async function listarProductos({ page = 1, pageSize = 12, categoryId, search, signal } = {}) {
  const res = await apiGet('/products', {
    params: { page, pageSize, categoryId, search, active: 'true' },
    signal,
  })
  return {
    productos: (res.data ?? []).map(adaptarProducto),
    meta: res.meta ?? { page, pageSize, total: 0, totalPages: 1 },
  }
}

export async function obtenerProducto(id, { signal } = {}) {
  return adaptarProducto(await apiGet(`/products/${id}`, { signal }))
}

/** Las categorias vienen paginadas; se pide una pagina amplia de una vez. */
export async function listarCategorias({ signal } = {}) {
  const res = await apiGet('/categories', { params: { pageSize: 100 }, signal })
  return (res.data ?? []).map(adaptarCategoria)
}
