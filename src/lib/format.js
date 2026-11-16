// Formateo compartido. Vive fuera de los componentes para no romper el fast
// refresh de Vite (un archivo de componente solo debe exportar componentes).

export const money = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

/** 12345678 -> 12.345.678 (con 7 digitos: 1.234.567). Si no es solo numeros, se deja como esta. */
export function formatoDni(dni) {
  const d = String(dni ?? '')
  return /^\d{7,8}$/.test(d) ? d.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : d
}

/** "1996-11-16" -> "16/11/1996". Se arma a mano: pasar por Date movería el día según la zona horaria. */
export function formatoFecha(iso) {
  const m = String(iso ?? '').match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : String(iso ?? '')
}
