import { esCuitValido, esDniValido } from './documento.js'

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

/**
 * Solo los digitos del DNI. Se acepta "12.345.678", "12 345 678" o "12345678" y se
 * guarda siempre igual: el backend exige un DNI por cuenta, y con distintas
 * escrituras dos personas (o la misma) podrian repetirlo sin que se note.
 */
export const normalizarDni = (v) => String(v ?? '').replace(/[.\s-]/g, '')

// La venta de alcohol a menores de 18 esta prohibida (Ley 24.788). El servidor
// repite esta misma comprobacion y es el que decide; aca solo se evita el viaje.
export const EDAD_MINIMA = 18

const FECHA_ISO = /^(\d{4})-(\d{2})-(\d{2})$/

/** Anios cumplidos a la fecha `hoy` (por defecto, hoy), con ambas como "AAAA-MM-DD". */
export function edadEn(nacimiento, hoy = fechaDeHoy()) {
  const [, na, nm, nd] = nacimiento.match(FECHA_ISO).map(Number)
  const [, ha, hm, hd] = hoy.match(FECHA_ISO).map(Number)
  const yaCumplio = hm > nm || (hm === nm && hd >= nd)
  return ha - na - (yaCumplio ? 0 : 1)
}

/** Hoy como "AAAA-MM-DD" en la hora local de la persona (toISOString usaria UTC y puede dar "manana"). */
export function fechaDeHoy(ahora = new Date()) {
  const dos = (n) => String(n).padStart(2, '0')
  return `${ahora.getFullYear()}-${dos(ahora.getMonth() + 1)}-${dos(ahora.getDate())}`
}

/** La fecha mas reciente que todavia permite tener 18 anos hoy: sirve de tope del selector de fechas. */
export function fechaMaximaNacimiento(hoy = fechaDeHoy()) {
  const [a, m, d] = hoy.split('-')
  return `${Number(a) - EDAD_MINIMA}-${m}-${d}`
}

function fechaExiste(iso) {
  const partes = iso.match(FECHA_ISO)
  if (!partes) return false
  const [, a, m, d] = partes.map(Number)
  const f = new Date(Date.UTC(a, m - 1, d))
  return f.getUTCFullYear() === a && f.getUTCMonth() === m - 1 && f.getUTCDate() === d
}

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

  fechaNacimiento: (v) => {
    if (!v) return 'Ingresa tu fecha de nacimiento'
    if (!fechaExiste(v)) return 'La fecha de nacimiento no es valida'
    if (v > fechaDeHoy()) return 'La fecha de nacimiento no puede ser futura'
    if (edadEn(v) < EDAD_MINIMA) return `Tenes que ser mayor de ${EDAD_MINIMA} anos para crear una cuenta`
    return null
  },

  // 7 u 8 digitos: cubre los DNI actuales, tambien los de numeracion baja. Solo
  // se revisa la forma; no se contrasta con ningun registro oficial.
  dni: (v) => {
    const vacio = requerido(v, 'Ingresa tu DNI')
    if (vacio) return vacio
    const digitos = normalizarDni(v)
    if (!/^\d+$/.test(digitos)) return 'El DNI tiene solo numeros'
    return digitos.length >= 7 && digitos.length <= 8 ? null : 'El DNI tiene 7 u 8 numeros'
  },

  // No se recorta: los espacios al principio o al final cuentan como parte de la
  // contrasena. El minimo es el que exige la API al crear la cuenta.
  password: (v) =>
    v.length === 0 ? 'Ingresa una contrasena' : v.length < 8 ? 'Usa al menos 8 caracteres' : null,

  // Facturacion. El numero depende del tipo elegido, por eso recibe los datos.
  facNombre: (v) =>
    requerido(v, 'Ingresa el nombre o la razon social') ??
    (v.trim().length < 2 ? 'El nombre es demasiado corto' : null),

  facDoc: (v, datos) => {
    const vacio = requerido(v, 'Ingresa el numero de documento')
    if (vacio) return vacio
    if (datos?.facTipo === 'CUIT') {
      return esCuitValido(v) ? null : 'El CUIT no es valido (11 digitos y digito verificador correcto)'
    }
    return esDniValido(v) ? null : 'El DNI tiene 7 u 8 numeros'
  },

  facCorreo: (v) =>
    requerido(v, 'Ingresa un correo para enviar la factura') ??
    (CORREO.test(v.trim()) ? null : 'El correo no tiene un formato valido'),

  codigoPostal: (v) =>
    requerido(v, 'Ingresa el codigo postal') ??
    (CODIGO_POSTAL.test(v.trim()) ? null : 'Usa 4 digitos (3500) o el formato CPA (H3500ABC)'),
}

/**
 * Campos que se validan al salir de cada paso.
 * - Paso 1: telefono; la fecha de nacimiento y el DNI si la cuenta no los tiene
 *   (`faltantes`); y los datos de facturacion solo si se eligio "otros datos".
 * - Paso 2: el domicilio solo si hay envio y se eligio "otro domicilio".
 */
export function camposDelPaso(paso, { retiroEnLocal = false, faltantes = [], facturaNueva = false, domicilioNuevo = false } = {}) {
  if (paso === 1) return ['telefono', ...faltantes, ...(facturaNueva ? ['facNombre', 'facDoc', 'facCorreo'] : [])]
  if (paso === 2) return retiroEnLocal || !domicilioNuevo ? [] : ['direccion', 'ciudad', 'codigoPostal']
  return []
}

export function validarCampo(campo, valor, datos) {
  const regla = REGLAS[campo]
  return regla ? regla(String(valor ?? ''), datos) : null
}

/**
 * Errores de un paso, como objeto { campo: mensaje }. Vacio si el paso es valido.
 */
export function validarPaso(paso, datos, opciones = {}) {
  const errores = {}
  for (const campo of camposDelPaso(paso, opciones)) {
    const error = validarCampo(campo, datos[campo], datos)
    if (error) errores[campo] = error
  }
  return errores
}

/** Errores del formulario de ingreso. Solo se pide lo que la API pide. */
export function validarIngreso({ email, password }) {
  const errores = {}
  const correo = validarCampo('email', email)
  if (correo) errores.email = correo
  if (!password) errores.password = 'Ingresa tu contrasena'
  return errores
}

/** Errores del formulario de registro. El telefono es opcional: solo se revisa si se escribio. */
export function validarRegistro(datos) {
  const errores = {}
  for (const campo of ['nombre', 'apellido', 'fechaNacimiento', 'dni', 'email', 'password']) {
    const error = validarCampo(campo, datos[campo])
    if (error) errores[campo] = error
  }
  if (datos.telefono.trim()) {
    const error = validarCampo('telefono', datos.telefono)
    if (error) errores.telefono = error
  }
  if (!errores.password && datos.password !== datos.confirmar) {
    errores.confirmar = 'Las contrasenas no coinciden'
  }
  if (!datos.privacidad) errores.privacidad = 'Acepta la politica de privacidad para crear la cuenta'
  return errores
}

/** Errores al cambiar la contrasena desde "Mi cuenta". */
export function validarCambioPassword({ actual, nueva, confirmar }) {
  const errores = {}
  if (!actual) errores.actual = 'Ingresa tu contrasena actual'
  const error = validarCampo('password', nueva)
  if (error) errores.nueva = error
  else if (nueva === actual) errores.nueva = 'La nueva tiene que ser distinta de la actual'
  else if (nueva !== confirmar) errores.confirmar = 'Las contrasenas no coinciden'
  return errores
}

/**
 * Botón de arrepentimiento: sin cuenta y sin más trámite, solo lo necesario para
 * poder contestar. El contacto es un correo o un teléfono.
 */
export function validarArrepentimiento({ nombre, contacto }) {
  const errores = {}
  if (nombre.trim().length < 2) errores.nombre = 'Ingresa tu nombre'
  const c = contacto.trim()
  const digitos = c.replace(/\D/g, '').length
  const esCorreo = CORREO.test(c)
  const esTelefono = /^[\d\s()+-]+$/.test(c) && digitos >= 8 && digitos <= 13
  if (!c) errores.contacto = 'Ingresa un correo o un telefono para contactarte'
  else if (!esCorreo && !esTelefono) errores.contacto = 'Ingresa un correo o un telefono valido'
  return errores
}
