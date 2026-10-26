import { useState } from 'react'
import Icon from '../ui/Icon.jsx'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    // Sin backend todavia: solo confirmamos en pantalla.
    setSent(true)
  }

  return (
    <section className="newsletter">
      <div className="wrap newsletter-inner">
        <div className="newsletter-copy">
          <span className="eyebrow">Newsletter</span>
          <h2>Enterate antes que el resto</h2>
          <p>Novedades, reposiciones y descuentos que no publicamos en la tienda.</p>
        </div>

        <form className="newsletter-form" onSubmit={submit}>
          <div className="newsletter-field">
            <label className="sr-only" htmlFor="nl-email">Tu correo</label>
            <input
              id="nl-email"
              type="email"
              required
              placeholder="tunombre@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Suscribirme
              <Icon name="right" size={16} />
            </button>
          </div>

          <label className="newsletter-terms">
            <input type="checkbox" required />
            <span>Acepto recibir correos y la politica de privacidad.</span>
          </label>

          {sent && (
            <p className="newsletter-ok" role="status">
              <Icon name="check" size={16} />
              Listo, te anotamos con {email}.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
