// Recuerda si la persona ya visito el sitio antes, para invitarla a crear una
// cuenta solo la primera vez y no insistir en cada visita.
//
// Se guarda en localStorage y no en una cookie: es un dato que solo le sirve al
// navegador (no viaja al servidor en cada pedido) y no identifica a nadie. Igual
// se declara en la Politica de privacidad.
//
// Si el navegador bloquea el almacenamiento no se puede recordar la respuesta, asi
// que se asume "ya visito": invitar en cada carga seria peor que no invitar.

const CLAVE = 'drinkemall.visita'

/** true si es la primera vez que esta persona abre el sitio en este navegador. */
export function esVisitaNueva() {
  try {
    return localStorage.getItem(CLAVE) === null
  } catch {
    return false
  }
}

/** Anota que ya se le mostro la invitacion, con la fecha. */
export function marcarVisita() {
  try {
    localStorage.setItem(CLAVE, new Date().toISOString())
  } catch {
    // Sin almacenamiento no se recuerda; esVisitaNueva() ya devuelve false.
  }
}
