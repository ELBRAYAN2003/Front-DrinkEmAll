import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Icon from './Icon.jsx'
import { EVENTO_AGREGADO } from '../../lib/anunciarAgregado.js'

// Cartel que confirma que el producto entro al carrito (o que ya esta el maximo). Se va solo.
// `aria-live` hace que un lector de pantalla lo anuncie sin mover el foco.
export default function AvisoCarrito() {
  const [aviso, setAviso] = useState(null)

  useEffect(() => {
    let reloj
    const alAgregar = (e) => {
      clearTimeout(reloj)
      // Un id nuevo reinicia la animacion de entrada si se agrega otro producto enseguida.
      setAviso({ ...e.detail, id: Date.now() })
      reloj = setTimeout(() => setAviso(null), 3200)
    }
    window.addEventListener(EVENTO_AGREGADO, alAgregar)
    return () => {
      window.removeEventListener(EVENTO_AGREGADO, alAgregar)
      clearTimeout(reloj)
    }
  }, [])

  return (
    <div className="aviso-carrito-zona" aria-live="polite" role="status">
      {aviso && (
        <div key={aviso.id} className={`aviso-carrito ${aviso.cantidad > 0 ? '' : 'is-tope'}`.trim()}>
          <Icon name={aviso.cantidad > 0 ? 'check' : 'alert'} size={18} />
          <span>
            {aviso.cantidad > 0 ? (
              <>
                <b>Agregado al carrito</b>
                <small>
                  {aviso.cantidad > 1 ? `${aviso.cantidad} × ` : ''}
                  {aviso.nombre}
                </small>
              </>
            ) : (
              <>
                <b>Ya tenés el máximo disponible</b>
                <small>{aviso.nombre}</small>
              </>
            )}
          </span>
          <Link to="/carrito" onClick={() => setAviso(null)}>
            Ver carrito
          </Link>
        </div>
      )}
    </div>
  )
}
