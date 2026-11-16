import { useContext } from 'react'
import { AuthContext } from '../context/authContext.js'

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth se uso fuera de AuthProvider')
  return contexto
}
