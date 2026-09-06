import { useState } from 'react'
import { NAV, PRODUCTS, TRENDING, cms, money } from '../data.js'
import { Bottle } from './Bottle.jsx'
import { Icon, Price } from './ui.jsx'

export function Header() {
  const [active, setActive] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="site-header" onMouseLeave={() => setActive(null)}>
      <div className="topbar">
        <div className="container topbar-inner">
          <p className="topbar-welcome">
            <Icon name="cartOutline" size={15} />
            Welcome to DrinkEmAll Store !!
          </p>
          <div className="topbar-links">
            <a href="#"><Icon name="phone" size={14} /> Call Us Free: (+91) 9876-543-210</a>
            <a href="#"><Icon name="pin" size={14} /> Our Stores</a>
            <a href="#"><Icon name="mail" size={14} /> drinkemall@example.com</a>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container header-main-inner">
          <button
            className="menu-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <Icon name="menu" size={24} />
          </button>

          <a href="#" className="logo">
            <span className="logo-ic" aria-hidden="true">
              <Icon name="beer" size={20} />
            </span>
            DrinkEmAll
          </a>

          <div className="header-search">
            <div className="search-category">
              <span>All Categories</span>
              <Icon name="chevron" size={14} />
            </div>
            <input type="search" placeholder="Search our catalog" aria-label="Search" />
            <button type="submit" aria-label="Search">
              <Icon name="search" size={19} />
            </button>
          </div>

          <div className="header-actions">
            <a href="#" className="h-action" title="My account">
              <Icon name="user" size={22} />
              <span className="h-label">
                Sign in <em>Account</em>
              </span>
            </a>
            <a href="#" className="h-action" title="Wishlist">
              <Icon name="heart" size={22} />
              <span className="h-label">
                Wishlist <em>2 items</em>
              </span>
            </a>
            <div className="h-cart">
              <a href="#" className="h-action" title="Cart">
                <span className="h-cart-ic">
                  <Icon name="cart" size={24} />
                  <b className="h-badge">2</b>
                </span>
                <span className="h-label">
                  Cart <em>2 items  $63.50</em>
                </span>
              </a>
              <div className="cart-drop">
                {[1, 6].map((id) => {
                  const p = PRODUCTS[id]
                  return (
                    <div className="cart-item" key={id}>
                      <Bottle kind={p.kind} />
                      <div>
                        <a href="#" className="ci-name">{p.name}</a>
                        <span className="ci-line">{money(p.price)}</span>
                        <span className="ci-qty">Qty: 1</span>
                      </div>
                      <button className="ci-x" aria-label="Remove">&times;</button>
                    </div>
                  )
                })}
                <div className="cart-summary">
                  <span>Shipping</span><b>Free</b>
                  <span className="cs-total">Total</span><b className="cs-total">$63.50</b>
                </div>
                <div className="cart-btns">
                  <a href="#" className="btn btn-outline">View Cart</a>
                  <a href="#" className="btn btn-gold">Checkout</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="site-nav" onMouseEnter={() => setActive((v) => v)}>
        <div className="container">
          <ul className="nav-list">
            {NAV.map((item) => (
              <li
                key={item.label}
                className={`nav-item${active === item.label ? ' open' : ''}`}
                onMouseEnter={() => setActive(item.label)}
              >
                <a href={item.href} className="nav-link">
                  {item.label}
                  {item.panel && <Icon name="chevron" size={13} className="nav-arrow" />}
                </a>
                {item.panel && (
                  <div className="mega">
                    <MegaPanel item={item} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        {NAV.map((item) => (
          <details key={item.label}>
            <summary>
              <a href={item.href}>{item.label}</a>
            </summary>
            {item.panel === 'shop' && (
              <ul>
                {item.columns.flatMap((c) => c.links).map((l) => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            )}
            {item.panel === 'categories' && (
              <ul>
                {item.children.map((c) => (
                  <li key={c.name}><a href="#">{c.name}</a></li>
                ))}
              </ul>
            )}
            {item.panel === 'elements' && (
              <ul>
                {item.links.map((l) => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            )}
          </details>
        ))}
      </div>
    </header>
  )
}

function MegaPanel({ item }) {
  if (item.panel === 'shop') {
    return (
      <div className="mega-cols">
        {item.columns.map((col) => (
          <div className="mega-col" key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
        <div className="mega-banners">
          {item.banners.map((bn, i) => (
            <a href="#" className={`mega-banner mb-${i + 1}`} key={bn.title}>
              <img src={bn.img} alt="" loading="lazy" />
              <div className="mb-body">
                <em>{bn.caption}</em>
                <b>{bn.title.split(' ').slice(0, 2).join(' ')}</b>
                <span>{bn.sub} - {bn.price}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    )
  }

  if (item.panel === 'categories') {
    return (
      <div className="mega-cols cats">
        {item.children.map((cat) => (
          <div className="mega-col" key={cat.name}>
            <h4><a href="#">{cat.name}</a></h4>
            <ul>
              {cat.children.map((ch) => (
                <li key={ch}><a href="#">{ch}</a></li>
              ))}
            </ul>
          </div>
        ))}
        <div className="mega-bestsellers">
          <h4>Best Selling</h4>
          {[1, 2, 3, 4].map((id) => (
            <ProductMin key={id} id={id} />
          ))}
        </div>
      </div>
    )
  }

  if (item.panel === 'products') {
    return (
      <div className="mega-cols products-hot">
        <div className="mega-blurb">
          <h4>{item.blurb.title}</h4>
          <p>{item.blurb.text}</p>
          <a href="#" className="btn btn-gold">Shop Now</a>
        </div>
        <div className="mega-products">
          {TRENDING.slice(0, 4).map((id) => (
            <ProductMin key={id} id={id} />
          ))}
        </div>
      </div>
    )
  }

  if (item.panel === 'shopby') {
    return (
      <div className="mega-cols shopby">
        <div className="mega-shopby">
          <h4>Shop By</h4>
          <div className="shopby-grid">
            {item.shopBy.map((s) => (
              <a href="#" className="shopby-item" key={s.label}>
                <img src={s.img} alt={s.label} loading="lazy" />
                <span>{s.label}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="mega-bestsellers">
          <h4>Top Rated</h4>
          {[16, 17, 18, 19].map((id) => (
            <ProductMin key={id} id={id} />
          ))}
        </div>
      </div>
    )
  }

  if (item.panel === 'elements') {
    return (
      <div className="mega-cols">
        <div className="mega-col">
          <h4>Elements</h4>
          <ul>
            {item.links.map((l) => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
        </div>
        <div className="mega-banners">
          <a href="#" className="mega-banner mb-1">
            <img src={cms('menu-banner-1.jpg')} alt="" loading="lazy" />
            <div className="mb-body">
              <em>Special offer</em>
              <b>Discount up to 20% OFF</b>
              <span>Top deals - $50</span>
            </div>
          </a>
        </div>
      </div>
    )
  }

  return null
}

function ProductMin({ id }) {
  const p = PRODUCTS[id]
  return (
    <div className="pmin">
      <Bottle kind={p.kind} />
      <div>
        <a href="#" className="pmin-name">{p.name}</a>
        <span className="pmin-brand">{p.brand}</span>
        <Price price={p.price} discount={p.discount} />
      </div>
    </div>
  )
}