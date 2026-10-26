import { Link } from 'react-router'
import Icon from '../components/ui/Icon.jsx'

// Politica de Privacidad y clausula de Habeas Data.
//
// El contenido describe lo que la aplicacion hace de verdad: los datos del
// formulario de compra no se envian ni se guardan, y lo unico que persiste
// son tres claves en el almacenamiento del navegador. Si en algun momento el
// checkout empieza a enviar datos a la API, este texto queda desactualizado y
// hay que revisarlo.

const ARCO = [
  {
    letra: 'A',
    titulo: 'Acceso',
    texto:
      'Solicitar informacion sobre si tratamos datos suyos, con que finalidad y de que fuente provienen. La Ley 25.326 preve que este derecho pueda ejercerse en intervalos no menores a seis meses, salvo que se acredite un interes legitimo.',
  },
  {
    letra: 'R',
    titulo: 'Rectificacion',
    texto:
      'Pedir que se corrijan o actualicen datos inexactos o incompletos. La ley fija un plazo de cinco dias habiles para responder.',
  },
  {
    letra: 'C',
    titulo: 'Cancelacion',
    texto:
      'Pedir la supresion de sus datos cuando ya no sean necesarios para la finalidad que motivo su recoleccion, o cuando el tratamiento no se ajuste a la ley.',
  },
  {
    letra: 'O',
    titulo: 'Oposicion',
    texto:
      'Oponerse al tratamiento de sus datos por motivos legitimos, en particular cuando se destinen a publicidad o a la elaboracion de perfiles.',
  },
]

export default function PrivacyPage() {
  return (
    <main className="legal">
      <nav className="breadcrumb wrap" aria-label="Miga de pan">
        <Link to="/">Inicio</Link>
        <Icon name="right" size={13} />
        <span aria-current="page">Politica de privacidad</span>
      </nav>

      <article className="wrap legal-doc">
        <header className="legal-head">
          <h1>Politica de Privacidad y Habeas Data</h1>
          <p className="legal-fecha">Ultima actualizacion: 1 de octubre de 2026</p>
        </header>

        <div className="legal-aviso">
          <p>
            <b>Estado del proyecto.</b> DrinkEmAll es por ahora una plataforma en
            desarrollo con catalogo de demostracion. El circuito de compra es una
            simulacion: <b>los datos que se ingresan en el formulario no se envian
            a ningun servidor ni se almacenan</b>. Esta politica describe el
            tratamiento real y vigente, y sera revisada cuando la plataforma
            comience a operar comercialmente.
          </p>
        </div>

        <section>
          <h2>1. Responsable del tratamiento</h2>
          <p>
            DrinkEmAll, con domicilio comercial en Juan Jose Castelli, provincia
            del Chaco, Republica Argentina, es responsable del tratamiento de los
            datos personales recolectados a traves de este sitio.
          </p>
          <p>
            Consultas sobre esta politica o sobre el ejercicio de derechos:{' '}
            <b>hola@drinkemall.com</b>
          </p>
        </section>

        <section>
          <h2>2. Marco legal aplicable</h2>
          <p>
            Este tratamiento se rige por la <b>Ley 25.326 de Proteccion de los
            Datos Personales</b>, su decreto reglamentario 1558/2001 y el{' '}
            <b>articulo 43 de la Constitucion Nacional</b>, que consagra la accion
            de habeas data. La autoridad de control es la{' '}
            <b>Agencia de Acceso a la Informacion Publica (AAIP)</b>.
          </p>
        </section>

        <section>
          <h2>3. Que datos se tratan</h2>

          <h3>3.1 Datos que el sitio guarda</h3>
          <p>
            Unicamente en el almacenamiento local de su navegador, y nunca en
            nuestros servidores:
          </p>
          <ul className="legal-lista">
            <li>
              <code>drinkemall.carrito</code> — productos agregados y sus
              cantidades, para que el carrito sobreviva a una recarga.
            </li>
            <li>
              <code>drinkemall.edad</code> — constancia de que declaro ser mayor
              de 18 anos, con fecha y hora.
            </li>
            <li>
              <code>drinkemall.edad.pedidos</code> — constancia de la declaracion
              de mayoria de edad prestada al confirmar cada pedido.
            </li>
          </ul>
          <p>
            Ninguna de estas claves contiene datos identificatorios: no hay en
            ellas nombre, correo, telefono ni domicilio.
          </p>

          <h3>3.2 Datos que el formulario solicita y no se guardan</h3>
          <p>
            El circuito de compra pide nombre, apellido, correo electronico,
            telefono, domicilio, ciudad y codigo postal. En la version actual{' '}
            <b>esos datos permanecen en la memoria del navegador mientras la
            pagina esta abierta y se descartan al cerrarla o recargarla</b>. No se
            transmiten, no se almacenan y no se comparten con terceros.
          </p>

          <h3>3.3 Datos que no recolectamos</h3>
          <ul className="legal-lista">
            <li>No utilizamos cookies de seguimiento ni analitica de terceros.</li>
            <li>No elaboramos perfiles ni tomamos decisiones automatizadas sobre usuarios.</li>
            <li>No solicitamos datos sensibles en los terminos del articulo 2 de la Ley 25.326.</li>
            <li>No recolectamos datos de personas menores de 18 anos.</li>
          </ul>
        </section>

        <section>
          <h2>4. Finalidad del tratamiento</h2>
          <p>Los datos indicados en el punto 3.1 se tratan con estas finalidades y ninguna otra:</p>
          <ul className="legal-lista">
            <li>
              <b>Sostener el carrito de compras</b> entre paginas y recargas, para
              que no haya que volver a cargarlo.
            </li>
            <li>
              <b>Acreditar el cumplimiento de la prohibicion de venta de alcohol a
              menores</b>, conservando la constancia de la declaracion con su
              fecha y hora.
            </li>
          </ul>
          <p>
            Cuando la plataforma opere comercialmente, los datos de contacto y
            domicilio se trataran con la finalidad exclusiva de gestionar,
            facturar y entregar el pedido.
          </p>
        </section>

        <section>
          <h2>5. Base legal y consentimiento</h2>
          <p>
            El articulo 5 de la Ley 25.326 exige que el consentimiento sea{' '}
            <b>libre, expreso e informado</b>. En esta plataforma se presta
            mediante dos actos afirmativos y explicitos: la declaracion de mayoria
            de edad al ingresar y la casilla de conformidad al confirmar el
            pedido. Ninguna de las dos viene marcada por defecto.
          </p>
        </section>

        <section>
          <h2>6. Mecanismos de proteccion del lado del cliente</h2>
          <p>Medidas efectivamente implementadas en la aplicacion:</p>
          <ul className="legal-lista">
            <li>
              <b>Minimizacion.</b> Solo persiste lo indispensable para que el
              carrito y la constancia de edad funcionen. Los datos
              identificatorios del formulario nunca se escriben en disco.
            </li>
            <li>
              <b>Almacenamiento acotado al dispositivo.</b> Lo guardado vive en el
              navegador de la persona usuaria y es accesible unicamente desde el
              dominio del sitio, por la politica de mismo origen.
            </li>
            <li>
              <b>Supresion a cargo del usuario.</b> Cualquiera puede borrar la
              totalidad de los datos desde la configuracion de su navegador, sin
              intervencion nuestra y en cualquier momento.
            </li>
            <li>
              <b>Degradacion segura.</b> Si el navegador bloquea el almacenamiento
              —modo privado o configuracion restrictiva— el sitio sigue
              funcionando sin guardar nada.
            </li>
            <li>
              <b>Sin transmision a terceros.</b> No hay pixeles, balizas ni
              bibliotecas externas de seguimiento.
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Plazo de conservacion</h2>
          <p>
            Los datos del navegador se conservan hasta que la persona usuaria los
            elimine. La constancia de mayoria de edad asociada a un pedido se
            conservara, cuando exista operacion comercial, por el plazo necesario
            para acreditar el cumplimiento de la normativa sobre venta de alcohol.
          </p>
        </section>

        <section>
          <h2>8. Derechos ARCO</h2>
          <p>
            La Ley 25.326 reconoce a todo titular de datos los siguientes
            derechos, ejercitables de forma gratuita:
          </p>

          <ul className="arco">
            {ARCO.map((d) => (
              <li key={d.letra}>
                <span className="arco-letra" aria-hidden="true">{d.letra}</span>
                <div>
                  <h3>{d.titulo}</h3>
                  <p>{d.texto}</p>
                </div>
              </li>
            ))}
          </ul>

          <p>
            Para ejercerlos, escriba a <b>hola@drinkemall.com</b> indicando cual
            de los cuatro derechos invoca y acreditando su identidad. Si considera
            que su solicitud no fue atendida, puede presentar un reclamo ante la{' '}
            <b>Agencia de Acceso a la Informacion Publica</b>, organo de control de
            la Ley 25.326.
          </p>
          <p className="legal-nota">
            Dado que en la version actual no conservamos datos identificatorios en
            nuestros servidores, el ejercicio practico de estos derechos se agota,
            por ahora, con la eliminacion del almacenamiento local desde el propio
            navegador.
          </p>
        </section>

        <section>
          <h2>9. Verificacion de edad</h2>
          <p>
            La venta de bebidas alcoholicas a menores de 18 anos esta prohibida. El
            sitio solicita una declaracion de mayoria de edad al ingresar y una
            conformidad especifica al confirmar cada pedido, y conserva constancia
            de ambas con fecha y hora.
          </p>
          <p className="legal-nota">
            Se deja constancia de que este control opera del lado del cliente y
            puede eludirse borrando el almacenamiento del navegador. Al habilitarse
            la venta efectiva, la verificacion sera validada tambien del lado del
            servidor.
          </p>
        </section>

        <section>
          <h2>10. Cambios en esta politica</h2>
          <p>
            Cualquier modificacion se publicara en esta misma pagina con su fecha
            de actualizacion. Los cambios que alteren la finalidad del tratamiento
            requeriran un nuevo consentimiento.
          </p>
        </section>
      </article>
    </main>
  )
}
