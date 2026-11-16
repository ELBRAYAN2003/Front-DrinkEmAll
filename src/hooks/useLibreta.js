import { useCallback, useEffect, useState } from 'react'
import { mensajeDeError } from '../lib/mensajeDeError.js'

/**
 * Lista de la libreta (domicilios o facturacion) con sus acciones. Despues de cada
 * cambio se vuelve a pedir la lista: el servidor decide cual queda como
 * predeterminado, y no se duplica esa regla aca.
 */
export function useLibreta(api) {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)

  const recargar = useCallback(async () => {
    try {
      setItems(await api.listar())
    } catch (e) {
      setError(mensajeDeError(e))
    }
  }, [api])

  useEffect(() => {
    let vigente = true
    api
      .listar()
      .then((lista) => vigente && setItems(lista))
      .catch((e) => vigente && setError(mensajeDeError(e)))
    return () => {
      vigente = false
    }
  }, [api])

  // Devuelve null si salio bien o el mensaje de error, para que el formulario lo muestre.
  const ejecutar = async (accion) => {
    try {
      await accion()
      await recargar()
      setError(null)
      return null
    } catch (e) {
      return mensajeDeError(e)
    }
  }

  return {
    items,
    error,
    crear: (datos) => ejecutar(() => api.crear(datos)),
    editar: (id, datos) => ejecutar(() => api.editar(id, datos)),
    borrar: (id) => ejecutar(() => api.borrar(id)),
    predeterminar: (id) => ejecutar(() => api.editar(id, { isDefault: true })),
  }
}
