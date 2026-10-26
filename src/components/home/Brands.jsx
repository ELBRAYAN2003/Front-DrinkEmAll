import { Link } from 'react-router'

// Marcas de la tira, con su logo de public/img/marcas. Para sumar una basta con
// copiar el archivo a esa carpeta y agregar una linea. Van ordenadas por tipo de
// bebida (cerveza, whisky, gin, ron, tequila, vino). La fila es una grilla de seis
// columnas iguales: con otra cantidad de marcas hay que ajustar `repeat(6, 1fr)`
// en brands-logos para que no quede un logo solo en la ultima fila.
//
// Los logos son marcas registradas de sus duenos, recortados de imagenes elegidas
// por el equipo. Se muestran solo como referencia.
//
// `a` es adonde lleva cada una: Miller no es una marca del catalogo, asi que
// apunta a su categoria en lugar de dejar a alguien en una busqueda vacia. Catena
// Zapata busca por nombre porque sus vinos cuelgan de varias marcas (Catena
// Zapata, D.V. Catena, Nicola Catena, Angelica Zapata).
const MARCAS = [
  { nombre: 'Miller', archivo: 'miller.webp', a: '/catalogo/cervezas' },
  { nombre: 'Johnnie Walker', archivo: 'johnnie-walker.webp', a: '/catalogo?marca=J%20WALKER' },
  { nombre: 'Beefeater', archivo: 'beefeater.webp', a: '/catalogo?marca=BEEFEATER' },
  { nombre: 'Bacardi', archivo: 'bacardi.webp', a: '/catalogo?marca=BACARDI' },
  { nombre: 'Jose Cuervo', archivo: 'jose-cuervo.webp', a: '/catalogo?marca=JOSE%20CUERVO' },
  { nombre: 'Catena Zapata', archivo: 'catena-zapata.webp', a: '/catalogo?q=catena' },
]

export default function Brands() {
  const base = import.meta.env.BASE_URL

  return (
    <section className="brands">
      <div className="wrap">
        <ul className="brands-row brands-logos">
          {MARCAS.map((m) => (
            <li key={m.nombre}>
              <Link to={m.a} aria-label={`Ver productos de ${m.nombre}`}>
                <img src={`${base}img/marcas/${m.archivo}`} alt={m.nombre} loading="lazy" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="brands-note">Las marcas pertenecen a sus respectivos titulares.</p>
      </div>
    </section>
  )
}
