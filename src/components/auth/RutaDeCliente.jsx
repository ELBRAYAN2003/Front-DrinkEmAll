import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'

// Pantallas de compra y de "mis pedidos": requieren sesion y son de clientes. Una cuenta
// del comercio no compra: va al panel (a `destinoPersonal`, que puede ser una funcion de
// la ruta para llevarla al mismo pedido en el panel).
export default function RutaDeCliente({ children, aviso, destinoPersonal = '/panel' }) {
  const { autenticado, esPersonal } = useAuth()
  const ubicacion = useLocation()
  if (!autenticado) return <Navigate to="/ingresar" replace state={{ desde: ubicacion.pathname, aviso }} />
  if (esPersonal) {
    return <Navigate to={typeof destinoPersonal === 'function' ? destinoPersonal(ubicacion) : destinoPersonal} replace />
  }
  return children
}
