import { useEffect, useState } from 'react'
import { AuthContext } from './authContext.js'
import { EVENTO_SESION, esRolDelComercio, leerSesion, rolDeSesion } from '../lib/sesion.js'
import { cerrarSesion, ingresar, registrar } from '../api/auth.js'

// Estado de la cuenta para toda la app.
//
// La fuente de verdad es lib/sesion.js. Aca solo se refleja en el estado de
// React: se lee una vez al arrancar y se vuelve a leer cada vez que la sesion
// cambia, ya sea por una accion de esta pantalla, por una renovacion fallida
// dentro del cliente HTTP o por un cambio hecho desde otra pestana.

export default function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => leerSesion())

  useEffect(() => {
    const alCambiar = () => setSesion(leerSesion())
    window.addEventListener(EVENTO_SESION, alCambiar)
    // El evento "storage" solo se dispara por cambios de OTRA pestana.
    window.addEventListener('storage', alCambiar)
    return () => {
      window.removeEventListener(EVENTO_SESION, alCambiar)
      window.removeEventListener('storage', alCambiar)
    }
  }, [])

  const valor = {
    usuario: sesion?.usuario ?? null,
    autenticado: Boolean(sesion),
    rol: rolDeSesion(sesion),
    // Cuenta del comercio (vendedor o admin): no compra, atiende los pedidos.
    esPersonal: esRolDelComercio(rolDeSesion(sesion)),
    ingresar,
    registrar,
    salir: cerrarSesion,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
