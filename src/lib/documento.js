// Documentos para facturar. Espejo de lo que valida el servidor (que es el que
// decide): aca solo se evita el viaje y se da el mensaje al lado del campo.
//
// DNI: 7 u 8 digitos. CUIT/CUIL: 11 digitos, prefijo de tipo de persona valido y
// digito verificador correcto (modulo 11). No se consulta ningun registro oficial.

const PREFIJOS_CUIT = [20, 23, 24, 27, 30, 33, 34]
const PESOS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]

/** Solo digitos: "20-12345678-6" y "20 12345678 6" se guardan igual. */
export const soloDigitos = (valor) => String(valor ?? '').replace(/[.\s-]/g, '')

export function esCuitValido(valor) {
  const cuit = soloDigitos(valor)
  if (!/^\d{11}$/.test(cuit)) return false
  if (!PREFIJOS_CUIT.includes(Number(cuit.slice(0, 2)))) return false
  const suma = PESOS.reduce((acc, peso, i) => acc + peso * Number(cuit[i]), 0)
  const resto = suma % 11
  const esperado = resto === 0 ? 0 : 11 - resto
  return esperado !== 10 && esperado === Number(cuit[10])
}

export const esDniValido = (valor) => /^\d{7,8}$/.test(soloDigitos(valor))

/** "DNI 12.345.678" o "CUIT 20-12345678-6", para mostrar. */
export function formatoDocumento(tipo, numero) {
  const n = soloDigitos(numero)
  if (tipo === 'CUIT' && n.length === 11) return `CUIT ${n.slice(0, 2)}-${n.slice(2, 10)}-${n.slice(10)}`
  return `${tipo} ${n.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
}
