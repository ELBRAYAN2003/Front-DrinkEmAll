import { useState } from 'react'
import { cargarEnvio } from '../../api/panel.js'
import { mensajeDeError } from '../../lib/mensajeDeError.js'
import { COMPANIAS, REPARTO_PROPIO } from '../../lib/panel.js'

const OTRA = '__otra__'

// Datos del envio que carga el vendedor mientras prepara el paquete: que compania lo lleva y con que numero
// se sigue. El cliente los ve en su pedido. Sin ellos no se puede marcar "salio a repartir" (el servidor tambien
// lo exige); solo el reparto propio del local no lleva numero.
export default function EnvioDelPedido({ pedido, alGuardar }) {
  const inicial = pedido.carrier ?? ''
  const [companiaSel, setCompaniaSel] = useState(inicial && !COMPANIAS.includes(inicial) ? OTRA : inicial)
  const [otra, setOtra] = useState(inicial && !COMPANIAS.includes(inicial) ? inicial : '')
  const [numero, setNumero] = useState(pedido.trackingNumber ?? '')
  const [estado, setEstado] = useState(null) // null | 'guardando' | 'ok' | { error }

  const compania = companiaSel === OTRA ? otra.trim() : companiaSel
  const repartoPropio = compania.toLowerCase() === REPARTO_PROPIO.toLowerCase()
  const cambios = compania !== (pedido.carrier ?? '') || (!repartoPropio && numero.trim() !== (pedido.trackingNumber ?? ''))

  const guardar = async (e) => {
    e.preventDefault()
    setEstado('guardando')
    try {
      const cuerpo = {}
      if (compania !== (pedido.carrier ?? '') && compania) cuerpo.carrier = compania
      if (!repartoPropio && numero.trim() !== (pedido.trackingNumber ?? '') && numero.trim()) cuerpo.trackingNumber = numero.trim()
      if (Object.keys(cuerpo).length === 0) {
        setEstado(null)
        return
      }
      await cargarEnvio(pedido.id, cuerpo)
      setEstado('ok')
      await alGuardar()
    } catch (err) {
      setEstado({ error: mensajeDeError(err) })
    }
  }

  return (
    <form className="panel-envio" onSubmit={guardar} noValidate>
      <h3>Envío: compañía y seguimiento</h3>
      <p className="panel-ayuda">Cargalos mientras armás el paquete: el cliente los ve en su pedido. Sin ellos no se puede marcar “salió a repartir”.</p>
      <div className="panel-form-grilla">
        <label className="panel-form-campo">
          <span>Compañía</span>
          <select value={companiaSel} onChange={(e) => { setCompaniaSel(e.target.value); setEstado(null) }}>
            <option value="">Elegí la compañía</option>
            {COMPANIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            <option value={OTRA}>Otra…</option>
          </select>
        </label>
        {companiaSel === OTRA && (
          <label className="panel-form-campo">
            <span>Nombre de la compañía</span>
            <input value={otra} maxLength={60} onChange={(e) => { setOtra(e.target.value); setEstado(null) }} />
          </label>
        )}
        {!repartoPropio && (
          <label className="panel-form-campo">
            <span>Número de seguimiento</span>
            <input value={numero} maxLength={60} placeholder="Ej. 360000123456" onChange={(e) => { setNumero(e.target.value); setEstado(null) }} />
          </label>
        )}
      </div>
      <div className="panel-form-acciones">
        <button type="submit" className="panel-boton panel-boton-primario" disabled={!cambios || !compania || estado === 'guardando'}>
          {estado === 'guardando' ? 'Guardando...' : 'Guardar datos del envío'}
        </button>
        {estado === 'ok' && <span className="panel-ok">✓ Guardado. El cliente ya lo ve.</span>}
        {estado?.error && <span className="panel-error-chico" role="alert">{estado.error}</span>}
      </div>
    </form>
  )
}
