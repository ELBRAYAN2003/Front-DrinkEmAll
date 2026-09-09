import { useEffect, useState } from 'react'
import { hayApi } from '../lib/api.js'
import { listarCategorias, listarFiltros, listarProductos } from '../api/catalog.js'
import { allProducts, brands as marcasMock, categories as categoriasMock } from '../data/home.js'

// Fuente de datos del catalogo.
//
// Con VITE_API_URL configurada pide a la API: filtra, ordena y pagina en el
// servidor. Sin ella devuelve la maqueta. La pagina de catalogo no necesita
// saber cual de las dos esta activa.

const VACIO = { page: 1, pageSize: 0, total: 0, totalPages: 1 }

// La maqueta usa el id como segmento de URL; la API trae el slug del nombre.
// Igualar la forma acá evita que la pagina tenga dos caminos distintos.
const CATEGORIAS_MOCK = categoriasMock.map((c) => ({ ...c, slug: c.id }))

export function useCategorias() {
  const [categorias, setCategorias] = useState(hayApi ? [] : CATEGORIAS_MOCK)

  useEffect(() => {
    if (!hayApi) return
    const ctrl = new AbortController()
    listarCategorias({ signal: ctrl.signal })
      .then(setCategorias)
      // Si la API no responde, el sidebar cae a las categorias de maqueta en
      // lugar de quedar vacio.
      .catch(() => setCategorias(CATEGORIAS_MOCK))
    return () => ctrl.abort()
  }, [])

  return categorias
}

/**
 * Marcas disponibles y rango de precios reales del catalogo.
 *
 * Sin esto el sidebar tendria que adivinar el tope del control de precio y
 * mostrar una lista de marcas escrita a mano.
 */
export function useFiltros() {
  const [filtros, setFiltros] = useState(() =>
    hayApi
      ? { marcas: [], precio: null, cargando: true }
      : { marcas: marcasMock.map((name) => ({ name, count: 0 })), precio: null, cargando: false },
  )

  useEffect(() => {
    if (!hayApi) return
    const ctrl = new AbortController()
    listarFiltros({ signal: ctrl.signal })
      .then(({ marcas, precio }) => setFiltros({ marcas, precio, cargando: false }))
      .catch(() => setFiltros({ marcas: [], precio: null, cargando: false }))
    return () => ctrl.abort()
  }, [])

  return filtros
}

/**
 * Listado de productos ya filtrado, ordenado y paginado.
 *
 * @param {{
 *   categoryId?: string, page: number, pageSize: number, search?: string,
 *   marcas?: string[], precioMin?: number, precioMax?: number,
 *   orden?: string, soloOferta?: boolean, pausado?: boolean
 * }} opciones
 */
export function useProductos({
  categoryId,
  page,
  pageSize,
  search,
  marcas = [],
  precioMin,
  precioMax,
  orden,
  soloOferta,
  minImagen,
  pausado = false,
}) {
  const [estado, setEstado] = useState(() =>
    hayApi
      ? { productos: [], meta: VACIO, cargando: true, error: null }
      : { productos: allProducts, meta: VACIO, cargando: false, error: null },
  )

  // Un array cambia de identidad en cada render y dispararia el efecto siempre.
  // Comparar por contenido es lo que evita el pedido en bucle.
  const marcasClave = marcas.join(',')

  useEffect(() => {
    if (!hayApi || pausado) return

    const ctrl = new AbortController()
    // El estado solo se toca dentro de los callbacks. Marcar "cargando" de
    // forma sincrona aca dispararia un render en cascada, y ademas dejaria
    // la lista en blanco entre pagina y pagina: manteniendo la anterior
    // hasta que llega la nueva, la transicion no parpadea.
    let vigente = true

    listarProductos({
      page,
      pageSize,
      categoryId,
      search,
      marcas: marcasClave ? marcasClave.split(',') : [],
      precioMin,
      precioMax,
      orden,
      soloOferta,
      minImagen,
      signal: ctrl.signal,
    })
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
  }, [categoryId, page, pageSize, search, marcasClave, precioMin, precioMax, orden, soloOferta, minImagen, pausado])

  // `remoto` le dice a la pagina quien lleva el filtrado y la paginacion.
  return { ...estado, remoto: hayApi }
}

/**
 * Para las tarjetas del hero: por cada categoria pedida, su producto mas barato
 * con foto grande.
 *
 * Devuelve tambien el total de la categoria, que es lo que permite mostrar
 * "desde $X" sobre un precio real en lugar de uno inventado.
 */
export function usePromosDeCategoria(slugs) {
  const categorias = useCategorias()
  const [promos, setPromos] = useState([])

  // Los arrays cambian de identidad en cada render: se comparan por contenido.
  const claveSlugs = slugs.join(',')
  const claveCategorias = categorias.map((c) => c.slug).join(',')

  useEffect(() => {
    if (!hayApi || categorias.length === 0) return

    const ctrl = new AbortController()
    const elegidas = claveSlugs
      .split(',')
      .map((slug) => categorias.find((c) => c.slug === slug))
      .filter(Boolean)

    Promise.all(
      elegidas.map((categoria) =>
        listarProductos({
          categoryId: categoria.id,
          minImagen: 800,
          orden: 'price_asc',
          pageSize: 1,
          signal: ctrl.signal,
        })
          .then(({ productos, meta }) => ({ categoria, producto: productos[0] ?? null, total: meta.total }))
          .catch(() => null),
      ),
    ).then((resultados) => {
      // Se descartan las que no tienen ningun producto con foto presentable:
      // mejor una tarjeta menos que una con la botella dibujada.
      setPromos(resultados.filter((r) => r?.producto))
    })

    return () => ctrl.abort()
  }, [claveSlugs, claveCategorias, categorias])

  return promos
}
