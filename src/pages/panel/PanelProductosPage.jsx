import { useCallback, useState } from 'react'
import { actualizarProducto, productosDelComercio } from '../../api/panel.js'
import { money } from '../../lib/format.js'
import { mensajeDeError } from '../../lib/mensajeDeError.js'
import { useRecarga } from '../../hooks/useRecarga.js'

// Una fila: stock y precio se editan ahi mismo. El servidor valida (entero >= 0, precio > 0).
function Fila({ producto, alGuardar }) {
  const [stock, setStock] = useState(String(producto.stock))
  const [precio, setPrecio] = useState(String(producto.price))
  const [estado, setEstado] = useState(null) // null | 'guardando' | 'ok' | mensaje de error

  const cambios = String(producto.stock) !== stock.trim() || String(producto.price) !== precio.trim()
  const stockNum = Number(stock)
  const precioNum = Number(precio.replace(',', '.'))
  const valido = stock.trim() !== '' && Number.isInteger(stockNum) && stockNum >= 0 && precio.trim() !== '' && precioNum > 0

  const guardar = async () => {
    setEstado('guardando')
    try {
      const cuerpo = {}
      if (String(producto.stock) !== stock.trim()) cuerpo.stock = stockNum
      if (String(producto.price) !== precio.trim()) cuerpo.price = precioNum
      const actualizado = await actualizarProducto(producto.id, cuerpo)
      alGuardar(actualizado)
      setStock(String(actualizado.stock))
      setPrecio(String(actualizado.price))
      setEstado('ok')
    } catch (e) {
      setEstado(mensajeDeError(e))
    }
  }

  const bajoStock = producto.stock <= (producto.lowStockThreshold ?? 10)

  return (
    <tr className={producto.active ? undefined : 'is-inactivo'}>
      <td>
        <b>{producto.name}</b>
        <small>
          {producto.brand}
          {!producto.active && ' · Inactivo'}
        </small>
      </td>
      <td className="num">
        <input
          className={`panel-campo ${bajoStock ? 'is-bajo' : ''}`.trim()}
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          value={stock}
          aria-label={`Stock de ${producto.name}`}
          onChange={(e) => {
            setStock(e.target.value)
            setEstado(null)
          }}
        />
      </td>
      <td className="num">
        <input
          className="panel-campo"
          type="text"
          inputMode="decimal"
          value={precio}
          aria-label={`Precio de ${producto.name}`}
          onChange={(e) => {
            setPrecio(e.target.value)
            setEstado(null)
          }}
        />
        <small>{valido ? money.format(precioNum) : ''}</small>
      </td>
      <td>
        <button type="button" className="panel-boton panel-boton-primario" disabled={!cambios || !valido || estado === 'guardando'} onClick={guardar}>
          {estado === 'guardando' ? 'Guardando...' : 'Guardar'}
        </button>
        {estado === 'ok' && <small className="panel-ok">Guardado</small>}
        {estado && estado !== 'ok' && estado !== 'guardando' && <small className="panel-error-chico">{estado}</small>}
      </td>
    </tr>
  )
}

export default function PanelProductosPage() {
  const [texto, setTexto] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    try {
      setDatos(
        await productosDelComercio({
          page: pagina,
          sort: 'name_asc',
          ...(busqueda && { search: busqueda }),
        }),
      )
      setError(null)
    } catch (e) {
      setError(mensajeDeError(e))
      setDatos({ data: [], meta: { totalPages: 1, total: 0 } })
    }
  }, [pagina, busqueda])

  useRecarga(cargar)

  const buscar = (e) => {
    e.preventDefault()
    setPagina(1)
    setBusqueda(texto.trim())
  }

  const meta = datos?.meta

  return (
    <section>
      <div className="panel-cabecera">
        <h1>Productos</h1>
      </div>
      <p className="panel-ayuda">Cambiá el stock o el precio directamente en la lista y tocá Guardar. Hay {meta?.total ?? '...'} productos.</p>

      <form className="panel-buscar" onSubmit={buscar}>
        <input type="search" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar por nombre, marca o código" aria-label="Buscar productos" />
        <button type="submit" className="panel-boton panel-boton-primario">Buscar</button>
      </form>

      {error && <p className="panel-error" role="alert">{error}</p>}
      {datos === null && !error && <p aria-busy="true">Cargando...</p>}
      {datos && datos.data.length === 0 && !error && <p className="panel-vacio">No se encontraron productos.</p>}

      {datos?.data.length > 0 && (
        <div className="panel-tabla-marco">
          <table className="panel-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="num">Stock</th>
                <th className="num">Precio (IVA incl.)</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {datos.data.map((p) => (
                <Fila key={`${p.id}-${p.updatedAt}`} producto={p} alGuardar={() => {}} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="panel-paginas">
          <button type="button" className="panel-boton" disabled={pagina <= 1} onClick={() => setPagina(pagina - 1)}>Anterior</button>
          <span>Página {pagina} de {meta.totalPages}</span>
          <button type="button" className="panel-boton" disabled={pagina >= meta.totalPages} onClick={() => setPagina(pagina + 1)}>Siguiente</button>
        </div>
      )}
    </section>
  )
}
