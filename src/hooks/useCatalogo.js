import { useEffect, useState } from 'react'
import { hayApi } from '../lib/api.js'
import { listarCategorias, listarFiltros, listarProductos, obtenerProducto } from '../api/catalog.js'
import { cargarCatalogoLocal } from '../data/catalogoLocal.js'

// Fuente de datos del catalogo.
//
// Con VITE_API_URL configurada pide a la API: filtra, ordena y pagina en el
// servidor. Sin ella lee el catalogo estatico de public/productos.json con la
// Fetch API. La pagina de catalogo no necesita saber cual de las dos esta
// activa; para eso devolvemos `remoto`.
//
// Las dos fuentes son asincronas, asi que todos los hooks de abajo arrancan en
// "cargando" y se resuelven dentro de una funcion async: el archivo estatico es
// tambien el plan B cuando la API no contesta.

const VACIO = { page: 1, pageSize: 0, total: 0, totalPages: 1 }

/**
 * Categorias que realmente tienen productos.
 *
 * Las vacias se descartan aca y no en cada componente: cuatro de las veinte no
 * tienen ni un producto, y ofrecerlas en el menu o en el sidebar lleva a una
 * pagina que dice "no hay productos".
 */
export function useCategorias() {
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    const ctrl = new AbortController()
    let vigente = true

    const cargar = async () => {
      if (hayApi) {
        try {
          const todas = await listarCategorias({ signal: ctrl.signal })
          if (vigente) setCategorias(todas.filter((c) => c.count > 0))
          return
        } catch (error) {
          // Si la API no responde se sigue al archivo estatico, en lugar de
          // dejar el menu vacio.
          if (!vigente || error.name === 'AbortError') return
        }
      }

      try {
        const { categorias: locales } = await cargarCatalogoLocal()
        if (vigente) setCategorias(locales)
      } catch {
        // Sin API y sin archivo no hay menu de categorias: queda vacio, que es
        // lo unico honesto que se puede mostrar.
      }
    }

    cargar()

    return () => {
      vigente = false
      ctrl.abort()
    }
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
  const [filtros, setFiltros] = useState({ marcas: [], precio: null, cargando: true })

  useEffect(() => {
    const ctrl = new AbortController()
    let vigente = true

    const cargar = async () => {
      if (hayApi) {
        try {
          const { marcas, precio } = await listarFiltros({ signal: ctrl.signal })
          if (vigente) setFiltros({ marcas, precio, cargando: false })
          return
        } catch (error) {
          if (!vigente || error.name === 'AbortError') return
        }
      }

      try {
        const { marcas } = await cargarCatalogoLocal()
        // El archivo no trae rango de precios: el sidebar lo deduce de los
        // productos que tenga a mano.
        if (vigente) setFiltros({ marcas, precio: null, cargando: false })
      } catch {
        if (vigente) setFiltros({ marcas: [], precio: null, cargando: false })
      }
    }

    cargar()

    return () => {
      vigente = false
      ctrl.abort()
    }
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
  const [estado, setEstado] = useState({ productos: [], meta: VACIO, cargando: true, error: null })

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

  // Sin API: una sola lectura del archivo estatico, que trae el catalogo
  // completo. Filtrar, ordenar y paginar queda del lado de la pagina, que para
  // eso mira `remoto`. Va en su propio efecto, sin dependencias, porque los
  // filtros no cambian lo que hay que leer.
  useEffect(() => {
    if (hayApi) return

    let vigente = true

    const cargar = async () => {
      try {
        const { productos } = await cargarCatalogoLocal()
        if (vigente) setEstado({ productos, meta: VACIO, cargando: false, error: null })
      } catch (error) {
        if (vigente) setEstado({ productos: [], meta: VACIO, cargando: false, error })
      }
    }

    cargar()

    return () => {
      vigente = false
    }
  }, [])

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

  // Sin API el archivo estatico no trae foto grande ni ofertas: el hero se
  // queda con sus tarjetas fijas en lugar de inventar promociones.
  useEffect(() => {
    if (hayApi) return

    let vigente = true

    const cargar = async () => {
      try {
        const { productos, categorias: locales } = await cargarCatalogoLocal()
        const elegidas = claveSlugs
          .split(',')
          .map((slug) => locales.find((c) => c.slug === slug))
          .filter(Boolean)

        const armadas = elegidas
          .map((categoria) => {
            const deLaCategoria = productos.filter((p) => p.category === categoria.slug)
            const masBarato = deLaCategoria.reduce(
              (menor, p) => (menor === null || p.price < menor.price ? p : menor),
              null,
            )
            return { categoria, producto: masBarato, total: deLaCategoria.length }
          })
          .filter((promo) => promo.producto)

        if (vigente) setPromos(armadas)
      } catch {
        // Hero sin tarjetas de promocion: el resto de la portada no depende
        // de esto.
      }
    }

    cargar()

    return () => {
      vigente = false
    }
  }, [claveSlugs])

  return promos
}


/**
 * Un producto por id, para la pagina de detalle.
 *
 * Con API pide /products/:id. Sin ella lo busca en el archivo estatico, asi el
 * detalle se puede recorrer con el backend apagado.
 */
export function useProducto(id) {
  // El id pedido viaja dentro del estado: mientras no coincida con el de la
  // URL, lo que hay guardado es del producto anterior y todavia no se puede
  // mostrar. Es la forma de marcar "cargando" sin tocar el estado de manera
  // sincrona en el efecto.
  const [estado, setEstado] = useState({ id: null, producto: null, error: null })

  useEffect(() => {
    const ctrl = new AbortController()
    let vigente = true

    const cargar = async () => {
      if (hayApi) {
        try {
          const producto = await obtenerProducto(id, { signal: ctrl.signal })
          if (vigente) setEstado({ id, producto, error: null })
        } catch (error) {
          if (!vigente || error.name === 'AbortError') return
          setEstado({ id, producto: null, error })
        }
        return
      }

      try {
        const { productos } = await cargarCatalogoLocal()
        if (vigente) setEstado({ id, producto: productos.find((p) => p.id === id) ?? null, error: null })
      } catch (error) {
        if (vigente) setEstado({ id, producto: null, error })
      }
    }

    cargar()

    return () => {
      vigente = false
      ctrl.abort()
    }
  }, [id])

  const resuelto = estado.id === id

  return {
    producto: resuelto ? estado.producto : null,
    cargando: !resuelto,
    error: resuelto ? estado.error : null,
  }
}
