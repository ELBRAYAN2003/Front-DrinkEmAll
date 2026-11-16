import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Campo from '../components/ui/Campo.jsx'
import Icon from '../components/ui/Icon.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { cambiarPassword, miPerfil } from '../api/auth.js'
import { formatoDni, formatoFecha } from '../lib/format.js'
import { validarCambioPassword } from '../lib/validacion.js'
import { mensajeDeError } from '../lib/mensajeDeError.js'

const VACIO = { actual: '', nueva: '', confirmar: '' }

export default function AccountPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  // El DNI no viene en la respuesta del login: esta en la ficha de cliente.
  const [perfil, setPerfil] = useState(null)
  useEffect(() => {
    let vigente = true
    miPerfil()
      .then((ficha) => {
        if (vigente) setPerfil(ficha)
      })
      // Sin la ficha igual se muestra lo demas; el DNI queda como "no disponible".
      .catch(() => {
        if (vigente) setPerfil({})
      })
    return () => {
      vigente = false
    }
  }, [])

  const [datos, setDatos] = useState(VACIO)
  const [tocados, setTocados] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorApi, setErrorApi] = useState(null)

  const errores = validarCambioPassword(datos)
  const errorDe = (campo) => (tocados[campo] ? errores[campo] : null)
  const cambiar = (campo, valor) => setDatos((previos) => ({ ...previos, [campo]: valor }))
  const marcar = (campo) => setTocados((previos) => ({ ...previos, [campo]: true }))

  // El cierre pasa por /salir (ver SalirPage) y no se hace desde aca: esta pagina
  // es una ruta protegida y reaccionaria a su propio cierre de sesion.
  const cerrar = () => navigate('/salir', { state: { destino: '/' } })

  const enviar = async (e) => {
    e.preventDefault()
    setTocados({ actual: true, nueva: true, confirmar: true })
    if (Object.keys(errores).length > 0) return

    setEnviando(true)
    setErrorApi(null)
    try {
      await cambiarPassword(datos.actual, datos.nueva)
      // La API cierra todas las sesiones al cambiar la contrasena, incluida esta:
      // se vuelve a ingresar con la nueva.
      navigate('/salir', {
        replace: true,
        state: {
          destino: '/ingresar',
          aviso: 'Cambiaste tu contrasena. Ingresa de nuevo con la nueva.',
        },
      })
    } catch (error) {
      setErrorApi(mensajeDeError(error))
      setEnviando(false)
    }
  }

  return (
    <main className="auth">
      <div className="wrap">
        <nav className="breadcrumb" aria-label="Miga de pan">
          <Link to="/">Inicio</Link>
          <Icon name="right" size={13} />
          <span aria-current="page">Mi cuenta</span>
        </nav>

        <h1 className="account-title">Mi cuenta</h1>

        <div className="account-grid">
          <section className="auth-card" aria-labelledby="cuenta-datos">
            <h2 id="cuenta-datos">Tus datos</h2>
            <dl className="account-datos">
              <div>
                <dt>Nombre</dt>
                <dd>{usuario.name}</dd>
              </div>
              <div>
                <dt>Fecha de nacimiento</dt>
                <dd>{perfil === null ? '...' : perfil.birthDate ? formatoFecha(perfil.birthDate) : 'Sin cargar'}</dd>
              </div>
              <div>
                <dt>DNI</dt>
                <dd>{perfil === null ? '...' : perfil.documentNumber ? formatoDni(perfil.documentNumber) : 'Sin cargar'}</dd>
              </div>
              <div>
                <dt>Correo</dt>
                <dd>{usuario.email}</dd>
              </div>
              <div>
                <dt>Telefono</dt>
                <dd>{usuario.phone || 'Sin cargar'}</dd>
              </div>
            </dl>
            <Link className="btn btn-primary" to="/mis-pedidos">
              Mis pedidos
            </Link>{' '}
            <button type="button" className="btn btn-ghost" onClick={cerrar}>
              Cerrar sesion
            </button>
          </section>

          <section className="auth-card" aria-labelledby="cuenta-clave">
            <h2 id="cuenta-clave">Cambiar la contrasena</h2>
            <form onSubmit={enviar} noValidate>
              <div className="fields">
                <Campo
                  campo="actual"
                  etiqueta="Contrasena actual"
                  type="password"
                  autoComplete="current-password"
                  ancho
                  valor={datos.actual}
                  error={errorDe('actual')}
                  onCambio={cambiar}
                  onSalida={marcar}
                />
                <Campo
                  campo="nueva"
                  etiqueta="Contrasena nueva"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Al menos 8 caracteres"
                  ancho
                  valor={datos.nueva}
                  error={errorDe('nueva')}
                  onCambio={cambiar}
                  onSalida={marcar}
                />
                <Campo
                  campo="confirmar"
                  etiqueta="Repetir la contrasena nueva"
                  type="password"
                  autoComplete="new-password"
                  ancho
                  valor={datos.confirmar}
                  error={errorDe('confirmar')}
                  onCambio={cambiar}
                  onSalida={marcar}
                />
              </div>

              {errorApi && (
                <p className="auth-error" role="alert">
                  <Icon name="alert" size={16} />
                  {errorApi}
                </p>
              )}

              <button type="submit" className="btn btn-primary auth-submit" disabled={enviando}>
                {enviando ? 'Un momento...' : 'Cambiar contrasena'}
              </button>
              <p className="auth-nota">Al cambiarla se cierran tus sesiones abiertas y hay que ingresar de nuevo.</p>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
