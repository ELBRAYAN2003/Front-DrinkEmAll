import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { pedidosDelComercio } from '../../api/panel.js'
import { useRecarga } from '../../hooks/useRecarga.js'
import { estadoVisible, nombreDePedido } from '../../lib/estadosPedido.js'
import { formatoFechaHora, money } from '../../lib/format.js'
import { mensajeDeError } from '../../lib/mensajeDeError.js'
import { EN_CURSO, esperaAcreditacion, haceCuanto, pagoDelPedido } from '../../lib/panel.js'

const PESTANAS = [
  { id: 'atender', texto: 'Por atender', filtra: (p) => EN_CURSO.includes(p.fulfillmentStatus) },
  { id: 'entregados', texto: 'Entregados', filtra: (p) => p.fulfillmentStatus === 'entregado' },
  { id: 'cancelados', texto: 'Cancelados', filtra: (p) => p.fulfillmentStatus === 'cancelado' },
  { id: 'todos', texto: 'Todos', filtra: () => true },
]

const PAGO = { pendiente: 'Pendiente', pagado: 'Pagado', cancelado: 'Cancelado' }

export default function PanelPedidosPage() {
  const [pedidos, setPedidos] = useState(null)
  const [error, setError] = useState(null)
  const [pestana, setPestana] = useState('atender')
  const [texto, setTexto] = useState('')
  const [codigo, setCodigo] = useState('')

  const cargar = useCallback(async () => {
    try {
      setPedidos(await pedidosDelComercio(codigo ? { code: codigo } : {}))
      setError(null)
    } catch (e) {
      setError(mensajeDeError(e))
      setPedidos([])
    }
  }, [codigo])
  const { actualizando, actualizar } = useRecarga(cargar)

  const filtra = PESTANAS.find((p) => p.id === pestana).filtra
  const visibles = useMemo(() => (pedidos ?? []).filter(filtra), [pedidos, filtra])
  const cuenta = (id) => (pedidos ?? []).filter(PESTANAS.find((p) => p.id === id).filtra).length

  const buscar = (e) => {
    e.preventDefault()
    setCodigo(texto.trim())
    // Un codigo ya pide ese pedido a la API sin importar su estado: se mira en "Todos".
    if (texto.trim()) setPestana('todos')
  }

  const porPreparar = (pedidos ?? []).filter((p) => p.fulfillmentStatus === 'recibido' && !esperaAcreditacion(p)).length
  const esperandoPago = (pedidos ?? []).filter((p) => esperaAcreditacion(p)).length

  return (
    <section>
      <div className="panel-cabecera">
        <h1>Pedidos</h1>
        <button type="button" className="panel-boton" onClick={actualizar} disabled={actualizando}>
          {actualizando ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      <div className="panel-resumen">
        <div>
          <b>{porPreparar}</b>
          <span>Nuevos para preparar</span>
        </div>
        <div>
          <b>{esperandoPago}</b>
          <span>Esperando el pago (Mercado Pago)</span>
        </div>
        <div>
          <b>{cuenta('atender')}</b>
          <span>En curso en total</span>
        </div>
      </div>

      <form className="panel-buscar" onSubmit={buscar}>
        <input
          type="search"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar por código, ej. DRK-7K4Q9X"
          aria-label="Código del pedido"
        />
        <button type="submit" className="panel-boton panel-boton-primario">
          Buscar
        </button>
        {codigo && (
          <button
            type="button"
            className="panel-boton"
            onClick={() => {
              setTexto('')
              setCodigo('')
              setPestana('atender')
            }}
          >
            Quitar búsqueda
          </button>
        )}
      </form>

      <div className="panel-pestanas" role="tablist">
        {PESTANAS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={pestana === p.id}
            className={pestana === p.id ? 'is-activa' : undefined}
            onClick={() => setPestana(p.id)}
          >
            {p.texto} <small>{cuenta(p.id)}</small>
          </button>
        ))}
      </div>

      {error && <p className="panel-error" role="alert">{error}</p>}
      {pedidos === null && !error && <p aria-busy="true">Cargando los pedidos...</p>}
      {pedidos && visibles.length === 0 && !error && <p className="panel-vacio">No hay pedidos en esta lista.</p>}

      {visibles.length > 0 && (
        <div className="panel-tabla-marco">
          <table className="panel-tabla">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Entrega</th>
                <th>Pago</th>
                <th className="num">Total</th>
                <th>Estado</th>
                <th>Hecho</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((p) => {
                const pago = pagoDelPedido(p)
                const estado = estadoVisible(p)
                return (
                  <tr key={p.id}>
                    <td>
                      <Link to={`/panel/pedidos/${p.id}`} className="panel-codigo">
                        {nombreDePedido(p)}
                      </Link>
                    </td>
                    <td>
                      {p.customer?.firstName} {p.customer?.lastName}
                    </td>
                    <td>{p.deliveryMethod === 'retiro' ? 'Retiro' : 'Envío'}</td>
                    <td>
                      {pago?.paymentMethod?.name ?? '-'}
                      <small className={`panel-pago is-${pago?.status}`}>{PAGO[pago?.status] ?? ''}</small>
                    </td>
                    <td className="num">{money.format(p.total)}</td>
                    <td>
                      <span className={`pedido-estado is-${estado.clave}`}>{estado.etiqueta}</span>
                    </td>
                    <td title={formatoFechaHora(p.saleDate)}>{haceCuanto(p.saleDate)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
