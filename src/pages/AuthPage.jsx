import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import Campo from '../components/ui/Campo.jsx'
import Icon from '../components/ui/Icon.jsx'
import { hayApi } from '../lib/api.js'
import { useAuth } from '../hooks/useAuth.js'
import { fechaMaximaNacimiento, validarIngreso, validarRegistro } from '../lib/validacion.js'
import { mensajeDeError } from '../lib/mensajeDeError.js'

const VACIO_INGRESO = { email: '', password: '' }
const VACIO_REGISTRO = {
  nombre: '',
  apellido: '',
  fechaNacimiento: '',
  dni: '',
  email: '',
  telefono: '',
  password: '',
  confirmar: '',
  privacidad: false,
}

// Una sola pantalla para ingresar y para crear la cuenta: comparten estructura y
// manejo de errores, y cambian los campos. El modo lo fija la ruta.
export default function AuthPage({ modo }) {
  const registro = modo === 'registro'
  const { autenticado, ingresar, registrar } = useAuth()
  const ubicacion = useLocation()
  // Adonde volver despues de entrar (lo pone RutaPrivada) y un aviso opcional
  // (por ejemplo, "cambiaste tu contrasena").
  const desde = ubicacion.state?.desde ?? null
  const aviso = ubicacion.state?.aviso ?? null

  const [datos, setDatos] = useState(registro ? VACIO_REGISTRO : VACIO_INGRESO)
  // Un campo solo muestra su error despues de que la persona lo visito, para no
  // recibirla con el formulario entero en rojo.
  const [tocados, setTocados] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorApi, setErrorApi] = useState(null)

  // Los errores se derivan de los datos en cada dibujado: asi nunca quedan
  // desactualizados respecto de lo que hay escrito.
  const errores = registro ? validarRegistro(datos) : validarIngreso(datos)
  const errorDe = (campo) => (tocados[campo] ? errores[campo] : null)

  // Al ingresar o registrarse con exito la sesion cambia y esto redirige solo.
  if (autenticado) return <Navigate to={desde ?? '/mi-cuenta'} replace />

  const cambiar = (campo, valor) => setDatos((previos) => ({ ...previos, [campo]: valor }))
  const salir = (campo) => setTocados((previos) => ({ ...previos, [campo]: true }))

  const enviar = async (e) => {
    e.preventDefault()
    setTocados(Object.fromEntries(Object.keys(datos).map((campo) => [campo, true])))
    if (Object.keys(errores).length > 0) return

    setEnviando(true)
    setErrorApi(null)
    try {
      if (registro) await registrar(datos)
      else await ingresar(datos.email, datos.password)
    } catch (error) {
      setErrorApi(mensajeDeError(error))
    } finally {
      setEnviando(false)
    }
  }

  const campo = (nombre, etiqueta, extra = {}) => (
    <Campo
      campo={nombre}
      etiqueta={etiqueta}
      valor={datos[nombre]}
      error={errorDe(nombre)}
      onCambio={cambiar}
      onSalida={salir}
      {...extra}
    />
  )

  return (
    <main className="auth">
      <div className="wrap">
        <div className="auth-card">
          <h1>{registro ? 'Crear cuenta' : 'Ingresar'}</h1>
          <p className="auth-sub">
            {registro
              ? 'Con tu cuenta podes comprar y seguir tus pedidos. Tenes que ser mayor de 18 anos.'
              : 'Ingresa para comprar y seguir tus pedidos.'}
          </p>

          {aviso && (
            <p className="auth-aviso" role="status">
              <Icon name="check" size={16} />
              {aviso}
            </p>
          )}

          {!hayApi && (
            <p className="auth-error" role="alert">
              <Icon name="alert" size={16} />
              Las cuentas necesitan la conexion con el servidor, que todavia no esta configurada.
            </p>
          )}

          <form onSubmit={enviar} noValidate>
            <div className="fields">
              {registro ? (
                <>
                  {campo('nombre', 'Nombre', { type: 'text', autoComplete: 'given-name' })}
                  {campo('apellido', 'Apellido', { type: 'text', autoComplete: 'family-name' })}
                  {campo('fechaNacimiento', 'Fecha de nacimiento', {
                    type: 'date',
                    autoComplete: 'bday',
                    min: '1900-01-01',
                    max: fechaMaximaNacimiento(),
                  })}
                  {campo('dni', 'DNI', {
                    type: 'text',
                    inputMode: 'numeric',
                    autoComplete: 'off',
                    placeholder: 'Solo numeros',
                  })}
                  {campo('email', 'Correo', { type: 'email', autoComplete: 'email', ancho: true })}
                  {campo('telefono', 'Telefono (opcional)', {
                    type: 'tel',
                    autoComplete: 'tel',
                    placeholder: '+54 9 362 000 0000',
                    ancho: true,
                  })}
                  {campo('password', 'Contrasena', {
                    type: 'password',
                    autoComplete: 'new-password',
                    placeholder: 'Al menos 8 caracteres',
                    ancho: true,
                  })}
                  {campo('confirmar', 'Repetir la contrasena', {
                    type: 'password',
                    autoComplete: 'new-password',
                    ancho: true,
                  })}
                </>
              ) : (
                <>
                  {campo('email', 'Correo', { type: 'email', autoComplete: 'email', ancho: true })}
                  {campo('password', 'Contrasena', {
                    type: 'password',
                    autoComplete: 'current-password',
                    ancho: true,
                  })}
                </>
              )}
            </div>

            {registro && (
              <div className="auth-checks">
                <label className="check">
                  <input
                    type="checkbox"
                    checked={datos.privacidad}
                    onChange={(e) => cambiar('privacidad', e.target.checked)}
                    onBlur={() => salir('privacidad')}
                  />
                  <span>
                    Lei y acepto la{' '}
                    <Link to="/privacidad" target="_blank" rel="noopener">
                      Politica de privacidad
                    </Link>
                    .
                  </span>
                </label>
                {errorDe('privacidad') && <em className="field-error">{errorDe('privacidad')}</em>}
              </div>
            )}

            {errorApi && (
              <p className="auth-error" role="alert">
                <Icon name="alert" size={16} />
                {errorApi}
              </p>
            )}

            <button type="submit" className="btn btn-primary auth-submit" disabled={enviando || !hayApi}>
              {enviando ? 'Un momento...' : registro ? 'Crear cuenta' : 'Ingresar'}
            </button>
          </form>

          <p className="auth-switch">
            {registro ? (
              <>
                Ya tenes cuenta?{' '}
                <Link to="/ingresar" state={ubicacion.state}>
                  Ingresar
                </Link>
              </>
            ) : (
              <>
                Todavia no tenes cuenta?{' '}
                <Link to="/registro" state={ubicacion.state}>
                  Crear una
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </main>
  )
}
