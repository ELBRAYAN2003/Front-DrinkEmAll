// Endpoints del catalogo.

import { apiGet } from '../lib/api.js'
import { adaptarCategoria, adaptarProducto } from '../lib/adapters.js'

/**
 * Listado paginado de productos.
 *
 * Marca, rango de precio y orden se resuelven en el servidor. Hacerlo en el
 * cliente daria un resultado equivocado: con paginacion del servidor, ordenar
 * por precio ordenaria solo los productos de la pagina visible, no el catalogo.
 */
export async function listarProductos({
  page = 1,
  pageSize = 12,
  categoryId,
  search,
  marcas,
  precioMin,
  precioMax,
  orden,
  soloOferta,
  minImagen,
  signal,
} = {}) {
  const res = await apiGet('/products', {
    params: {
      page,
      pageSize,
      categoryId,
      search,
      active: 'true',
      // La API acepta varias marcas separadas por coma.
      brand: marcas?.length ? marcas.join(',') : undefined,
      priceMin: precioMin,
      priceMax: precioMax,
      sort: orden,
      // Ancho minimo de foto. El hero necesita imagenes grandes: las del
      // catalogo van de 225px a 1181px y una chica ahi se ve pixelada.
      minImageWidth: minImagen,
      // Solo se manda cuando esta activo: mandar false traeria los que NO estan
      // en oferta, que no es lo que ofrece el filtro.
      onOffer: soloOferta ? 'true' : undefined,
    },
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

/**
 * Marcas con su cantidad y rango real de precios.
 *
 * El sidebar no puede tener una lista fija de marcas: son casi cuatrocientas y
 * cambian con el catalogo. El rango ademas acota el control de precio, que si
 * no habria que estimar a ojo.
 */
export async function listarFiltros({ signal } = {}) {
  const res = await apiGet('/products/filters', { signal })
  return {
    marcas: res.brands ?? [],
    precio: res.priceRange ?? { min: 0, max: 0 },
  }
}
