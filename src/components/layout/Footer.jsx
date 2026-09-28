import { Link } from 'react-router'
import Icon from '../ui/Icon.jsx'
import { contact, footerColumns } from '../../data/home.js'
import { useCategorias } from '../../hooks/useCatalogo.js'

// Cuantas categorias se listan en el pie antes del "Ver todo".
const EN_EL_PIE = 5

const SOCIAL = [
  { name: 'facebook', label: 'Facebook' },
  { name: 'instagram', label: 'Instagram' },
  { name: 'x', label: 'X' },
  { name: 'youtube', label: 'YouTube' },
]

const PAYMENTS = ['Visa', 'Mastercard', 'Amex', 'Mercado Pago', 'Transferencia']

export default function Footer() {
  const categorias = useCategorias()

  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <Link className="logo" to="/">
            <span className="logo-mark" aria-hidden="true">D</span>
            <span className="logo-text">
              DrinkEm<em>All</em>
            </span>
          </Link>
          <p>
            Vinos, cervezas y destilados elegidos con criterio. Guardados como
            corresponde y despachados el mismo dia.
          </p>

          <ul className="footer-contact">
            {contact.map((c) => (
              <li key={c.id}>
                <Icon name={c.icon} size={18} />
                <span>{c.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <nav className="footer-col" aria-label="Tienda">
          <h4>Tienda</h4>
          <ul>
            {categorias.slice(0, EN_EL_PIE).map((c) => (
              <li key={c.id}>
                <Link to={`/catalogo/${c.slug ?? c.id}`}>{c.name}</Link>
              </li>
            ))}
            <li>
              <Link to="/catalogo">Ver todo</Link>
            </li>
          </ul>
        </nav>

        {footerColumns.map((col) => (
          <nav className="footer-col" key={col.title} aria-label={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l}>
                  {/* Texto y no enlace: la seccion todavia no existe. */}
                  <span className="footer-pendiente">{l}</span>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="wrap footer-bottom">
        <p className="copy">
          © {new Date().getFullYear()} DrinkEmAll. Bebe con moderacion. Venta
          prohibida a menores de 18 anos.
        </p>

        <ul className="payments">
          {PAYMENTS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <ul className="social">
          {SOCIAL.map((s) => (
            <li key={s.name}>
              {/* Sin cuenta creada todavia: se muestra el icono sin enlace. */}
              <span aria-label={s.label} title={`${s.label}: proximamente`}>
                <Icon name={s.name} size={18} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
