import { Link } from 'react-router'
import Icon from '../components/ui/Icon.jsx'

// Politica de Privacidad y clausula de Habeas Data.
//
// El contenido describe lo que la aplicacion hace de verdad. Hoy hay dos
// tratamientos distintos: lo que queda en el navegador (carrito, constancias de
// edad, sesion, aviso de primera visita) y los datos de la cuenta, que SI se
// guardan en el servidor, y los pedidos, que tambien se guardan (domicilio,
// telefono de contacto, productos y forma de pago). Si cambia lo que el checkout
// envia o el backend guarda de un pedido, este texto hay que revisarlo.

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
          <p className="legal-fecha">Ultima actualizacion: 16 de noviembre de 2026</p>
        </header>

        <div className="legal-aviso">
          <p>
            <b>Estado del proyecto.</b> DrinkEmAll es por ahora una plataforma en
            desarrollo. Para comprar hace falta crear una cuenta, y{' '}
            <b>los datos de la cuenta y de cada pedido se guardan en nuestros
            servidores</b> (puntos 3.2 y 3.3). Esta politica describe el
            tratamiento real y vigente, y sera revisada cuando cambie la forma
            de operar de la plataforma.
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

          <h3>3.1 Datos que se guardan en su navegador</h3>
          <p>
            En el almacenamiento local de su navegador, que no viaja a nuestros
            servidores en cada pedido:
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
              <code>drinkemall.sesion</code> — la sesion iniciada: su nombre, su
              correo y su telefono (si lo cargo) y dos codigos de acceso. Se borra
              al cerrar sesion.
            </li>
            <li>
              <code>drinkemall.visita</code> — la fecha de su primera visita, para
              no repetir la invitacion a crear una cuenta.
            </li>
          </ul>
          <p>
            Las claves del carrito, de la edad y de la visita no contienen datos
            identificatorios. La de la sesion si: mientras la sesion este iniciada
            guarda su nombre y su correo.
          </p>

          <h3>3.2 Datos de la cuenta, que se guardan en nuestros servidores</h3>
          <p>Al crear una cuenta se solicitan y se guardan en la base de datos del sitio:</p>
          <ul className="legal-lista">
            <li>Nombre y apellido.</li>
            <li>
              DNI (documento nacional de identidad), que identifica a la persona
              que compra. Se admite una sola cuenta por DNI.
            </li>
            <li>
              Fecha de nacimiento, que se usa para comprobar que la persona tiene
              18 anos o mas al crear la cuenta.
            </li>
            <li>Correo electronico, que se usa para ingresar.</li>
            <li>Telefono, solo si decide cargarlo.</li>
            <li>
              Contrasena. <b>No se guarda tal como se escribe</b>: se transforma
              con un algoritmo de cifrado irreversible (bcrypt), de modo que ni
              nosotros podemos conocerla.
            </li>
            <li>
              La fecha de alta y un identificador de cliente, que es el que se
              asociara a sus compras.
            </li>
            <li>
              Un registro de las sesiones abiertas: de cada una se guarda una
              huella cifrada del codigo de renovacion (no el codigo en si), su
              vencimiento y si fue revocada.
            </li>
          </ul>
          <p>
            Ademas, el servidor web anota en un registro de acceso la direccion IP,
            la fecha y la direccion visitada de cada pedido que recibe, por razones
            de seguridad y de funcionamiento.
          </p>

          <h3>3.3 Datos de los pedidos</h3>
          <p>
            Al confirmar un pedido se guardan en el servidor: los productos y
            cantidades, el importe (con el costo de envio), la forma de entrega, el
            medio de pago elegido (efectivo o transferencia), el telefono de
            contacto, la nota que usted escriba, la fecha y el estado del pedido y,
            si pidio envio a domicilio, el domicilio (calle y altura, ciudad, codigo
            postal y referencia). El pedido queda asociado a su cuenta.
          </p>
          <p>
            <b>No se guardan datos de tarjetas</b>. Con efectivo o transferencia el
            pago se confirma a mano. Con <b>Mercado Pago</b> usted paga en el sitio
            de Mercado Pago, que procesa la tarjeta o la cuenta bajo sus propios
            terminos y politica de privacidad; a Mercado Pago se le informan los
            productos, el importe, el numero de pedido y el correo de facturacion
            necesarios para cobrar, y de vuelta recibimos el estado y el
            identificador del pago. Estos datos se comunican
            unicamente a las personas del comercio que preparan y entregan el
            pedido, incluido quien lo reparte, que recibe el domicilio, el telefono y
            el nombre necesarios para la entrega. No se ceden a otros terceros.
          </p>

          <h3>3.3 ter Libreta de la cuenta y datos de facturacion</h3>
          <p>
            En cada pedido se guarda una copia de los <b>datos de facturacion</b> que
            usted elige: nombre o razon social, tipo y numero de documento (DNI o
            CUIT) y correo. Es necesaria para emitir la factura y se conserva con el
            pedido, aunque despues usted edite o borre sus datos guardados.
          </p>
          <p>
            Si lo pide, puede guardar en su cuenta hasta 10 domicilios y 10 datos de
            facturacion para no escribirlos de nuevo. Puede editarlos o borrarlos
            desde Mi cuenta en cualquier momento. Los ve solamente usted y el
            personal del comercio que prepara y factura sus pedidos.
          </p>

          <h3>3.3 bis Solicitudes de arrepentimiento</h3>
          <p>
            Si usa el <b>botón de arrepentimiento</b> (no requiere cuenta) se guardan
            en el servidor su nombre, el correo o teléfono de contacto, el número de
            pedido y el mensaje si los escribe, la fecha y un código de
            identificacion. Se usan exclusivamente para responder la solicitud
            dentro de las 24 horas y coordinar la devolucion, y las ve solamente
            el personal del comercio. Se conservan mientras sea necesario para
            acreditar el cumplimiento de la normativa de defensa del consumidor
            (plazo exacto pendiente de definir por el comercio).
          </p>

          <h3>3.4 Datos que no recolectamos</h3>
          <ul className="legal-lista">
            <li>
              No utilizamos cookies de seguimiento ni analitica de terceros. La
              unica excepcion es el mapa de Google Maps, que{' '}
              <b>solo se carga si la persona pulsa «Ver el mapa»</b>: en ese
              momento Google recibe su conexion y puede usar sus propias cookies.
              DrinkEmAll no recibe esa informacion.
            </li>
            <li>No elaboramos perfiles ni tomamos decisiones automatizadas sobre usuarios.</li>
            <li>No solicitamos datos sensibles en los terminos del articulo 2 de la Ley 25.326.</li>
            <li>
              No recolectamos intencionalmente datos de personas menores de 18
              anos: el alta de cuenta exige una fecha de nacimiento que acredite 18 anos
              cumplidos.
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Finalidad del tratamiento</h2>
          <p>Los datos indicados en los puntos 3.1 y 3.2 se tratan con estas finalidades y ninguna otra:</p>
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
            <li>
              <b>Crear y administrar la cuenta</b>: permitirle ingresar y
              reconocerla en cada visita.
            </li>
            <li>
              <b>Comprobar la mayoria de edad al crear la cuenta</b>: el servidor
              rechaza el alta de quien no tiene 18 anos cumplidos.
            </li>
            <li>
              <b>Identificar a la persona que compra</b> y permitir verificar su
              identidad, y con ella su mayoria de edad, al momento de la entrega.
            </li>
            <li>
              <b>Asociar las compras a su ficha de cliente</b>, una vez que el
              circuito de compra este conectado a nuestros servidores.
            </li>
            <li>
              <b>Proteger el sitio</b>: el registro de acceso y el limite de
              intentos de ingreso se usan para detectar abusos y fallas.
            </li>
          </ul>
          <p>
            Los datos no se ceden a terceros ni se usan con fines publicitarios.
            Los datos de contacto y el domicilio de un pedido se tratan con la
            finalidad exclusiva de gestionar, facturar y entregar ese pedido y de
            acreditar el cumplimiento de la normativa sobre venta de alcohol.
          </p>
        </section>

        <section>
          <h2>5. Base legal y consentimiento</h2>
          <p>
            El articulo 5 de la Ley 25.326 exige que el consentimiento sea{' '}
            <b>libre, expreso e informado</b>. En esta plataforma se presta
            mediante actos afirmativos y explicitos: la declaracion de mayoria de
            edad al ingresar, la fecha de nacimiento y la casilla de aceptacion de
            esta politica en el alta de cuenta, y la casilla de conformidad al
            confirmar el pedido. Ninguna viene marcada por defecto.
          </p>
          <p className="legal-nota">
            Se deja constancia de que la aceptacion de esta politica se exige en el
            formulario de alta, pero el sistema todavia no guarda en el servidor una
            constancia de ella con fecha y hora.
          </p>
        </section>

        <section>
          <h2>6. Medidas de seguridad</h2>
          <p>Medidas efectivamente implementadas:</p>
          <ul className="legal-lista">
            <li>
              <b>Minimizacion.</b> Para la cuenta se piden solo los datos
              necesarios; el telefono es opcional en la cuenta. De cada pedido se
              guarda solo lo necesario para prepararlo y entregarlo.
            </li>
            <li>
              <b>Contrasenas protegidas.</b> Se almacenan unicamente cifradas con
              bcrypt, nunca en texto plano.
            </li>
            <li>
              <b>Conexion cifrada.</b> Todo el trafico viaja por HTTPS, con
              certificado emitido por Let&apos;s Encrypt.
            </li>
            <li>
              <b>Sesiones acotadas y revocables.</b> El codigo de acceso dura un
              dia. El de renovacion dura siete, se reemplaza en cada uso y se
              invalida al cerrar sesion o al cambiar la contrasena, lo que cierra
              todas las sesiones abiertas.
            </li>
            <li>
              <b>Limite de intentos.</b> No se admiten mas de diez intentos de
              ingreso o registro en quince minutos.
            </li>
            <li>
              <b>Base de datos aislada.</b> No esta expuesta a internet: solo la
              alcanza el servidor de la aplicacion, dentro de la red interna del
              servicio.
            </li>
            <li>
              <b>Almacenamiento del navegador acotado.</b> Lo guardado en el
              navegador es accesible unicamente desde el dominio del sitio, por la
              politica de mismo origen, y puede borrarse desde la configuracion del
              navegador en cualquier momento.
            </li>
            <li>
              <b>Degradacion segura.</b> Si el navegador bloquea el almacenamiento
              —modo privado o configuracion restrictiva— el sitio sigue
              funcionando; la sesion dura hasta cerrar la pestana.
            </li>
            <li>
              <b>Sin transmision a terceros.</b> No hay pixeles, balizas ni
              bibliotecas externas de seguimiento, salvo el mapa descripto en el
              punto 3.4, que solo se carga a pedido.
            </li>
          </ul>
          <p className="legal-nota">
            Se deja constancia de que lo guardado en el navegador, incluida la
            sesion, puede ser leido por cualquier codigo que se ejecute en la
            pagina. Por eso el sitio no carga programas de terceros que no controle.
          </p>
        </section>

        <section>
          <h2>7. Plazo de conservacion</h2>
          <p>
            Los datos del navegador se conservan hasta que la persona usuaria los
            elimine; la sesion, hasta que cierre sesion. Los datos de la cuenta se
            conservan mientras la cuenta exista y hasta que se solicite su
            supresion.
          </p>
          <p>
            El servidor guarda copias de respaldo de la base de datos, que incluyen
            los datos de la cuenta, y un registro de acceso que se rota
            automaticamente y se conserva por un tiempo limitado (por defecto,
            unos 90 dias).
          </p>
          <p>
            Los pedidos (con su domicilio y telefono de contacto) se conservan
            mientras sean necesarios para la entrega, los reclamos y las
            obligaciones contables y fiscales del comercio; el plazo exacto esta{' '}
            <b>pendiente de definir por el comercio</b>. Si usted solicita la
            supresion de su cuenta, los pedidos que el comercio deba conservar por
            ley se mantienen sin datos que no sean necesarios.
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
            Los datos de la cuenta pueden consultarse en la pagina «Mi cuenta». La
            rectificacion y la cancelacion se solicitan por correo: al cancelar la
            cuenta se eliminaran sus datos de la base, salvo los que deban
            conservarse por obligacion legal o por tener compras asociadas. Lo
            guardado en el navegador puede ademas eliminarse desde su configuracion.
          </p>
        </section>

        <section>
          <h2>9. Verificacion de edad</h2>
          <p>
            La venta de bebidas alcoholicas a menores de 18 anos esta prohibida. El
            sitio solicita una declaracion de mayoria de edad al ingresar, una fecha
            de nacimiento al crear la cuenta y una conformidad al confirmar cada
            pedido. El servidor rechaza el alta de quien no tiene 18 anos cumplidos
            y vuelve a comprobar la edad al crear cada pedido. La constancia del
            ingreso se conserva en el navegador con fecha y hora.
          </p>
          <p className="legal-nota">
            El DNI y la fecha de nacimiento se registran tal como los informa la
            persona: el sistema no los contrasta con ningun registro oficial ni con
            una imagen del documento, por lo que no acreditan por si solos la
            mayoria de edad. La verificacion efectiva se realiza al entregar el
            pedido.
          </p>
          <p className="legal-nota">
            Se deja constancia de que la declaracion del ingreso opera del lado
            del cliente y puede eludirse borrando el almacenamiento del navegador;
            por eso la edad se decide en el servidor con la fecha de nacimiento de
            la cuenta, y al entregar se pide el DNI: si quien recibe no es mayor
            de 18 anos, el pedido no se entrega.
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
