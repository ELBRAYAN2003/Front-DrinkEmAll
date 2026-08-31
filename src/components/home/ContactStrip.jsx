import Icon from '../ui/Icon.jsx'
import { contact } from '../../data/home.js'

export default function ContactStrip() {
  return (
    <section className="contact-strip">
      <ul className="wrap contact-grid">
        {contact.map((c) => (
          <li key={c.id}>
            <span className="contact-icon">
              <Icon name={c.icon} size={20} />
            </span>
            <div>
              <h3>{c.title}</h3>
              <p>{c.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
