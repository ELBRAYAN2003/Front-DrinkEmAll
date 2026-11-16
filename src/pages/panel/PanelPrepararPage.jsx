import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { pedidosDelComercio } from '../../api/panel.js'
import { useRecarga } from '../../hooks/useRecarga.js'
import { nombreDePedido } from '../../lib/estadosPedido.js'
import { mensajeDeError } from '../../lib/mensajeDeError.js'
import { quePreparar } from '../../lib/panel.js'

// Lista de armado: que productos y cuantas unidades hay que sacar para los pedidos pendientes.
export default function PanelPrepararPage() {
  const [pedidos, setPedidos] = useState(null)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    try {
      setPedidos(await pedidosDelComercio())
      setError(null)
    } catch (e) {
      setError(mensajeDeError(e))
      setPedidos([])
    }
  }, [])
  const { actualizando, actualizar } = useRecarga(cargar)

  const lista = useMemo(() => (pedidos ? quePreparar(pedidos) : []), [pedidos])
  const unidades = lista.reduce((s, p) => s + p.cantidad, 0)

  return (
    <section>
      <div className="panel-cabecera">
        <h1>Qué preparar</h1>
        <button type="button" className="panel-boton" onClick={actualizar} disabled={actualizando}>
          {actualizando ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>
      <p className="panel-ayuda">
        Productos de los pedidos nuevos y en preparación. No incluye los de Mercado Pago que todavía no se pagaron.
      </p>

      {error && <p className="panel-error" role="alert">{error}</p>}
      {pedidos === null && !error && <p aria-busy="true">Cargando...</p>}
      {pedidos && lista.length === 0 && !error && <p className="panel-vacio">No hay nada para preparar por ahora.</p>}

      {lista.length > 0 && (
        <>
          <p className="panel-total-armar">
            <b>{lista.length}</b> productos · <b>{unidades}</b> unidades
          </p>
          <div className="panel-tabla-marco">
            <table className="panel-tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="num">Unidades</th>
                  <th className="num">Stock</th>
                  <th>Pedidos</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((p) => (
                  <tr key={p.productId}>
                    <td>{p.nombre}</td>
                    <td className="num"><b>{p.cantidad}</b></td>
                    <td className="num">{p.stock ?? '-'}</td>
                    <td>
                      {p.pedidos.map((o) => (
                        <Link key={o.id} to={`/panel/pedidos/${o.id}`} className={`panel-chip ${o.enPreparacion ? 'is-preparando' : ''}`.trim()}>
                          {nombreDePedido(o)} ×{o.cantidad}
                        </Link>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="panel-ayuda">Los pedidos en azul ya están en preparación; el resto son nuevos.</p>
        </>
      )}
    </section>
  )
}
