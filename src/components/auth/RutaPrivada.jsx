import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'

// Envuelve una pagina que necesita sesion. Si no hay, manda a ingresar y
// recuerda adonde iba para volver ahi despues. `aviso` es opcional: explica por que
// se pide ingresar (por ejemplo, "para finalizar la compra").
export default function RutaPrivada({ children, aviso }) {
  const { autenticado } = useAuth()
  const ubicacion = useLocation()

  if (!autenticado) {
    return <Navigate to="/ingresar" replace state={{ desde: ubicacion.pathname, aviso }} />
  }
  return children
}
