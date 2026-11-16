import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import Icon from '../ui/Icon.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { leerIngreso } from '../../lib/edad.js'
import { esVisitaNueva, marcarVisita } from '../../lib/visita.js'

// Pantallas donde la invitacion estorba o no tiene sentido: son de la cuenta
// misma, o es el checkout, que ya pide ingresar.
const SIN_INVITACION = ['/ingresar', '/registro', '/mi-cuenta', '/salir', '/checkout']

// Recomienda crear una cuenta a quien entra por primera vez. No bloquea nada: se
// puede cerrar, y sin cuenta se navega y se arma el carrito igual. La cuenta solo
// es obligatoria para finalizar la compra.
export default function InvitacionCuenta() {
  const { autenticado } = useAuth()
  const { pathname } = useLocation()
  // Se decide una vez, al cargar: marcar la visita mas adelante no cambia que
  // esta SI era una visita nueva.
  const [nueva] = useState(() => esVisitaNueva())
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!nueva || autenticado || visible) return
    // Se espera a que la persona haya respondido la puerta de edad: dos carteles
    // juntos al entrar serian demasiado. Se revisa cada tanto, sin bloquear.
    const id = setInterval(() => {
      if (!leerIngreso()) return
      clearInterval(id)
      marcarVisita()
      setVisible(true)
    }, 1500)
    return () => clearInterval(id)
  }, [nueva, autenticado, visible])

  if (!visible || autenticado || SIN_INVITACION.includes(pathname)) return null

  const cerrar = () => setVisible(false)

  return (
    <aside className="invitacion" role="complementary" aria-label="Invitacion a crear una cuenta">
      <button type="button" className="invitacion-cerrar" onClick={cerrar} aria-label="Cerrar">
        <Icon name="close" size={16} />
      </button>
      <span className="invitacion-icono" aria-hidden="true">
        <Icon name="user" size={22} />
      </span>
      <div>
        <b>Crea tu cuenta</b>
        <p>
          Es gratis y la vas a necesitar para finalizar tu compra. Mientras tanto podes mirar y
          armar el carrito sin cuenta.
        </p>
        <div className="invitacion-acciones">
          <Link className="btn btn-primary" to="/registro" onClick={cerrar}>
            Crear cuenta
          </Link>
          <button type="button" className="btn btn-ghost" onClick={cerrar}>
            Ahora no
          </button>
        </div>
      </div>
    </aside>
  )
}
