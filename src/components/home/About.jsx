import Icon from '../ui/Icon.jsx'

// Las fotos son ilustrativas: de un local de bebidas cualquiera, no del de
// DrinkEmAll. Se bajaron de Wikimedia Commons y se sirven desde este mismo
// sitio. Dos son CC BY-SA 4.0 y una CC BY 2.0: las dos licencias exigen
// nombrar al autor, por eso los creditos van visibles al pie de la seccion.
const FOTOS = [
  {
    archivo: 'estantes',
    alt: 'Estantes de madera iluminados con botellas de destilados',
    clase: 'about-photo-tall',
  },
  { archivo: 'repisa', alt: 'Repisa iluminada con botellas de gin y otros destilados' },
  { archivo: 'gins', alt: 'Botellas de gin de distintas marcas en la estanteria de un local' },
]

const CREDITOS = [
  {
    obra: 'Backbar with various bottles of spirits',
    autor: 'Stefan Giesbert',
    licencia: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Backbar_with_various_bottles_of_spirits.jpg',
  },
  {
    obra: 'Backbar with various bottles',
    autor: 'Stefan Giesbert',
    licencia: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Backbar_with_various_bottles.jpg',
  },
  {
    obra: 'Assorted gin bottles on a store shelf',
    autor: 'Jon Worth',
    licencia: 'CC BY 2.0',
    url: 'https://commons.wikimedia.org/wiki/File:Assorted_gin_bottles_on_a_store_shelf.jpg',
  },
]

const VALORES = [
  { titulo: 'Cercania', texto: 'El trato directo de un comercio de barrio, tambien por internet.' },
  { titulo: 'Responsabilidad', texto: 'Vendemos solo a mayores de 18 y lo verificamos en cada pedido.' },
  { titulo: 'Transparencia', texto: 'Precios claros, con el IVA incluido y sin letra chica.' },
  { titulo: 'Comunidad', texto: 'Pensamos el negocio con triple impacto: bueno para la economia local, para la gente y para el entorno.' },
]

export default function About() {
  const base = import.meta.env.BASE_URL

  return (
    <section className="section about" id="nosotros">
      <div className="wrap">
        <div className="about-grid">
          <div className="about-photos">
            {FOTOS.map((f) => (
              <figure key={f.archivo} className={f.clase}>
                <img src={`${base}img/nosotros/${f.archivo}.webp`} alt={f.alt} loading="lazy" />
              </figure>
            ))}
          </div>

          <div className="about-copy">
            <span className="eyebrow">Quienes somos</span>
            <h2>Un local de Castelli que salio a buscar a su gente</h2>
            <p>
              DrinkEmAll nace en un mostrador de Juan Jose Castelli, en el Chaco.
              Hasta ahora, quien queria una buena botella tenia que acercarse al
              local, en horario comercial y con lo que hubiera ese dia en las
              gondolas.
            </p>
            <p>
              Esta tienda es el primer paso digital de ese comercio. No viene a
              reemplazar el mostrador: viene a llegar a quien no puede acercarse,
              a quien compra fuera de hora y a los vecinos de las localidades
              cercanas, donde la oferta es mas corta.
            </p>
            <p>
              Vinos, destilados, cervezas y mas, con la cabeza puesta en lo que
              importa: elegir bien, comprar facil y tomar con responsabilidad.
            </p>
          </div>
        </div>

        <div className="about-pillars">
          <article className="pillar">
            <span className="pillar-icon" aria-hidden="true">
              <Icon name="heart" size={22} />
            </span>
            <h3>Mision</h3>
            <p>
              Acercar bebidas de calidad a todo el Chaco con un servicio cercano,
              simple y responsable, usando la tecnologia para que un comercio de
              barrio llegue mas lejos.
            </p>
          </article>

          <article className="pillar">
            <span className="pillar-icon" aria-hidden="true">
              <Icon name="eye" size={22} />
            </span>
            <h3>Vision</h3>
            <p>
              Ser la tienda de bebidas de referencia del interior chaqueno: un
              comercio local que crece junto a su comunidad sin perder su cara ni
              su trato.
            </p>
          </article>

          <article className="pillar">
            <span className="pillar-icon" aria-hidden="true">
              <Icon name="shield" size={22} />
            </span>
            <h3>Valores</h3>
            <ul>
              {VALORES.map((v) => (
                <li key={v.titulo}>
                  <Icon name="check" size={16} />
                  <span>
                    <b>{v.titulo}.</b> {v.texto}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <p className="about-credits">
          Imagenes ilustrativas: no corresponden al local de DrinkEmAll. Fotos de{' '}
          {CREDITOS.map((c, i) => (
            <span key={c.url}>
              {i > 0 && (i === CREDITOS.length - 1 ? ' y ' : ', ')}
              <a href={c.url} target="_blank" rel="noopener noreferrer">
                {c.obra}
              </a>{' '}
              ({c.autor}, {c.licencia})
            </span>
          ))}
          , via Wikimedia Commons.
        </p>
      </div>
    </section>
  )
}
