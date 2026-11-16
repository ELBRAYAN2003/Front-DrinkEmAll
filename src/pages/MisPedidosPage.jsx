import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import Icon from '../components/ui/Icon.jsx'
import { misPedidos } from '../api/pedidos.js'
import { estadoVisible, nombreDePedido } from '../lib/estadosPedido.js'
import { formatoFechaHora, money } from '../lib/format.js'
import { mensajeDeError } from '../lib/mensajeDeError.js'
import { useRecarga } from '../hooks/useRecarga.js'

export default function MisPedidosPage() {
  const [pedidos, setPedidos] = useState(null)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    try {
      setPedidos(await misPedidos())
      setError(null)
    } catch (e) {
      setError(mensajeDeError(e))
    }
  }, [])
  const { actualizando, actualizar } = useRecarga(cargar)

  return (
    <main className="auth pedidos">
      <div className="wrap">
        <nav className="breadcrumb" aria-label="Miga de pan">
          <Link to="/">Inicio</Link>
          <Icon name="right" size={13} />
          <span aria-current="page">Mis pedidos</span>
        </nav>

        <div className="pedidos-cabecera">
          <h1 className="account-title">Mis pedidos</h1>
          <button type="button" className="btn btn-ghost" onClick={actualizar} disabled={actualizando}>
            <Icon name="refresh" size={16} />
            {actualizando ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        {error && (
          <p className="checkout-aviso" role="alert">
            <Icon name="alert" size={16} />
            {error}
          </p>
        )}

        {pedidos === null && !error && <p aria-busy="true">Cargando tus pedidos...</p>}

        {pedidos?.length === 0 && (
          <div className="catalog-empty">
            <p>Todavia no hiciste ningun pedido.</p>
            <Link className="btn btn-primary" to="/catalogo">
              Ver el catalogo
            </Link>
          </div>
        )}

        {pedidos?.length > 0 && (
          <ul className="pedidos-lista">
            {pedidos.map((p) => (
              <li key={p.id}>
                <Link to={`/mis-pedidos/${p.id}`} className="pedido-fila">
                  <span className="pedido-numero">Pedido {nombreDePedido(p)}</span>
                  <span className="pedido-fecha">{formatoFechaHora(p.saleDate)}</span>
                  <span className="pedido-total">{money.format(p.total)}</span>
                  <span className={`pedido-estado is-${estadoVisible(p).clave}`}>
                    {estadoVisible(p).etiqueta}
                  </span>
                  <Icon name="right" size={16} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
