import Icon from '../ui/Icon.jsx'
import { services } from '../../data/home.js'

export default function Services() {
  return (
    <section className="services">
      <ul className="wrap services-grid">
        {services.map((s) => (
          <li key={s.id}>
            <Icon name={s.icon} size={26} />
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
