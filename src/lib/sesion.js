// Sesion de la cuenta: el usuario y sus dos tokens, guardados en el navegador.
//
// Va en localStorage (y no en una cookie) porque el front y la API se sirven por
// separado y el token viaja en un encabezado. Es el compromiso habitual: lo que
// esta en localStorage puede leerlo cualquier script de la pagina, asi que el
// sitio no debe cargar codigo de terceros que no controle.
//
// Si el navegador bloquea el almacenamiento, la sesion sigue funcionando hasta
// que se cierra la pestana: se conserva una copia en memoria.

const CLAVE = 'drinkemall.sesion'

// Evento que avisa a la app cuando la sesion cambia, venga de donde venga:
// un ingreso, un cierre o una renovacion fallida dentro del cliente HTTP.
export const EVENTO_SESION = 'drinkemall:sesion'

let enMemoria = null

function avisar() {
  window.dispatchEvent(new Event(EVENTO_SESION))
}

/** Sesion guardada ({ usuario, accessToken, refreshToken }) o null. */
export function leerSesion() {
  try {
    const crudo = localStorage.getItem(CLAVE)
    const guardada = crudo ? JSON.parse(crudo) : null
    if (guardada?.accessToken && guardada?.refreshToken) return guardada
    return null
  } catch {
    return enMemoria
  }
}

export function guardarSesion(sesion) {
  enMemoria = sesion
  try {
    localStorage.setItem(CLAVE, JSON.stringify(sesion))
  } catch {
    // Sin persistencia: queda la copia en memoria.
  }
  avisar()
}

export function borrarSesion() {
  enMemoria = null
  try {
    localStorage.removeItem(CLAVE)
  } catch {
    // Nada que borrar si el almacenamiento esta bloqueado.
  }
  avisar()
}
