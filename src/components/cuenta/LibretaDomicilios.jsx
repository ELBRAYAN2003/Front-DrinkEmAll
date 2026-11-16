import { useState } from 'react'
import Campo from '../ui/Campo.jsx'
import Icon from '../ui/Icon.jsx'
import { domicilios } from '../../api/libreta.js'
import { useLibreta } from '../../hooks/useLibreta.js'
import { validarCampo } from '../../lib/validacion.js'

const VACIO = { label: '', direccion: '', ciudad: 'Juan Jose Castelli', codigoPostal: '', referencia: '' }
const CAMPOS = ['direccion', 'ciudad', 'codigoPostal']

// "Mis domicilios": los que se ofrecen en el checkout al elegir envio a domicilio.
export default function LibretaDomicilios() {
  const { items, error, crear, editar, borrar, predeterminar } = useLibreta(domicilios)
  const [form, setForm] = useState(null) // null = cerrado; { id|null, datos }
  const [tocados, setTocados] = useState({})
  const [errorApi, setErrorApi] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const errores = form
    ? Object.fromEntries(CAMPOS.map((c) => [c, validarCampo(c, form.datos[c], form.datos)]).filter(([, e]) => e))
    : {}
  const errorDe = (c) => (tocados[c] ? errores[c] : null)
  const cambiar = (campo, valor) => setForm((f) => ({ ...f, datos: { ...f.datos, [campo]: valor } }))
  const marcar = (campo) => setTocados((t) => ({ ...t, [campo]: true }))

  const abrir = (item) => {
    setTocados({})
    setErrorApi(null)
    setForm(
      item
        ? {
            id: item.id,
            datos: {
              label: item.label ?? '',
              direccion: item.street,
              ciudad: item.city,
              codigoPostal: item.postalCode,
              referencia: item.reference ?? '',
            },
          }
        : { id: null, datos: VACIO },
    )
  }

  const guardar = async (e) => {
    e.preventDefault()
    if (enviando) return
    setTocados({ direccion: true, ciudad: true, codigoPostal: true })
    if (Object.keys(errores).length > 0) return
    const d = form.datos
    const cuerpo = {
      street: d.direccion.trim(),
      city: d.ciudad.trim(),
      postalCode: d.codigoPostal.trim().toUpperCase(),
      label: d.label.trim(),
      reference: d.referencia.trim(),
    }
    setEnviando(true)
    const fallo = form.id ? await editar(form.id, cuerpo) : await crear(cuerpo)
    setEnviando(false)
    if (fallo) setErrorApi(fallo)
    else setForm(null)
  }

  return (
    <section className="auth-card libreta" aria-labelledby="cuenta-domicilios">
      <h2 id="cuenta-domicilios">Mis domicilios</h2>
      {error && <p className="checkout-aviso" role="alert"><Icon name="alert" size={16} />{error}</p>}
      {items === null && !error && <p aria-busy="true">Cargando...</p>}
      {items?.length === 0 && !form && <p className="libreta-vacio">Todavia no guardaste ningun domicilio.</p>}

      <ul className="libreta-lista">
        {items?.map((d) => (
          <li key={d.id}>
            <span>
              <b>
                {d.label || d.street}
                {d.isDefault && <em className="option-tag">Predeterminado</em>}
              </b>
              <small>
                {d.street}, {d.city} ({d.postalCode}){d.reference ? ` - ${d.reference}` : ''}
              </small>
            </span>
            <span className="libreta-acciones">
              {!d.isDefault && (
                <button type="button" onClick={() => predeterminar(d.id)}>Predeterminado</button>
              )}
              <button type="button" onClick={() => abrir(d)}>Editar</button>
              <button type="button" onClick={() => borrar(d.id)}>Borrar</button>
            </span>
          </li>
        ))}
      </ul>

      {form ? (
        <form onSubmit={guardar} noValidate className="libreta-form">
          <div className="fields">
            <Campo campo="label" etiqueta="Nombre (opcional)" type="text" maxLength={40} placeholder="Casa, Trabajo..." ancho
              valor={form.datos.label} error={null} onCambio={cambiar} onSalida={marcar} />
            <Campo campo="direccion" etiqueta="Direccion" type="text" placeholder="Calle y numero" ancho
              valor={form.datos.direccion} error={errorDe('direccion')} onCambio={cambiar} onSalida={marcar} />
            <Campo campo="ciudad" etiqueta="Ciudad" type="text"
              valor={form.datos.ciudad} error={errorDe('ciudad')} onCambio={cambiar} onSalida={marcar} />
            <Campo campo="codigoPostal" etiqueta="Codigo postal" type="text" placeholder="3700"
              valor={form.datos.codigoPostal} error={errorDe('codigoPostal')} onCambio={cambiar} onSalida={marcar} />
            <Campo campo="referencia" etiqueta="Referencia (opcional)" type="text" placeholder="Porton negro, timbre 2" ancho
              valor={form.datos.referencia} error={null} onCambio={cambiar} onSalida={marcar} />
          </div>
          {errorApi && <p className="checkout-aviso" role="alert"><Icon name="alert" size={16} />{errorApi}</p>}
          <div className="libreta-botones">
            <button type="submit" className="btn btn-primary" disabled={enviando}>
              {enviando ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setForm(null)}>Cancelar</button>
          </div>
        </form>
      ) : (
        <button type="button" className="btn btn-ghost" onClick={() => abrir(null)}>
          Agregar un domicilio
        </button>
      )}
    </section>
  )
}
