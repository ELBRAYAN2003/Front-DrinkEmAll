import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import Icon from '../components/ui/Icon.jsx'
import ProductCard from '../components/ui/ProductCard.jsx'
import { money } from '../lib/format.js'
import { useCategorias, useFiltros, useProductos } from '../hooks/useCatalogo.js'

const POR_PAGINA = 9

// El valor vacio es "sin orden": la API devuelve entonces su orden por defecto.
// No hay opcion por puntaje porque no existe sistema de resenas: ofrecerla
// mostraria un orden que en realidad no ordena nada.
const ORDENES = [
  { id: '', label: 'Relevancia' },
  { id: 'price_asc', label: 'Precio: de menor a mayor' },
  { id: 'price_desc', label: 'Precio: de mayor a menor' },
  { id: 'name_asc', label: 'Nombre: A a Z' },
  { id: 'name_desc', label: 'Nombre: Z a A' },
]

// Cuantas marcas se listan sin buscar. Son casi cuatrocientas: mostrarlas todas
// haria del sidebar una lista interminable.
const MARCAS_VISIBLES = 8

function sinTildes(texto = '') {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

/**
 * Numeros de pagina a dibujar, con elipsis.
 *
 * Con 1183 productos de a 9 son 132 paginas: un boton por cada una es una pared
 * de numeros inservible.
 */
function ventanaDePaginas(actual, total) {
  if (total <= 7) return Array.from({ length: total }, (_, k) => k + 1)

  const paginas = new Set([1, total, actual, actual - 1, actual + 1])
  const ordenadas = [...paginas].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)

  const conCortes = []
  for (const [i, n] of ordenadas.entries()) {
    if (i > 0 && n - ordenadas[i - 1] > 1) conCortes.push('...')
    conCortes.push(n)
  }
  return conCortes
}

export default function CatalogPage() {
  const { categoria } = useParams()

  const categorias = useCategorias()
  const filtros = useFiltros()

  // La busqueda, las marcas y el filtro de oferta viven en la URL: son los que
  // se comparten por link y los que llegan desde el buscador de la cabecera y
  // desde la home. El resto de los controles es estado local de la pagina.
  const [params, setParams] = useSearchParams()
  const busqueda = params.get('q') ?? ''
  const marcas = params.getAll('marca')
  const soloOferta = params.get('oferta') === '1'

  const [buscaMarca, setBuscaMarca] = useState('')
  const [precioMax, setPrecioMax] = useState(null)
  const [orden, setOrden] = useState('')
  const [pagina, setPagina] = useState(1)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

  const catActual = categorias.find((c) => c.slug === categoria)
  // Con una categoria en la URL hay que esperar a saber su id antes de pedir:
  // si no, se pediria el catalogo entero y se descartaria en el acto.
  const esperandoCategoria = Boolean(categoria) && categorias.length === 0

  const tope = filtros.precio?.max ?? 0
  const piso = filtros.precio?.min ?? 0
  const precioElegido = precioMax ?? tope
  const filtraPrecio = precioMax !== null && precioMax < tope

  const { productos, meta, cargando, error } = useProductos({
    categoryId: catActual?.id,
    page: pagina,
    pageSize: POR_PAGINA,
    search: busqueda || undefined,
    marcas,
    precioMax: filtraPrecio ? precioMax : undefined,
    orden: orden || undefined,
    soloOferta,
    pausado: esperandoCategoria,
  })

  // Cada filtro vuelve al principio del listado. Se hace en el manejador y no
  // en un efecto: sincronizar estado con estado dentro de useEffect provoca
  // un render extra en cascada.
  const filtrar = (accion) => (...args) => {
    accion(...args)
    setPagina(1)
  }

  // Toda escritura sobre la URL vuelve a la primera pagina: los resultados que
  // se estaban viendo dejan de existir en cuanto cambia el filtro.
  const cambiarParams = (mutar) => {
    const siguientes = new URLSearchParams(params)
    mutar(siguientes)
    setParams(siguientes)
    setPagina(1)
  }

  const alternarMarca = (marca) =>
    cambiarParams((p) => {
      const actuales = p.getAll('marca')
      const siguientes = actuales.includes(marca)
        ? actuales.filter((m) => m !== marca)
        : [...actuales, marca]
      p.delete('marca')
      for (const m of siguientes) p.append('marca', m)
    })

  const alternarOferta = (activo) =>
    cambiarParams((p) => (activo ? p.set('oferta', '1') : p.delete('oferta')))

  // Las marcas elegidas van siempre primero y siempre visibles: si al buscar
  // desaparecieran de la lista, no habria forma de destildarlas.
  const marcasListadas = useMemo(() => {
    const busqueda = sinTildes(buscaMarca.trim())
    const elegidas = filtros.marcas.filter((m) => marcas.includes(m.name))
    const resto = filtros.marcas
      .filter((m) => !marcas.includes(m.name))
      .filter((m) => !busqueda || sinTildes(m.name).includes(busqueda))

    return [...elegidas, ...resto.slice(0, busqueda ? 30 : MARCAS_VISIBLES)]
  }, [filtros.marcas, marcas, buscaMarca])

  const hayFiltros = marcas.length > 0 || soloOferta || filtraPrecio || Boolean(busqueda)

  const limpiar = () => {
    setBuscaMarca('')
    setPrecioMax(null)
    setPagina(1)
    // Limpiar tambien vacia la URL: si no, la busqueda seguiria aplicada sin
    // ningun control encendido que lo delate.
    setParams(new URLSearchParams())
  }

  const total = meta.total ?? 0
  const totalPaginas = Math.max(1, meta.totalPages ?? 1)
  const desde = total === 0 ? 0 : (meta.page - 1) * POR_PAGINA + 1
  const hasta = Math.min(meta.page * POR_PAGINA, total)

  return (
    <main className="catalog">
      <nav className="breadcrumb wrap" aria-label="Miga de pan">
        <Link to="/">Inicio</Link>
        <Icon name="right" size={13} />
        <Link to="/catalogo">Catalogo</Link>
        {catActual && (
          <>
            <Icon name="right" size={13} />
            <span aria-current="page">{catActual.name}</span>
          </>
        )}
      </nav>

      <header className="catalog-head wrap">
        <h1>
          {busqueda
            ? `Resultados para "${busqueda}"`
            : catActual
              ? catActual.name
              : 'Todo el catalogo'}
        </h1>
        <p>
          {busqueda
            ? 'Buscamos en el nombre y en la marca de cada producto.'
            : catActual
              ? `Nuestra seleccion de ${catActual.name.toLowerCase()}, con envio en 24 horas.`
              : 'Vinos, cervezas y destilados elegidos uno por uno.'}
        </p>
      </header>

      <div className="wrap catalog-body">
        <button
          type="button"
          className="filters-toggle"
          onClick={() => setFiltrosAbiertos((v) => !v)}
          aria-expanded={filtrosAbiertos}
        >
          <Icon name="menu" size={18} />
          Filtros
          {hayFiltros && <i className="dot-mini" aria-label="filtros activos" />}
        </button>

        <aside className={`filters ${filtrosAbiertos ? 'is-open' : ''}`.trim()} aria-label="Filtros">
          <section className="facet">
            <h2>Categorias</h2>
            <ul className="facet-links">
              <li>
                <Link to="/catalogo" className={!categoria ? 'is-active' : ''}>
                  Todas
                </Link>
              </li>
              {categorias.map((c) => (
                <li key={c.id}>
                  <Link to={`/catalogo/${c.slug}`} className={categoria === c.slug ? 'is-active' : ''}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="facet">
            <h2>Ofertas</h2>
            <label className="check">
              <input
                type="checkbox"
                checked={soloOferta}
                onChange={(e) => alternarOferta(e.target.checked)}
              />
              <span>Solo en oferta</span>
            </label>
          </section>

          {tope > 0 && (
            <section className="facet">
              <h2>Precio</h2>
              <input
                type="range"
                min={piso}
                max={tope}
                // Un paso de 1 sobre un rango de cientos de miles obligaria a
                // arrastrar el control una eternidad.
                step={Math.max(1, Math.round((tope - piso) / 200))}
                value={precioElegido}
                onChange={filtrar((e) => setPrecioMax(Number(e.target.value)))}
                aria-label="Precio maximo"
              />
              <p className="facet-range">
                <span>{money.format(piso)}</span>
                <b>hasta {money.format(precioElegido)}</b>
              </p>
            </section>
          )}

          <section className="facet">
            <h2>Marca</h2>
            {filtros.marcas.length > MARCAS_VISIBLES && (
              <input
                type="search"
                className="facet-search"
                placeholder={`Buscar entre ${filtros.marcas.length} marcas`}
                value={buscaMarca}
                onChange={(e) => setBuscaMarca(e.target.value)}
                aria-label="Buscar marca"
              />
            )}
            {marcasListadas.map((m) => (
              <label className="check" key={m.name}>
                <input
                  type="checkbox"
                  checked={marcas.includes(m.name)}
                  onChange={() => alternarMarca(m.name)}
                />
                <span>
                  {m.name}
                  {m.count > 0 && <em className="facet-count"> ({m.count})</em>}
                </span>
              </label>
            ))}
            {marcasListadas.length === 0 && <p className="facet-empty">Ninguna marca coincide.</p>}
          </section>

          {hayFiltros && (
            <button type="button" className="btn btn-ghost filters-clear" onClick={limpiar}>
              Limpiar filtros
            </button>
          )}
        </aside>

        <section className="catalog-results" aria-live="polite">
          <div className="catalog-toolbar">
            <p className="catalog-count">
              {cargando && total === 0
                ? 'Buscando productos...'
                : total === 0
                  ? 'No hay productos que coincidan'
                  : `${desde} - ${hasta} de ${total} producto${total === 1 ? '' : 's'}`}
            </p>

            <label className="catalog-sort">
              <span>Ordenar por</span>
              <select value={orden} onChange={filtrar((e) => setOrden(e.target.value))}>
                {ORDENES.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </label>
          </div>

          {error ? (
            <div className="catalog-empty">
              <p>No pudimos traer el catalogo: {error.message}</p>
              <button type="button" className="btn btn-primary" onClick={() => setPagina(pagina)}>
                Reintentar
              </button>
            </div>
          ) : total === 0 && !cargando ? (
            <div className="catalog-empty">
              <p>Proba aflojar los filtros o mirar otra categoria.</p>
              {hayFiltros && (
                <button type="button" className="btn btn-primary" onClick={limpiar}>
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            // Se mantiene la lista anterior mientras llega la nueva pagina, con
            // opacidad reducida: vaciarla haria saltar el alto del contenedor.
            <ul className={`product-grid catalog-grid ${cargando ? 'is-loading' : ''}`.trim()}>
              {productos.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ul>
          )}

          {totalPaginas > 1 && (
            <nav className="pagination" aria-label="Paginacion">
              <button
                type="button"
                onClick={() => setPagina(meta.page - 1)}
                disabled={meta.page <= 1}
                aria-label="Pagina anterior"
              >
                <Icon name="left" size={16} />
              </button>

              {ventanaDePaginas(meta.page, totalPaginas).map((n, i) =>
                n === '...' ? (
                  <span key={`corte-${i}`} className="pagination-gap">...</span>
                ) : (
                  <button
                    key={n}
                    type="button"
                    className={n === meta.page ? 'is-active' : ''}
                    onClick={() => setPagina(n)}
                    aria-current={n === meta.page ? 'page' : undefined}
                  >
                    {n}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => setPagina(meta.page + 1)}
                disabled={meta.page >= totalPaginas}
                aria-label="Pagina siguiente"
              >
                <Icon name="right" size={16} />
              </button>
            </nav>
          )}
        </section>
      </div>
    </main>
  )
}
