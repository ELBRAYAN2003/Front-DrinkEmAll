import { useCallback, useEffect, useRef, useState } from 'react'
import { actualizarProducto, categoriasDelLocal, crearProducto, productosDelComercio } from '../../api/panel.js'
import { useRecarga } from '../../hooks/useRecarga.js'
import { money } from '../../lib/format.js'
import { mensajeDeError } from '../../lib/mensajeDeError.js'
import { aNumero, precioValido, stockValido, validarProductoNuevo } from '../../lib/producto.js'

// Cuanto se espera sin que la persona escriba antes de guardar sola. Al salir del campo se guarda enseguida.
const PAUSA_MS = 900

// Una fila: el stock y el precio se guardan SOLOS. Cada cambio valido se manda al servidor (que vuelve a validar)
// despues de una pausa corta o al salir del campo, y la fila avisa que paso.
function Fila({ producto }) {
  const [stock, setStock] = useState(String(producto.stock))
  const [precio, setPrecio] = useState(String(producto.price))
  const [estado, setEstado] = useState(null) // null | 'pendiente' | 'guardando' | 'ok' | { error }
  // Lo ultimo que el servidor confirmo: contra eso se decide si hay algo para guardar.
  const confirmado = useRef({ stock: String(producto.stock), price: String(producto.price) })
  const reloj = useRef(null)
  const vigente = useRef({ stock, precio })
  const enVuelo = useRef(0)
  const montado = useRef(true)

  // El guardado (que corre en un temporizador o al salir del campo) lee siempre lo ultimo escrito.
  useEffect(() => {
    vigente.current = { stock, precio }
  })

  const valido = stockValido(stock) && precioValido(precio)

  const guardar = useCallback(async () => {
    clearTimeout(reloj.current)
    const { stock: s, precio: p } = vigente.current
    const cuerpo = {}
    if (s.trim() !== confirmado.current.stock && stockValido(s)) cuerpo.stock = Number(s.trim())
    if (p.trim() !== confirmado.current.price && precioValido(p)) cuerpo.price = aNumero(p)
    if (Object.keys(cuerpo).length === 0) {
      if (montado.current) setEstado(null)
      return
    }
    const turno = ++enVuelo.current
    if (montado.current) setEstado('guardando')
    try {
      const actualizado = await actualizarProducto(producto.id, cuerpo)
      confirmado.current = { stock: String(actualizado.stock), price: String(actualizado.price) }
      // Si mientras tanto se siguio escribiendo, ese cambio tiene su propio guardado: no se pisa ni se marca "ok".
      if (turno === enVuelo.current && montado.current) {
        setEstado('ok')
        setTimeout(() => montado.current && setEstado((e) => (e === 'ok' ? null : e)), 2200)
      }
    } catch (e) {
      if (turno === enVuelo.current && montado.current) setEstado({ error: mensajeDeError(e) })
    }
  }, [producto.id])

  const programar = () => {
    clearTimeout(reloj.current)
    setEstado('pendiente')
    reloj.current = setTimeout(guardar, PAUSA_MS)
  }

  // Al salir de la pantalla (o cambiar de pagina de la lista) lo pendiente se guarda igual.
  useEffect(() => {
    montado.current = true
    return () => {
      montado.current = false
      if (reloj.current) guardar()
    }
  }, [guardar])

  const deshacer = () => {
    setStock(confirmado.current.stock)
    setPrecio(confirmado.current.price)
    setEstado(null)
  }

  const bajoStock = Number(stock) <= (producto.lowStockThreshold ?? 10) && stockValido(stock)
  const precioNum = aNumero(precio)

  return (
    <tr className={producto.active ? undefined : 'is-inactivo'}>
      <td>
        <b>{producto.name}</b>
        <small>
          {producto.sku ? `Código ${producto.sku} · ` : ''}
          {producto.brand}
          {!producto.active && ' · Inactivo'}
        </small>
      </td>
      <td className="num">
        <input
          className={`panel-campo ${bajoStock ? 'is-bajo' : ''} ${stock !== '' && !stockValido(stock) ? 'is-invalido' : ''}`.trim()}
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          value={stock}
          aria-label={`Stock de ${producto.name}`}
          onChange={(e) => {
            setStock(e.target.value)
            programar()
          }}
          onBlur={guardar}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        />
      </td>
      <td className="num">
        <input
          className={`panel-campo ${precio !== '' && !precioValido(precio) ? 'is-invalido' : ''}`.trim()}
          type="text"
          inputMode="decimal"
          value={precio}
          aria-label={`Precio de ${producto.name}`}
          onChange={(e) => {
            setPrecio(e.target.value)
            programar()
          }}
          onBlur={guardar}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        />
        <small>{precioValido(precio) ? money.format(precioNum) : ''}</small>
      </td>
      <td className="panel-estado" aria-live="polite">
        {/* Mientras el valor sea invalido se avisa siempre: no se guarda, y la fila no debe quedar sin explicacion. */}
        {!valido && <small className="panel-error-chico">Revisá los valores: no se guarda así.</small>}
        {valido && estado === 'pendiente' && <small>Por guardar…</small>}
        {estado === 'guardando' && <small>Guardando…</small>}
        {estado === 'ok' && <small className="panel-ok">✓ Guardado</small>}
        {estado?.error && (
          <>
            <small className="panel-error-chico">{estado.error}</small>
            <span className="panel-estado-acciones">
              <button type="button" onClick={guardar}>Reintentar</button>
              <button type="button" onClick={deshacer}>Deshacer</button>
            </span>
          </>
        )}
      </td>
    </tr>
  )
}

const NUEVO_VACIO = { name: '', sku: '', brand: '', categoryId: '', price: '', stock: '0', description: '', imageUrl: '' }

function Campo({ etiqueta, campo, datos, errores, cambiar, ayuda, ...resto }) {
  return (
    <label className="panel-form-campo">
      <span>{etiqueta}</span>
      <input value={datos[campo]} onChange={(e) => cambiar(campo, e.target.value)} aria-invalid={errores[campo] ? 'true' : undefined} {...resto} />
      {ayuda && !errores[campo] && <small>{ayuda}</small>}
      {errores[campo] && <small className="panel-error-chico">{errores[campo]}</small>}
    </label>
  )
}

// Alta de un producto. Valida antes de enviar y avisa si el codigo ya existe.
function FormularioNuevo({ alCrear, alCerrar }) {
  const [datos, setDatos] = useState(NUEVO_VACIO)
  const [categorias, setCategorias] = useState(null)
  const [tocado, setTocado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let vivo = true
    categoriasDelLocal()
      .then((c) => vivo && setCategorias(c))
      .catch(() => vivo && setCategorias([]))
    return () => {
      vivo = false
    }
  }, [])

  const errores = tocado ? validarProductoNuevo(datos) : {}
  const cambiar = (c, v) => setDatos((d) => ({ ...d, [c]: v }))

  const enviar = async (e) => {
    e.preventDefault()
    setTocado(true)
    if (Object.keys(validarProductoNuevo(datos)).length > 0 || enviando) return
    setEnviando(true)
    setError(null)
    try {
      const cuerpo = {
        name: datos.name.trim(),
        categoryId: Number(datos.categoryId),
        price: aNumero(datos.price),
        stock: datos.stock.trim() === '' ? 0 : Number(datos.stock.trim()),
        ...(datos.sku.trim() && { sku: datos.sku.trim() }),
        ...(datos.brand.trim() && { brand: datos.brand.trim() }),
        ...(datos.description.trim() && { description: datos.description.trim() }),
        ...(datos.imageUrl.trim() && { imageUrl: datos.imageUrl.trim() }),
      }
      alCrear(await crearProducto(cuerpo))
    } catch (err) {
      setError(err?.status === 409 ? 'Ya hay un producto con ese código. Usá otro o dejalo vacío.' : mensajeDeError(err))
      setEnviando(false)
    }
  }

  const props = { datos, errores, cambiar }

  return (
    <form className="panel-tarjeta panel-nuevo" onSubmit={enviar} noValidate>
      <h2>Agregar un producto</h2>
      <div className="panel-form-grilla">
        <Campo {...props} campo="name" etiqueta="Nombre *" maxLength={200} autoFocus />
        <Campo {...props} campo="sku" etiqueta="Código (opcional)" ayuda="El del producto en el local. No puede repetirse." />
        <Campo {...props} campo="brand" etiqueta="Marca" maxLength={80} />
        <label className="panel-form-campo">
          <span>Categoría *</span>
          <select value={datos.categoryId} onChange={(e) => cambiar('categoryId', e.target.value)} aria-invalid={errores.categoryId ? 'true' : undefined}>
            <option value="">{categorias ? 'Elegí una categoría' : 'Cargando...'}</option>
            {(categorias ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errores.categoryId && <small className="panel-error-chico">{errores.categoryId}</small>}
        </label>
        <Campo {...props} campo="price" etiqueta="Precio (IVA incluido) *" inputMode="decimal" placeholder="1500" />
        <Campo {...props} campo="stock" etiqueta="Stock inicial" inputMode="numeric" />
        <Campo {...props} campo="imageUrl" etiqueta="Imagen (dirección, opcional)" placeholder="https://..." ayuda="Sin imagen, el producto se muestra con un dibujo genérico." />
        <Campo {...props} campo="description" etiqueta="Descripción (opcional)" maxLength={500} />
      </div>
      {error && <p className="panel-error" role="alert">{error}</p>}
      <div className="panel-form-acciones">
        <button type="submit" className="panel-boton panel-boton-primario" disabled={enviando}>
          {enviando ? 'Creando...' : 'Crear producto'}
        </button>
        <button type="button" className="panel-boton" onClick={alCerrar} disabled={enviando}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default function PanelProductosPage() {
  const [texto, setTexto] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState(null)
  const [agregando, setAgregando] = useState(false)
  const [creado, setCreado] = useState(null)

  const cargar = useCallback(async () => {
    try {
      setDatos(await productosDelComercio({ page: pagina, sort: 'name_asc', ...(busqueda && { search: busqueda }) }))
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

  // Despues de crear, se busca el producto nuevo para que aparezca arriba y se pueda ajustar.
  const alCrear = (producto) => {
    setAgregando(false)
    setCreado(producto)
    setTexto(producto.name)
    setBusqueda(producto.name)
    setPagina(1)
  }

  const meta = datos?.meta

  return (
    <section>
      <div className="panel-cabecera">
        <h1>Productos</h1>
        {!agregando && (
          <button type="button" className="panel-boton panel-boton-primario" onClick={() => setAgregando(true)}>
            + Agregar producto
          </button>
        )}
      </div>
      <p className="panel-ayuda">
        Cambiá el stock o el precio directamente en la lista: <b>se guarda solo</b>. Hay {meta?.total ?? '...'} productos.
      </p>

      {agregando && <FormularioNuevo alCrear={alCrear} alCerrar={() => setAgregando(false)} />}
      {creado && (
        <p className="panel-aviso panel-creado" role="status">
          Producto creado: <b>{creado.name}</b>
          {creado.sku ? ` (código ${creado.sku})` : ''}. Ya está en la tienda.
        </p>
      )}

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
                <Fila key={p.id} producto={p} />
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
