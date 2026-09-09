import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Icon from '../ui/Icon.jsx'
import { topBar } from '../../data/home.js'
import { useCategorias } from '../../hooks/useCatalogo.js'

// Cuantas categorias van sueltas en la barra; el resto cae en el desplegable.
const EN_LA_BARRA = 5

// Que va primero en la barra. Ordenar solo por cantidad dejaria Cervezas en el
// desplegable —es la octava con 34 productos— y en una tienda de bebidas tiene
// que estar a la vista. Las que no esten en esta lista se ordenan por cantidad.
const PRIORIDAD = ['vinos', 'cervezas', 'whisky', 'gin', 'espumantes']

// Columnas del desplegable, para que no quede una lista larga y angosta.
const POR_COLUMNA = 4

function MegaMenu({ categorias }) {
  const columnas = []
  for (let i = 0; i < categorias.length; i += POR_COLUMNA) {
    columnas.push(categorias.slice(i, i + POR_COLUMNA))
  }

  return (
    <div className="mega">
      <div className="wrap mega-inner">
        {columnas.map((columna) => (
          <div className="mega-col" key={columna[0].id}>
            <ul>
              {columna.map((c) => (
                <li key={c.id}>
                  <Link to={`/catalogo/${c.slug}`}>
                    {c.name} <em className="mega-count">{c.count}</em>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [consulta, setConsulta] = useState('')
  const navigate = useNavigate()
  const categorias = useCategorias()

  // Cada item de la barra es una categoria real. Antes habia grupos inventados
  // ("Destilados", "Sin alcohol") que no existen como categoria: al hacerles
  // clic no habia a donde ir, y "Sin alcohol" ademas no tiene ni un producto.
  const ordenadas = [
    ...PRIORIDAD.map((slug) => categorias.find((c) => c.slug === slug)).filter(Boolean),
    ...categorias.filter((c) => !PRIORIDAD.includes(c.slug)),
  ]
  const enLaBarra = ordenadas.slice(0, EN_LA_BARRA)
  const enElMenu = ordenadas.slice(EN_LA_BARRA)

  // El buscador vive en la cabecera pero los resultados los muestra el catalogo,
  // que ya sabe filtrar contra la API. Se le pasa el termino por la URL para que
  // la busqueda quede compartible y sobreviva a un refresh.
  const buscar = (e) => {
    e.preventDefault()
    const termino = consulta.trim()
    navigate(termino ? `/catalogo?q=${encodeURIComponent(termino)}` : '/catalogo')
    setOpen(false)
  }

  // Bloquea el scroll del fondo mientras el panel movil esta abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="site-header">
      {/* Fila 1: servicio */}
      <div className="header-top">
        <div className="wrap header-top-inner">
          <p className="header-note">{topBar.message}</p>

          <div className="header-top-side">
            <ul className="utility-links">
              {topBar.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>

            <label className="sr-only" htmlFor="lang">Idioma</label>
            <select id="lang" className="bare-select" defaultValue={topBar.languages[0]}>
              {topBar.languages.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>

            <label className="sr-only" htmlFor="curr">Moneda</label>
            <select id="curr" className="bare-select" defaultValue={topBar.currencies[0]}>
              {topBar.currencies.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Fila 2: marca, navegacion, buscador y cuenta, toda sobre el azul */}
      <div className="header-main">
        <form className="wrap header-main-inner" role="search" onSubmit={buscar}>
          <button
            type="button"
            className="burger"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={open}
          >
            <Icon name="menu" size={22} />
          </button>

          <Link className="logo" to="/">
            <span className="logo-mark" aria-hidden="true">D</span>
            <span className="logo-text">
              DrinkEm<em>All</em>
            </span>
          </Link>

          <Link className="cat-toggle" to="/catalogo">
            <Icon name="menu" size={17} />
            Todas las categorias
          </Link>

          <nav className="mainnav" aria-label="Principal">
            <ul className="menu">
              {enLaBarra.map((c) => (
                <li key={c.id}>
                  <Link to={`/catalogo/${c.slug}`}>{c.name}</Link>
                </li>
              ))}

              {enElMenu.length > 0 && (
                <li className="has-mega">
                  <Link to="/catalogo">
                    Mas
                    <Icon name="down" size={13} />
                  </Link>
                  <MegaMenu categorias={enElMenu} />
                </li>
              )}
            </ul>
          </nav>

          <div className="search-box">
            <label className="sr-only" htmlFor="search-q">Buscar productos</label>
            <input
              id="search-q"
              className="search-input"
              type="search"
              placeholder="Buscar vinos, cervezas..."
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
            />
            <button type="submit" className="search-btn" aria-label="Buscar">
              <Icon name="search" size={18} />
            </button>
          </div>

          <div className="header-account">
            <a className="action" href="#">
              <Icon name="user" size={22} />
              <span className="action-text">
                <small>Hola</small>
                <b>Mi cuenta</b>
              </span>
            </a>

            {/* Favoritos se saca entero: no existe la funcionalidad y el enlace
                no llevaba a ningun lado. El contador decia 3. */}

            {/* El carrito conserva el icono pero no el contador ni el importe:
                eran fijos en el JSX y anunciaban dos productos y $61 que nadie
                habia puesto. Vuelven cuando haya carrito de verdad. */}
            <Link className="action" to="/carrito">
              <span className="action-icon">
                <Icon name="cart" size={22} />
              </span>
              <span className="action-text">
                <small>Ver</small>
                <b>Carrito</b>
              </span>
            </Link>
          </div>
        </form>
      </div>

      {/* Panel movil */}
      <div className={`drawer ${open ? 'is-open' : ''}`.trim()}>
        <div className="drawer-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer-head">
            <span className="logo-text">DrinkEm<em>All</em></span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar menu">
              <Icon name="close" size={22} />
            </button>
          </div>
          <ul className="drawer-menu">
            <li>
              <Link to="/catalogo" onClick={() => setOpen(false)}>Todo el catalogo</Link>
            </li>
            {categorias.map((c) => (
              <li key={c.id}>
                <Link to={`/catalogo/${c.slug}`} onClick={() => setOpen(false)}>
                  {c.name} <em className="mega-count">{c.count}</em>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <button type="button" className="drawer-scrim" onClick={() => setOpen(false)} aria-label="Cerrar menu" />
      </div>
    </header>
  )
}
