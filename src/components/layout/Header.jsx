import { useEffect, useRef, useState } from 'react'
import GlassCracks from './GlassCracks.jsx'
import Icon from '../ui/Icon.jsx'
import { navigation, searchCategories, topBar } from '../../data/home.js'

function TopBar() {
  return (
    <div className="topbar">
      <div className="wrap topbar-inner">
        <p className="topbar-msg">{topBar.message}</p>

        <div className="topbar-side">
          <ul className="topbar-links">
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
  )
}

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
          <a
            className="mega-promo"
            href="#"
            style={{ '--promo-hue': item.promo.hue }}
          >
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
  const [stuck, setStuck] = useState(false)
  const shell = useRef(null)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 140)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquea el scroll del fondo mientras el panel movil esta abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`site-header ${stuck ? 'is-stuck' : ''}`.trim()} ref={shell}>
      <GlassCracks hostRef={shell} />
      <TopBar />

      <div className="header-main">
        <div className="wrap header-main-inner">
          <button
            type="button"
            className="burger"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={open}
          >
            <Icon name="menu" size={22} />
          </button>

          <a className="logo" href="#">
            <span className="logo-mark" aria-hidden="true">D</span>
            <span className="logo-text">
              DrinkEm<em>All</em>
            </span>
          </a>

          <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
            <label className="sr-only" htmlFor="search-cat">Categoria</label>
            <select id="search-cat" className="search-cat">
              {searchCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="search-q">Buscar productos</label>
            <input id="search-q" type="search" placeholder="Buscar vinos, cervezas, destilados..." />
            <button type="submit" aria-label="Buscar">
              <Icon name="search" size={19} />
            </button>
          </form>

          <div className="header-actions">
            <a className="action" href="#">
              <Icon name="user" size={21} />
              <span className="action-text">
                <small>Hola</small>
                <b>Mi cuenta</b>
              </span>
            </a>
            <a className="action" href="#" aria-label="Favoritos">
              <span className="action-icon">
                <Icon name="heart" size={21} />
                <i className="dot">3</i>
              </span>
            </a>
            <a className="action" href="#">
              <span className="action-icon">
                <Icon name="cart" size={21} />
                <i className="dot">2</i>
              </span>
              <span className="action-text">
                <small>Carrito</small>
                <b>$61</b>
              </span>
            </a>
          </div>
        </div>
      </div>

      <nav className="mainnav" aria-label="Principal">
        <div className="wrap mainnav-inner">
          <ul className="menu">
            {navigation.map((item) => (
              <li key={item.label} className={item.columns ? 'has-mega' : ''}>
                <a href={item.href}>
                  {item.label}
                  {item.columns && <Icon name="down" size={14} />}
                  {item.highlight && <em className="tag">{item.highlight}</em>}
                </a>
                {item.columns && <MegaMenu item={item} />}
              </li>
            ))}
          </ul>

          <p className="mainnav-note">
            <Icon name="truck" size={18} />
            Entregas el mismo dia en Resistencia
          </p>
        </div>
      </nav>

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
                <a href={item.href} onClick={() => setOpen(false)}>{item.label}</a>
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
