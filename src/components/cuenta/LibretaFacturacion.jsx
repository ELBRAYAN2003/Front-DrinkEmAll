import { useState } from 'react'
import Campo from '../ui/Campo.jsx'
import Icon from '../ui/Icon.jsx'
import { facturacion } from '../../api/libreta.js'
import { useLibreta } from '../../hooks/useLibreta.js'
import { formatoDocumento, soloDigitos } from '../../lib/documento.js'
import { validarCampo } from '../../lib/validacion.js'

const VACIO = { label: '', facNombre: '', facTipo: 'DNI', facDoc: '', facCorreo: '' }
const CAMPOS = ['facNombre', 'facDoc', 'facCorreo']

// "Datos de facturacion": los que se ofrecen en el checkout para la factura.
export default function LibretaFacturacion() {
  const { items, error, crear, editar, borrar, predeterminar } = useLibreta(facturacion)
  const [form, setForm] = useState(null)
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
              facNombre: item.fullName,
              facTipo: item.taxIdType,
              facDoc: item.taxId,
              facCorreo: item.email,
            },
          }
        : { id: null, datos: VACIO },
    )
  }

  const guardar = async (e) => {
    e.preventDefault()
    if (enviando) return
    setTocados({ facNombre: true, facDoc: true, facCorreo: true })
    if (Object.keys(errores).length > 0) return
    const d = form.datos
    const cuerpo = {
      label: d.label.trim(),
      fullName: d.facNombre.trim(),
      taxIdType: d.facTipo,
      taxId: soloDigitos(d.facDoc),
      email: d.facCorreo.trim(),
    }
    setEnviando(true)
    const fallo = form.id ? await editar(form.id, cuerpo) : await crear(cuerpo)
    setEnviando(false)
    if (fallo) setErrorApi(fallo)
    else setForm(null)
  }

  return (
    <section className="auth-card libreta" aria-labelledby="cuenta-facturacion">
      <h2 id="cuenta-facturacion">Datos de facturacion</h2>
      {error && <p className="checkout-aviso" role="alert"><Icon name="alert" size={16} />{error}</p>}
      {items === null && !error && <p aria-busy="true">Cargando...</p>}
      {items?.length === 0 && !form && (
        <p className="libreta-vacio">Todavia no guardaste datos de facturacion. En el checkout tambien podes usar los de tu cuenta.</p>
      )}

      <ul className="libreta-lista">
        {items?.map((f) => (
          <li key={f.id}>
            <span>
              <b>
                {f.label || f.fullName}
                {f.isDefault && <em className="option-tag">Predeterminado</em>}
              </b>
              <small>
                {f.fullName} - {formatoDocumento(f.taxIdType, f.taxId)} - {f.email}
              </small>
            </span>
            <span className="libreta-acciones">
              {!f.isDefault && <button type="button" onClick={() => predeterminar(f.id)}>Predeterminado</button>}
              <button type="button" onClick={() => abrir(f)}>Editar</button>
              <button type="button" onClick={() => borrar(f.id)}>Borrar</button>
            </span>
          </li>
        ))}
      </ul>

      {form ? (
        <form onSubmit={guardar} noValidate className="libreta-form">
          <div className="fields">
            <Campo campo="label" etiqueta="Nombre (opcional)" type="text" maxLength={40} placeholder="Personal, Empresa..." ancho
              valor={form.datos.label} error={null} onCambio={cambiar} onSalida={marcar} />
            <Campo campo="facNombre" etiqueta="Nombre o razon social" type="text" ancho
              valor={form.datos.facNombre} error={errorDe('facNombre')} onCambio={cambiar} onSalida={marcar} />
            <label>
              <span>Tipo de documento</span>
              <select name="facTipo" value={form.datos.facTipo} onChange={(e) => cambiar('facTipo', e.target.value)}>
                <option value="DNI">DNI</option>
                <option value="CUIT">CUIT</option>
              </select>
            </label>
            <Campo campo="facDoc" etiqueta="Numero" type="text" inputMode="numeric"
              valor={form.datos.facDoc} error={errorDe('facDoc')} onCambio={cambiar} onSalida={marcar} />
            <Campo campo="facCorreo" etiqueta="Correo para enviar la factura" type="email" ancho
              valor={form.datos.facCorreo} error={errorDe('facCorreo')} onCambio={cambiar} onSalida={marcar} />
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
          Agregar datos de facturacion
        </button>
      )}
    </section>
  )
}
