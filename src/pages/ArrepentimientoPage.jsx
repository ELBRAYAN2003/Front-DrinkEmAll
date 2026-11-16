import { useState } from 'react'
import { Link } from 'react-router'
import Campo from '../components/ui/Campo.jsx'
import Icon from '../components/ui/Icon.jsx'
import { solicitarArrepentimiento } from '../api/arrepentimiento.js'
import { validarArrepentimiento } from '../lib/validacion.js'
import { mensajeDeError } from '../lib/mensajeDeError.js'

const VACIO = { nombre: '', contacto: '', pedido: '', mensaje: '' }

// Boton de arrepentimiento (Disposicion 954/2025). Es publico a proposito: la
// norma prohibe pedir registro previo u otro tramite, asi que no hay ruta privada
// ni pasos: nombre, un contacto y listo. El comercio responde dentro de las 24 horas.
export default function ArrepentimientoPage() {
  const [datos, setDatos] = useState(VACIO)
  const [tocados, setTocados] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorApi, setErrorApi] = useState(null)
  const [resultado, setResultado] = useState(null)

  const errores = validarArrepentimiento(datos)
  const errorDe = (campo) => (tocados[campo] ? errores[campo] : null)
  const cambiar = (campo, valor) => setDatos((previos) => ({ ...previos, [campo]: valor }))
  const marcar = (campo) => setTocados((previos) => ({ ...previos, [campo]: true }))

  const enviar = async (e) => {
    e.preventDefault()
    if (enviando) return
    setTocados({ nombre: true, contacto: true })
    if (Object.keys(errores).length > 0) return
    setEnviando(true)
    setErrorApi(null)
    try {
      setResultado(await solicitarArrepentimiento(datos))
    } catch (error) {
      setErrorApi(mensajeDeError(error))
    } finally {
      setEnviando(false)
    }
  }

  if (resultado) {
    return (
      <main className="auth">
        <div className="wrap">
          <div className="auth-card arrepentimiento-ok" role="status">
            <h1>Recibimos tu solicitud</h1>
            <p>Tu código de identificación es:</p>
            <p className="arrepentimiento-codigo">{resultado.code}</p>
            <p>
              Guardalo. El local te responde dentro de las 24 horas al contacto que dejaste
              (<b>{datos.contacto.trim()}</b>) para coordinar la devolución del producto y del dinero.
            </p>
            <Link className="btn btn-primary" to="/">
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="auth">
      <div className="wrap">
        <nav className="breadcrumb" aria-label="Miga de pan">
          <Link to="/">Inicio</Link>
          <Icon name="right" size={13} />
          <span aria-current="page">Botón de arrepentimiento</span>
        </nav>

        <div className="auth-card">
          <h1>Botón de arrepentimiento</h1>
          <p className="auth-sub">
            Podés revocar tu compra dentro de los 10 días corridos desde que recibís el producto.
            No hace falta tener cuenta. Mirá los detalles en los{' '}
            <Link to="/terminos">términos y condiciones</Link>.
          </p>

          <form onSubmit={enviar} noValidate>
            <div className="fields">
              <Campo
                campo="nombre"
                etiqueta="Nombre y apellido"
                type="text"
                autoComplete="name"
                ancho
                valor={datos.nombre}
                error={errorDe('nombre')}
                onCambio={cambiar}
                onSalida={marcar}
              />
              <Campo
                campo="contacto"
                etiqueta="Correo o telefono para contactarte"
                type="text"
                autoComplete="email"
                ancho
                valor={datos.contacto}
                error={errorDe('contacto')}
                onCambio={cambiar}
                onSalida={marcar}
              />
              <Campo
                campo="pedido"
                etiqueta="Número de pedido (opcional)"
                type="text"
                inputMode="numeric"
                maxLength={40}
                ancho
                valor={datos.pedido}
                error={null}
                onCambio={cambiar}
                onSalida={marcar}
              />
              <label className="field-wide">
                <span>Mensaje (opcional)</span>
                <textarea
                  name="mensaje"
                  rows={3}
                  maxLength={500}
                  value={datos.mensaje}
                  onChange={(e) => cambiar('mensaje', e.target.value)}
                />
              </label>
            </div>

            {errorApi && (
              <p className="checkout-aviso" role="alert">
                <Icon name="alert" size={16} />
                {errorApi}
              </p>
            )}

            <button type="submit" className="btn btn-primary auth-submit" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
