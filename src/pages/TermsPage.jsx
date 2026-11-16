import { Link } from 'react-router'
import Icon from '../components/ui/Icon.jsx'
import { FECHA_TERMINOS, SECCIONES } from '../data/terminos.js'

// Los [DATO PENDIENTE: ...] del texto se resaltan: son lo que el comercio todavia
// tiene que completar, y que no pasen desapercibidos es parte de la idea.
const PENDIENTE = /(\[DATO PENDIENTE[^\]]*\])/g

function Texto({ children }) {
  return children.split(PENDIENTE).map((parte, i) =>
    parte.startsWith('[DATO PENDIENTE') ? (
      <mark className="legal-pendiente" key={i}>
        {parte}
      </mark>
    ) : (
      parte
    ),
  )
}

export default function TermsPage() {
  return (
    <main className="legal">
      <nav className="breadcrumb wrap" aria-label="Miga de pan">
        <Link to="/">Inicio</Link>
        <Icon name="right" size={13} />
        <span aria-current="page">Términos y condiciones</span>
      </nav>

      <article className="wrap legal-doc">
        <header className="legal-head">
          <h1>Términos y condiciones</h1>
          <p className="legal-fecha">Última actualización: {FECHA_TERMINOS}</p>
        </header>

        <div className="legal-aviso">
          <p>
            <b>Borrador en revisión.</b> Los datos del comercio que todavía no están
            confirmados figuran como <mark className="legal-pendiente">[DATO PENDIENTE]</mark>.
            Para arrepentirte de una compra usá el{' '}
            <Link to="/arrepentimiento">BOTÓN DE ARREPENTIMIENTO</Link>.
          </p>
        </div>

        {SECCIONES.map((s) => (
          <section key={s.titulo}>
            <h2>{s.titulo}</h2>
            {s.bloques.map((b, i) =>
              b.ul ? (
                <ul className="legal-lista" key={i}>
                  {b.ul.map((item) => (
                    <li key={item}>
                      <Texto>{item}</Texto>
                    </li>
                  ))}
                </ul>
              ) : (
                <p key={i}>
                  <Texto>{b.p}</Texto>
                </p>
              ),
            )}
          </section>
        ))}
      </article>
    </main>
  )
}
