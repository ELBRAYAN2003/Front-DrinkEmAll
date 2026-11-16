import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Carga al entrar y vuelve a cargar al volver a la pestana, sin polling: el estado
 * de un pedido cambia cuando el local lo avanza, no cada segundo. `actualizar`
 * sirve para el boton manual.
 */
export function useRecarga(cargar) {
  const [actualizando, setActualizando] = useState(false)
  const vigente = useRef(true)

  const actualizar = useCallback(async () => {
    setActualizando(true)
    try {
      await cargar()
    } finally {
      if (vigente.current) setActualizando(false)
    }
  }, [cargar])

  useEffect(() => {
    vigente.current = true
    // La primera carga no pasa por `actualizar`: no hace falta el aviso de "Actualizando".
    cargar()
    const alVolver = () => {
      if (document.visibilityState === 'visible') cargar()
    }
    document.addEventListener('visibilitychange', alVolver)
    return () => {
      vigente.current = false
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [cargar])

  return { actualizando, actualizar }
}
