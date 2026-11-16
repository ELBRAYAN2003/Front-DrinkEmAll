// Reglas de los datos de un producto en el panel. Espejo de lo que valida la API (que es la que
// decide): aca solo se evita el viaje y se da el mensaje junto al campo.

/** "26999,94" o "26999.94" -> 26999.94 (NaN si no es un numero). Los miles con punto no se aceptan: serian ambiguos. */
export const aNumero = (texto) => Number(String(texto).trim().replace(',', '.'))

export const stockValido = (texto) => {
  const t = String(texto).trim()
  return t !== '' && /^\d+$/.test(t)
}

export const precioValido = (texto) => {
  const n = aNumero(texto)
  return String(texto).trim() !== '' && Number.isFinite(n) && n > 0 && n < 100_000_000
}

const URL_O_RUTA = /^(https?:\/\/\S+|\/[^\s?#]+)$/

/** Errores del formulario de alta, por campo. {} si esta todo bien. */
export function validarProductoNuevo(d) {
  const e = {}
  if (d.name.trim().length < 2) e.name = 'Ingresá el nombre del producto.'
  if (!d.categoryId) e.categoryId = 'Elegí una categoría.'
  if (!precioValido(d.price)) e.price = 'Ingresá un precio mayor a 0.'
  if (d.stock.trim() !== '' && !stockValido(d.stock)) e.stock = 'El stock es un número entero, 0 o más.'
  if (d.imageUrl.trim() && !URL_O_RUTA.test(d.imageUrl.trim())) e.imageUrl = 'Tiene que ser una dirección http(s) o una ruta que empiece con /.'
  return e
}
