// Aviso de "agregaste un producto al carrito": el producto vuela hasta el icono del carrito de la
// cabecera, el contador rebota y aparece un cartel (ver AvisoCarrito). Si la persona pidio menos
// movimiento en su sistema (prefers-reduced-motion) no hay vuelo: queda el cartel y nada mas.

export const EVENTO_AGREGADO = 'drinkemall:agregado'

const reducirMovimiento = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** El icono del carrito en la cabecera (la tienda lo marca con data-carrito-destino); null si no hay (panel). */
const destino = () => document.querySelector('[data-carrito-destino]')

function volar(origen, imagen) {
  const fin = destino()
  if (!origen || !fin || reducirMovimiento() || !origen.getBoundingClientRect) return
  const a = origen.getBoundingClientRect()
  const b = fin.getBoundingClientRect()
  // Sin pantalla donde mostrarlo (elemento oculto, por ejemplo la cabecera en un celular angosto).
  if (b.width === 0 && b.height === 0) return

  const TAM = 56
  const x0 = a.left + a.width / 2 - TAM / 2
  const y0 = a.top + a.height / 2 - TAM / 2
  const x1 = b.left + b.width / 2 - TAM / 2
  const y1 = b.top + b.height / 2 - TAM / 2

  const bicho = document.createElement('div')
  bicho.className = 'vuelo-carrito'
  bicho.setAttribute('aria-hidden', 'true')
  if (imagen) bicho.style.backgroundImage = `url("${String(imagen).replace(/"/g, '%22')}")`
  document.body.appendChild(bicho)

  // Un arco: sube un poco a mitad de camino y termina chico sobre el carrito.
  const dx = x1 - x0
  const animacion = bicho.animate(
    [
      { transform: `translate(${x0}px, ${y0}px) scale(1)`, opacity: 1 },
      { transform: `translate(${x0 + dx * 0.55}px, ${Math.min(y0, y1) - 40}px) scale(0.75)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${x1}px, ${y1}px) scale(0.2)`, opacity: 0.4 },
    ],
    { duration: 700, easing: 'cubic-bezier(.4,.1,.3,1)' },
  )
  const quitar = () => bicho.remove()
  animacion.onfinish = quitar
  animacion.oncancel = quitar
  // Red de seguridad: si la animacion nunca termina (pestaña en segundo plano), no queda colgado.
  setTimeout(quitar, 1500)
}

/**
 * @param origen   el elemento desde donde "sale" el producto (el boton que se toco)
 * @param imagen   url de la foto del producto, para el vuelo
 * @param nombre   nombre del producto, para el cartel
 * @param cantidad cuantas unidades se agregaron (0 = ya estaba el maximo)
 */
export function anunciarAgregado({ origen, imagen, nombre, cantidad = 1 }) {
  if (cantidad > 0) volar(origen, imagen)
  window.dispatchEvent(new CustomEvent(EVENTO_AGREGADO, { detail: { nombre, cantidad } }))
}
