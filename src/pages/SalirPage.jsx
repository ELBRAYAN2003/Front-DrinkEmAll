import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'

// Cierra la sesion y redirige. Existe como ruta propia, y sin proteccion, para
// evitar una carrera: si "Mi cuenta" cerrara la sesion y navegara a la vez, la
// ruta protegida veria que ya no hay sesion y mandaria a ingresar antes de que
// termine la navegacion pedida, pisando el destino y el aviso.
//
// Desde aca no hay nada protegido que re-dibujar, asi que el orden da igual.
export default function SalirPage() {
  const { salir } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()

  useEffect(() => {
    // Sin esperar la respuesta de la API: la sesion local ya se borra al
    // instante y la persona no tiene por que esperar al servidor para salir.
    salir()
    navigate(state?.destino ?? '/', {
      replace: true,
      state: state?.aviso ? { aviso: state.aviso } : null,
    })
  }, [navigate, salir, state])

  return null
}
