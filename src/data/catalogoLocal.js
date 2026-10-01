// Catalogo local, leido de public/productos.json.
//
// Ese archivo es el almacenamiento estatico del catalogo: cuando no hay API
// configurada, los productos que muestra la tienda salen de ahi y no de una
// constante escrita en el codigo.
//
// Se importa por ruta en vez de pedirlo con fetch para que los hooks sigan
// siendo sincronos. El archivo igual queda servido en /productos.json, asi
// que hay una sola fuente y no se puede desincronizar.

import catalogo from '../../public/productos.json'

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

export const productosLocales = (catalogo.productos ?? []).map(adaptar)

/** Categorias con su conteo, derivadas del propio archivo. */
export const categoriasLocales = Object.values(
  productosLocales.reduce((acc, p) => {
    acc[p.category] ??= { id: p.category, slug: p.category, name: p.categoryName, count: 0 }
    acc[p.category].count++
    return acc
  }, {}),
).sort((a, b) => a.name.localeCompare(b.name, 'es'))

/** Marcas con su conteo, tambien derivadas del archivo. */
export const marcasLocales = Object.values(
  productosLocales.reduce((acc, p) => {
    if (!p.brand) return acc
    acc[p.brand] ??= { name: p.brand, count: 0 }
    acc[p.brand].count++
    return acc
  }, {}),
).sort((a, b) => a.name.localeCompare(b.name, 'es'))
