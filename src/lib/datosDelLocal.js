// Reglas de los datos del local que edita el comercio. Espejo de lo que valida la API (que es
// la que decide): aca solo se evita el viaje y se da el mensaje junto al campo.
import { esCuitValido, soloDigitos } from './documento.js'

export const ALIAS = /^[A-Za-z0-9.-]{6,20}$/

/** Errores de cada campo, o {} si todo esta bien. Los campos vacios son validos (borran el dato). */
export function validarDatosDelLocal(d) {
  const e = {}
  if (d.transferAlias.trim() && !ALIAS.test(d.transferAlias.trim())) {
    e.transferAlias = 'El alias tiene de 6 a 20 caracteres: letras, números, puntos y guiones.'
  }
  const cbu = soloDigitos(d.transferCbu)
  if (cbu && !/^\d{22}$/.test(cbu)) e.transferCbu = 'El CBU/CVU tiene 22 números.'
  if (soloDigitos(d.transferCuit) && !esCuitValido(d.transferCuit)) {
    e.transferCuit = 'El CUIT no es válido (11 números y dígito verificador correcto).'
  }
  for (const campo of ['shippingCost', 'freeShippingFrom']) {
    const valor = String(d[campo]).replace(',', '.').trim()
    if (valor === '' || !Number.isFinite(Number(valor)) || Number(valor) < 0) e[campo] = 'Indicá un importe de 0 o más.'
  }
  return e
}

/** Agrupa el CBU/CVU de a 4 digitos para leerlo y dictarlo: "0000 0031 0001 2345 6789 01". */
export const cbuLegible = (cbu) => soloDigitos(cbu).replace(/(\d{4})(?=\d)/g, '$1 ')
