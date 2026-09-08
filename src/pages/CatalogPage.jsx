import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import Icon from '../components/ui/Icon.jsx'
import ProductCard from '../components/ui/ProductCard.jsx'
import { money } from '../lib/format.js'
import { allProducts, brands, categories } from '../data/home.js'

const POR_PAGINA = 9

const ORDENES = [
  { id: 'relevancia', label: 'Relevancia' },
  { id: 'precio-asc', label: 'Precio: de menor a mayor' },
  { id: 'precio-desc', label: 'Precio: de mayor a menor' },
  { id: 'nombre-asc', label: 'Nombre: A a Z' },
  { id: 'nombre-desc', label: 'Nombre: Z a A' },
  { id: 'puntaje', label: 'Mejor puntuados' },
]

const TOPE_PRECIO = Math.ceil(Math.max(...allProducts.map((p) => p.price)) / 10) * 10

export default function CatalogPage() {
  const { categoria } = useParams()

  const [marcas, setMarcas] = useState([])
  const [soloStock, setSoloStock] = useState(false)
  const [soloOferta, setSoloOferta] = useState(false)
  const [precioMax, setPrecioMax] = useState(TOPE_PRECIO)
  const [orden, setOrden] = useState('relevancia')
  const [pagina, setPagina] = useState(1)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

  const catActual = categories.find((c) => c.id === categoria)

  // Cada filtro vuelve al principio del listado. Se hace en el manejador y no
  // en un efecto: sincronizar estado con estado dentro de useEffect provoca
  // un render extra en cascada.
  const filtrar = (accion) => (...args) => {
    accion(...args)
    setPagina(1)
  }

  const alternarMarca = filtrar((m) =>
    setMarcas((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m])),
  )

  const filtrados = useMemo(() => {
    let out = allProducts.filter((p) => {
      if (categoria && p.category !== categoria) return false
      if (marcas.length && !marcas.includes(p.brand)) return false
      if (soloStock && p.stock === 0) return false
      if (soloOferta && !p.oldPrice) return false
      return p.price <= precioMax
    })

    const orderers = {
      'precio-asc': (a, b) => a.price - b.price,
      'precio-desc': (a, b) => b.price - a.price,
      'nombre-asc': (a, b) => a.name.localeCompare(b.name, 'es'),
      'nombre-desc': (a, b) => b.name.localeCompare(a.name, 'es'),
      puntaje: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
    }
    if (orderers[orden]) out = [...out].sort(orderers[orden])
    return out
  }, [categoria, marcas, soloStock, soloOferta, precioMax, orden])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  // La categoria cambia por navegacion, no por un manejador: si venias de una
  // pagina alta y la nueva tiene menos, se acota aca en vez de quedar vacia.
  const actual = Math.min(pagina, totalPaginas)
  const visibles = filtrados.slice((actual - 1) * POR_PAGINA, actual * POR_PAGINA)
  const desde = filtrados.length === 0 ? 0 : (actual - 1) * POR_PAGINA + 1
  const hasta = Math.min(actual * POR_PAGINA, filtrados.length)

  const hayFiltros = marcas.length > 0 || soloStock || soloOferta || precioMax < TOPE_PRECIO

  const limpiar = () => {
    setMarcas([])
    setSoloStock(false)
    setSoloOferta(false)
    setPrecioMax(TOPE_PRECIO)
  }

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
        <h1>{catActual ? catActual.name : 'Todo el catalogo'}</h1>
        <p>
          {catActual
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
                  <span>{allProducts.length}</span>
                </Link>
              </li>
              {categories.map((c) => {
                const n = allProducts.filter((p) => p.category === c.id).length
                return (
                  <li key={c.id}>
                    <Link to={`/catalogo/${c.id}`} className={categoria === c.id ? 'is-active' : ''}>
                      {c.name}
                      <span>{n}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="facet">
            <h2>Disponibilidad</h2>
            <label className="check">
              <input type="checkbox" checked={soloStock} onChange={filtrar((e) => setSoloStock(e.target.checked))} />
              <span>Solo con stock</span>
            </label>
            <label className="check">
              <input type="checkbox" checked={soloOferta} onChange={filtrar((e) => setSoloOferta(e.target.checked))} />
              <span>Solo en oferta</span>
            </label>
          </section>

          <section className="facet">
            <h2>Precio</h2>
            <input
              type="range"
              min="0"
              max={TOPE_PRECIO}
              step="1"
              value={precioMax}
              onChange={filtrar((e) => setPrecioMax(Number(e.target.value)))}
              aria-label="Precio maximo"
            />
            <p className="facet-range">
              <span>{money.format(0)}</span>
              <b>hasta {money.format(precioMax)}</b>
            </p>
          </section>

          <section className="facet">
            <h2>Marca</h2>
            {brands.map((b) => (
              <label className="check" key={b}>
                <input type="checkbox" checked={marcas.includes(b)} onChange={() => alternarMarca(b)} />
                <span>{b}</span>
              </label>
            ))}
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
              {filtrados.length === 0
                ? 'No hay productos que coincidan'
                : `${desde} - ${hasta} de ${filtrados.length} producto${filtrados.length === 1 ? '' : 's'}`}
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

          {filtrados.length === 0 ? (
            <div className="catalog-empty">
              <p>Proba aflojar los filtros o mirar otra categoria.</p>
              <button type="button" className="btn btn-primary" onClick={limpiar}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <ul className="product-grid catalog-grid">
              {visibles.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ul>
          )}

          {totalPaginas > 1 && (
            <nav className="pagination" aria-label="Paginacion">
              <button
                type="button"
                onClick={() => setPagina(actual - 1)}
                disabled={actual === 1}
                aria-label="Pagina anterior"
              >
                <Icon name="left" size={16} />
              </button>

              {Array.from({ length: totalPaginas }, (_, k) => k + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n === actual ? 'is-active' : ''}
                  onClick={() => setPagina(n)}
                  aria-current={n === actual ? 'page' : undefined}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPagina(actual + 1)}
                disabled={actual === totalPaginas}
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
