import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'

// Pantallas del panel: solo cuentas del comercio (vendedor, admin). Sin sesion se manda a
// ingresar y se vuelve aca; un cliente vuelve a la tienda. Es para decidir que mostrar:
// quien decide si algo se puede hacer es la API (cada accion exige el rol).
export default function RutaDelComercio({ children }) {
  const { autenticado, esPersonal } = useAuth()
  const ubicacion = useLocation()
  if (!autenticado) {
    return <Navigate to="/ingresar" replace state={{ desde: ubicacion.pathname, aviso: 'Ingresá con tu cuenta del comercio.' }} />
  }
  if (!esPersonal) return <Navigate to="/" replace />
  return children
}
