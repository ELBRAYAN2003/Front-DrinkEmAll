import { useEffect, useState } from 'react'
import { hayApi } from '../lib/api.js'
import { listarCategorias, listarProductos } from '../api/catalog.js'
import { allProducts, categories as categoriasMock } from '../data/home.js'

// Fuente de datos del catalogo.
//
// Con VITE_API_URL configurada pide a la API y pagina en el servidor. Sin
// ella devuelve la maqueta y pagina en el cliente. La pagina de catalogo no
// necesita saber cual de las dos esta activa.

const VACIO = { page: 1, pageSize: 0, total: 0, totalPages: 1 }

export function useCategorias() {
  const [categorias, setCategorias] = useState(hayApi ? [] : categoriasMock)

  useEffect(() => {
    if (!hayApi) return
    const ctrl = new AbortController()
    listarCategorias({ signal: ctrl.signal })
      .then(setCategorias)
      // Si la API no responde, el sidebar cae a las categorias de maqueta en
      // lugar de quedar vacio.
      .catch(() => setCategorias(categoriasMock))
    return () => ctrl.abort()
  }, [])

  return categorias
}

/**
 * @param {{categoryId?: string, page: number, pageSize: number, search?: string}} opciones
 */
export function useProductos({ categoryId, page, pageSize, search }) {
  const [estado, setEstado] = useState(() =>
    hayApi
      ? { productos: [], meta: VACIO, cargando: true, error: null }
      : { productos: allProducts, meta: VACIO, cargando: false, error: null },
  )

  useEffect(() => {
    if (!hayApi) return

    const ctrl = new AbortController()
    // El estado solo se toca dentro de los callbacks. Marcar "cargando" de
    // forma sincrona aca dispararia un render en cascada, y ademas dejaria
    // la lista en blanco entre pagina y pagina: manteniendo la anterior
    // hasta que llega la nueva, la transicion no parpadea.
    let vigente = true

    listarProductos({ page, pageSize, categoryId, search, signal: ctrl.signal })
      .then(({ productos, meta }) => {
        if (vigente) setEstado({ productos, meta, cargando: false, error: null })
      })
      .catch((err) => {
        if (!vigente || err.name === 'AbortError') return
        setEstado({ productos: [], meta: VACIO, cargando: false, error: err })
      })

    return () => {
      vigente = false
      ctrl.abort()
    }
  }, [categoryId, page, pageSize, search])

  // `remoto` le dice a la pagina quien lleva la paginacion: con la API la
  // hace el servidor, con la maqueta hay que recortar en el cliente.
  return { ...estado, remoto: hayApi }
}
