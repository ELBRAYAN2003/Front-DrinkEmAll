// Cuando empezo la espera del pago de un pedido (ms desde 1970), guardado por pedido
// en la pestana. Asi la cuenta regresiva sigue donde estaba si la pagina se recarga o si
// la persona vuelve con "atras" desde Mercado Pago. Sin almacenamiento disponible, cada
// carga empieza de cero: se pierde la persistencia, no el funcionamiento.
export const ESPERA_MAXIMA_MS = 5 * 60 * 1000

const clave = (id) => `drinkemall.pago.${id}`

/** Marca el comienzo de la espera (un intento de pago nuevo). */
export function iniciarEspera(id) {
  try {
    sessionStorage.setItem(clave(id), String(Date.now()))
  } catch {
    // Sin persistencia: la espera empieza al abrir la pantalla.
  }
}

/** Comienzo de la espera de este pedido; si no hay, ahora (y se guarda). */
export function inicioDeEspera(id) {
  try {
    const guardado = Number(sessionStorage.getItem(clave(id)))
    if (Number.isFinite(guardado) && guardado > 0) return guardado
    iniciarEspera(id)
    return Number(sessionStorage.getItem(clave(id))) || Date.now()
  } catch {
    return Date.now()
  }
}
