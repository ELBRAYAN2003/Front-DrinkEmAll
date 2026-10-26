// Conformidad de mayoria de edad.
//
// Se guarda con fecha y hora, no como un simple booleano: el issue pide un
// registro auditable, y "true" sin momento no sirve para auditar nada.
//
// OJO: esto es un control de cliente y se saltea borrando el almacenamiento.
// Cuando el checkout hable con el backend, la conformidad tiene que viajar con
// el pedido y validarse tambien del lado del servidor.

const CLAVE_INGRESO = 'drinkemall.edad'
const CLAVE_PEDIDOS = 'drinkemall.edad.pedidos'

function leer(clave) {
  try {
    const crudo = localStorage.getItem(clave)
    return crudo ? JSON.parse(crudo) : null
  } catch {
    return null
  }
}

function escribir(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    // Sin persistencia si el navegador la bloquea: se vuelve a preguntar.
  }
}

/** Conformidad dada al entrar al sitio, o null si todavia no se pregunto. */
export function leerIngreso() {
  const guardado = leer(CLAVE_INGRESO)
  return guardado?.aceptado ? guardado : null
}

export function guardarIngreso() {
  const registro = { aceptado: true, fecha: new Date().toISOString() }
  escribir(CLAVE_INGRESO, registro)
  return registro
}

/**
 * Conformidad especifica de un pedido. Se registra aparte de la del ingreso
 * porque son dos momentos distintos y la que importa para la venta es esta.
 */
export function registrarPedido(detalle = {}) {
  const registro = { fecha: new Date().toISOString(), ...detalle }
  const previos = leer(CLAVE_PEDIDOS) ?? []
  escribir(CLAVE_PEDIDOS, [...previos, registro])
  return registro
}
