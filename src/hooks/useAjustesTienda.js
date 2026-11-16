import { useEffect, useState } from 'react'
import { ajustesDeLaTienda } from '../api/tienda.js'
import { hayApi } from '../lib/api.js'

// Los ajustes casi no cambian: se piden una vez y se reutilizan entre el carrito
// y el checkout. Si falla no se guarda el error, para reintentar la proxima vez.
let enCurso = null

/** Olvida lo cargado: la proxima vez se piden de nuevo (por ejemplo, despues de guardarlos en el panel). */
export function invalidarAjustes() {
  enCurso = null
}

function cargar() {
  enCurso ??= ajustesDeLaTienda().catch((error) => {
    enCurso = null
    throw error
  })
  return enCurso
}

/** @returns {object|null} los ajustes, o null mientras llegan o si la API no contesta. */
export function useAjustesTienda() {
  const [ajustes, setAjustes] = useState(null)
  useEffect(() => {
    if (!hayApi) return undefined
    let vigente = true
    cargar()
      .then((a) => vigente && setAjustes(a))
      .catch(() => {})
    return () => {
      vigente = false
    }
  }, [])
  return ajustes
}
