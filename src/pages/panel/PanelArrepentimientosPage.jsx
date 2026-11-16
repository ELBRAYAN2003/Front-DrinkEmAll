import { useCallback, useState } from 'react'
import { arrepentimientos, atenderArrepentimiento } from '../../api/panel.js'
import { useRecarga } from '../../hooks/useRecarga.js'
import { formatoFechaHora } from '../../lib/format.js'
import { mensajeDeError } from '../../lib/mensajeDeError.js'
import { haceCuanto } from '../../lib/panel.js'

const VENTANA_MS = 24 * 60 * 60 * 1000

// Solicitudes del boton de arrepentimiento (Disposicion 954/2025): hay que responder dentro de las 24 horas.
export default function PanelArrepentimientosPage() {
  const [estado, setEstado] = useState('pendiente')
  const [lista, setLista] = useState(null)
  const [error, setError] = useState(null)
  const [notas, setNotas] = useState({})
  const [trabajando, setTrabajando] = useState(null)
  // La hora de la ultima carga: la edad de cada solicitud se mide contra ella (y no contra el reloj en cada dibujado).
  const [ahora, setAhora] = useState(() => Date.now())

  const cargar = useCallback(async () => {
    try {
      setLista(await arrepentimientos(estado))
      setAhora(Date.now())
      setError(null)
    } catch (e) {
      setError(mensajeDeError(e))
      setLista([])
    }
  }, [estado])
  const { actualizando, actualizar } = useRecarga(cargar)

  const atender = async (id) => {
    setTrabajando(id)
    setError(null)
    try {
      await atenderArrepentimiento(id, (notas[id] ?? '').trim())
      await cargar()
    } catch (e) {
      setError(mensajeDeError(e))
    } finally {
      setTrabajando(null)
    }
  }

  return (
    <section>
      <div className="panel-cabecera">
        <h1>Arrepentimientos</h1>
        <button type="button" className="panel-boton" onClick={actualizar} disabled={actualizando}>
          {actualizando ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>
      <p className="panel-ayuda">
        Cada solicitud hay que contestarla <b>dentro de las 24 horas</b>, por el contacto que dejó la persona, y
        coordinar la devolución del producto y del dinero.
      </p>

      <div className="panel-pestanas" role="tablist">
        {[['pendiente', 'Pendientes'], ['atendida', 'Atendidas']].map(([id, texto]) => (
          <button key={id} type="button" role="tab" aria-selected={estado === id} className={estado === id ? 'is-activa' : undefined} onClick={() => setEstado(id)}>
            {texto}
          </button>
        ))}
      </div>

      {error && <p className="panel-error" role="alert">{error}</p>}
      {lista === null && !error && <p aria-busy="true">Cargando...</p>}
      {lista && lista.length === 0 && !error && <p className="panel-vacio">No hay solicitudes {estado === 'pendiente' ? 'pendientes' : 'atendidas'}.</p>}

      <ul className="panel-lista">
        {(lista ?? []).map((r) => {
          const vencida = estado === 'pendiente' && ahora - new Date(r.createdAt).getTime() > VENTANA_MS
          return (
            <li key={r.id} className={vencida ? 'is-vencida' : undefined}>
              <div>
                <b className="panel-codigo">{r.code}</b>
                <span className="panel-edad">
                  {formatoFechaHora(r.createdAt)} · {haceCuanto(r.createdAt, ahora)}
                  {vencida && <strong> · pasó el plazo de 24 h</strong>}
                </span>
              </div>
              <p>
                <b>{r.fullName}</b> · {r.contact}
                {r.orderReference ? ` · pedido ${r.orderReference}` : ''}
              </p>
              {r.message && <p className="panel-mensaje">“{r.message}”</p>}
              {estado === 'pendiente' ? (
                <div className="panel-atender">
                  <input
                    type="text"
                    value={notas[r.id] ?? ''}
                    maxLength={255}
                    placeholder="Nota (cómo se resolvió)"
                    aria-label={`Nota de ${r.code}`}
                    onChange={(e) => setNotas((n) => ({ ...n, [r.id]: e.target.value }))}
                  />
                  <button type="button" className="panel-boton panel-boton-primario" disabled={trabajando === r.id} onClick={() => atender(r.id)}>
                    Marcar atendida
                  </button>
                </div>
              ) : (
                <p className="panel-ayuda">
                  Atendida {r.handledAt ? formatoFechaHora(r.handledAt) : ''}
                  {r.note ? ` · ${r.note}` : ''}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
