// Catalogo local, leido de public/productos.json con la Fetch API.
//
// Ese archivo es el almacenamiento estatico del catalogo: cuando no hay API
// configurada, los productos que muestra la tienda salen de ahi y no de una
// constante escrita en el codigo.
//
// Se pide con fetch en lugar de importarlo: el JSON queda fuera del bundle, lo
// cachea el navegador como cualquier otro archivo y se puede corregir un precio
// editando /productos.json en el servidor sin volver a compilar la tienda. El
// costo es que la lectura es asincrona, y de eso se ocupan los hooks.

import { fotoDeCategoria } from '../lib/categoriaFoto.js'
import { tileImage } from '../lib/placeholder.js'

// BASE_URL respeta el "base" de Vite: la ruta sigue sirviendo aunque la tienda
// se publique dentro de un subdirectorio.
const RUTA = `${import.meta.env.BASE_URL}productos.json`

/** Producto del archivo -> forma que consumen los componentes. */
function adaptar(p) {
  return {
    id: p.id,
    name: p.nombre,
    brand: p.marca ?? '',
    price: Number(p.precio_simulado),
    // El esquema del archivo no modela ofertas ni reseñas: se dejan vacios en
    // vez de inventarlos, y la interfaz se degrada sin romperse.
    oldPrice: null,
    rating: 0,
    reviews: null,
    stock: Number(p.stock ?? 0),
    badges: Number(p.stock ?? 0) === 0 ? ['agotado'] : [],
    dealEndsAt: null,
    notes: (p.descripcion ?? '')
      .split(/\.\s+|\n/)
      .map((s) => s.trim().replace(/\.$/, ''))
      .filter(Boolean)
      .slice(0, 3),
    image: p.imagen_ia_url,
    hoverImage: p.imagen_ia_url,
    category: p.categoria_slug,
    categoryId: p.categoria_slug,
    categoryName: p.categoria,
  }
}

/** Categorias con su conteo, derivadas de los propios productos. */
function derivarCategorias(productos) {
  return Object.values(
    productos.reduce((acc, p) => {
      if (!acc[p.category]) {
        const foto = fotoDeCategoria(p.category)
        acc[p.category] = {
          id: p.category,
          slug: p.category,
          name: p.categoryName,
          count: 0,
          image: foto ?? tileImage(),
          conFoto: Boolean(foto),
        }
      }
      acc[p.category].count++
      return acc
    }, {}),
  ).sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

/** Marcas con su conteo, tambien derivadas de los productos. */
function derivarMarcas(productos) {
  return Object.values(
    productos.reduce((acc, p) => {
      if (!p.brand) return acc
      acc[p.brand] ??= { name: p.brand, count: 0 }
      acc[p.brand].count++
      return acc
    }, {}),
  ).sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

async function pedirCatalogo() {
  const respuesta = await fetch(RUTA, { headers: { Accept: 'application/json' } })
  if (!respuesta.ok) {
    throw new Error(`No se pudo leer el catalogo estatico (HTTP ${respuesta.status})`)
  }

  const archivo = await respuesta.json()
  const productos = (archivo.productos ?? []).map(adaptar)

  return {
    productos,
    categorias: derivarCategorias(productos),
    marcas: derivarMarcas(productos),
  }
}

// El archivo es el mismo durante toda la visita, asi que se guarda la promesa:
// los cuatro hooks que lo necesitan comparten un unico pedido. Si falla se
// borra, para que el proximo intento vuelva a pedirlo en vez de repetir el
// error para siempre.
let pedido = null

/**
 * Catalogo estatico ya adaptado: { productos, categorias, marcas }.
 *
 * Una sola lectura de red por visita, aunque se llame desde varios hooks.
 */
export function cargarCatalogoLocal() {
  pedido ??= pedirCatalogo().catch((error) => {
    pedido = null
    throw error
  })
  return pedido
}
