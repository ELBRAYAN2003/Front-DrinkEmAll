// Reglas de validacion del formulario de checkout.
//
// Viven aparte del componente para poder probarlas sin renderizar nada y para
// que el checkout solo se ocupe de mostrar los errores, no de decidirlos.
// Cada regla devuelve el mensaje de error, o null si el valor es valido.

// Letras de cualquier idioma (incluye tildes y la enie), espacios, apostrofo
// y guion: cubre "Maria Jose", "O'Connor" o "Garcia-Lopez".
const SOLO_LETRAS = /^[\p{L}\s'-]+$/u

// Deliberadamente simple: valida la forma algo@dominio.ext. Una expresion que
// pretenda cubrir el estandar completo rechaza direcciones reales; la unica
// verificacion definitiva de un correo es mandarle un mensaje.
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Codigo postal argentino: cuatro digitos (3500) o el formato CPA (H3500ABC).
const CODIGO_POSTAL = /^(\d{4}|[A-Za-z]\d{4}[A-Za-z]{3})$/

const requerido = (v, mensaje) => (v.trim() ? null : mensaje)

const REGLAS = {
  nombre: (v) =>
    requerido(v, 'Ingresa tu nombre') ??
    (v.trim().length < 2 ? 'El nombre es demasiado corto' : null) ??
    (SOLO_LETRAS.test(v.trim()) ? null : 'Usa solo letras'),

  apellido: (v) =>
    requerido(v, 'Ingresa tu apellido') ??
    (v.trim().length < 2 ? 'El apellido es demasiado corto' : null) ??
    (SOLO_LETRAS.test(v.trim()) ? null : 'Usa solo letras'),

  email: (v) =>
    requerido(v, 'Ingresa tu correo') ??
    (CORREO.test(v.trim()) ? null : 'El correo no tiene un formato valido'),

  // Se cuentan solo los digitos: asi se aceptan espacios, guiones, parentesis
  // y el prefijo +54 sin obligar a un formato de escritura.
  telefono: (v) => {
    const vacio = requerido(v, 'Ingresa un telefono de contacto')
    if (vacio) return vacio
    const digitos = v.replace(/\D/g, '').length
    if (digitos < 8) return 'Faltan digitos en el telefono'
    if (digitos > 13) return 'El telefono tiene demasiados digitos'
    return null
  },

  direccion: (v) =>
    requerido(v, 'Ingresa la direccion de entrega') ??
    (v.trim().length < 5 ? 'La direccion es demasiado corta' : null) ??
    (/\d/.test(v) ? null : 'Falta la altura de la calle'),

  ciudad: (v) =>
    requerido(v, 'Ingresa la ciudad') ??
    (v.trim().length < 2 ? 'El nombre de la ciudad es demasiado corto' : null),

  codigoPostal: (v) =>
    requerido(v, 'Ingresa el codigo postal') ??
    (CODIGO_POSTAL.test(v.trim()) ? null : 'Usa 4 digitos (3500) o el formato CPA (H3500ABC)'),
}

/** Campos que se validan al salir de cada paso. */
export const CAMPOS_POR_PASO = {
  1: ['nombre', 'apellido', 'email', 'telefono'],
  2: ['direccion', 'ciudad', 'codigoPostal'],
}

export function validarCampo(campo, valor) {
  const regla = REGLAS[campo]
  return regla ? regla(String(valor ?? '')) : null
}

/**
 * Errores de un paso, como objeto { campo: mensaje }. Vacio si el paso es
 * valido. Con retiro en el local, el paso de entrega no pide domicilio.
 */
export function validarPaso(paso, datos, { retiroEnLocal = false } = {}) {
  if (paso === 2 && retiroEnLocal) return {}
  const errores = {}
  for (const campo of CAMPOS_POR_PASO[paso] ?? []) {
    const error = validarCampo(campo, datos[campo])
    if (error) errores[campo] = error
  }
  return errores
}
