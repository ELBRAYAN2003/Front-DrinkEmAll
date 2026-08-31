import Icon from '../ui/Icon.jsx'
import { contact, footerColumns } from '../../data/home.js'

const SOCIAL = [
  { name: 'facebook', label: 'Facebook' },
  { name: 'instagram', label: 'Instagram' },
  { name: 'x', label: 'X' },
  { name: 'youtube', label: 'YouTube' },
]

const PAYMENTS = ['Visa', 'Mastercard', 'Amex', 'Mercado Pago', 'Transferencia']

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <a className="logo" href="#">
            <span className="logo-mark" aria-hidden="true">D</span>
            <span className="logo-text">
              DrinkEm<em>All</em>
            </span>
          </a>
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

        {footerColumns.map((col) => (
          <nav className="footer-col" key={col.title} aria-label={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#">{l}</a>
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
              <a href="#" aria-label={s.label}>
                <Icon name={s.name} size={18} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
