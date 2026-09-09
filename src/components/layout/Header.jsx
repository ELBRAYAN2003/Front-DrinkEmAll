import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Icon from '../ui/Icon.jsx'
import { navigation, topBar } from '../../data/home.js'

function MegaMenu({ item }) {
  return (
    <div className="mega">
      <div className="wrap mega-inner">
        {item.columns.map((col) => (
          <div className="mega-col" key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {item.promo && (
          <a className="mega-promo" href="#" style={{ '--promo-hue': item.promo.hue }}>
            <span className="mega-promo-sub">{item.promo.subtitle}</span>
            <strong>{item.promo.title}</strong>
            <span className="mega-promo-cta">
              Ver mas <Icon name="right" size={14} />
            </span>
          </a>
        )}
      </div>
    </div>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [consulta, setConsulta] = useState('')
  const navigate = useNavigate()

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
              {navigation.map((item) => (
                <li key={item.label} className={item.columns ? 'has-mega' : ''}>
                  <Link to={item.to}>
                    {item.label}
                    {item.highlight && <em className="tag">{item.highlight}</em>}
                    {item.columns && <Icon name="down" size={13} />}
                  </Link>
                  {item.columns && <MegaMenu item={item} />}
                </li>
              ))}
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

            <a className="action" href="#" aria-label="Favoritos">
              <span className="action-icon">
                <Icon name="heart" size={22} />
                <i className="dot">3</i>
              </span>
            </a>

            <Link className="action" to="/carrito">
              <span className="action-icon">
                <Icon name="cart" size={22} />
                <i className="dot">2</i>
              </span>
              <span className="action-text">
                <small>Carrito</small>
                <b>$61</b>
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
            {navigation.map((item) => (
              <li key={item.label}>
                <Link to={item.to} onClick={() => setOpen(false)}>{item.label}</Link>
                {item.columns && (
                  <ul>
                    {item.columns.flatMap((c) => c.links).map((l) => (
                      <li key={l}>
                        <a href="#" onClick={() => setOpen(false)}>{l}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <button type="button" className="drawer-scrim" onClick={() => setOpen(false)} aria-label="Cerrar menu" />
      </div>
    </header>
  )
}
