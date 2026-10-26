// Fotos de las categorias.
//
// La API no expone una foto por categoria. Las de public/img/categorias salen
// del propio catalogo: para cada una se eligio una botella de marca conocida y
// se la recorto al objeto, asi la tienda muestra lo que realmente vende y no
// imagenes ajenas.
//
// Cada archivo se llama como el slug de su categoria. Una categoria nueva sin
// foto cae a la placa de color generada, sin romper nada.

const CON_FOTO = new Set([
  'vinos',
  'espumantes',
  'gin',
  'whisky',
  'aperitivos',
  'fernet',
  'licores',
  'vodka',
  'cervezas',
  'ron',
  'combos',
  'tequila',
  'regaleria',
  'pisco',
  'ginebra',
  'conac',
  'aguardiente',
])

// El catalogo estatico usa otros slugs ("tinto", "destilado"...): se apuntan a
// la foto de la categoria equivalente. "sin-alcohol" no tiene y queda sin foto.
const EQUIVALENTE = {
  tinto: 'vinos',
  blanco: 'vinos',
  rosado: 'vinos',
  espumante: 'espumantes',
  cerveza: 'cervezas',
  destilado: 'whisky',
}

/** URL de la foto de la categoria, o null si no tiene. */
export function fotoDeCategoria(slug) {
  const archivo = CON_FOTO.has(slug) ? slug : EQUIVALENTE[slug]
  return archivo ? `${import.meta.env.BASE_URL}img/categorias/${archivo}.webp` : null
}
