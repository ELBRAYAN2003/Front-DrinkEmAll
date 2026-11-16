# Política de Privacidad y Habeas Data

**DrinkEmAll** — Proyecto Integrador Interdisciplinar 2026
Espacio curricular: Legislación Informática

**Equipo:** Senger, Brian Leonel Miguel - Baumgatner, Jose Ignacio - Riquel, Gaston Azula
**Compliance Officer:** Senger, Brian Leonel Miguel
**Última actualización:** 16 de noviembre de 2026

> Este documento es la versión escrita del texto publicado en la plataforma, en
> la ruta `/privacidad`, accesible desde el pie de todas las páginas.

---

## Estado del proyecto

DrinkEmAll es por ahora una plataforma en desarrollo con catálogo de
demostración. Para comprar hace falta crear una cuenta, y **los datos de la
cuenta se guardan en servidores propios** (punto 3.2). El circuito de compra, en
cambio, es una simulación: **los datos que se ingresan en el formulario de compra
no se envían a ningún servidor ni se almacenan**. Esta política describe el
tratamiento real y vigente, y será revisada cuando la plataforma comience a
operar comercialmente.

---

## 1. Responsable del tratamiento

DrinkEmAll, con domicilio comercial en Juan José Castelli, provincia del Chaco,
República Argentina, es responsable del tratamiento de los datos personales
recolectados a través del sitio.

Consultas sobre esta política o sobre el ejercicio de derechos:
**hola@drinkemall.com**

---

## 2. Marco legal aplicable

El tratamiento se rige por la **Ley 25.326 de Protección de los Datos
Personales**, su decreto reglamentario 1558/2001 y el **artículo 43 de la
Constitución Nacional**, que consagra la acción de habeas data. La autoridad de
control es la **Agencia de Acceso a la Información Pública (AAIP)**.

---

## 3. Datos tratados

### 3.1 Datos que se guardan en el navegador

En el almacenamiento local del navegador, que no viaja a los servidores en cada
pedido:

| Clave | Contenido | Finalidad |
| --- | --- | --- |
| `drinkemall.carrito` | Productos agregados y cantidades | Que el carrito sobreviva a una recarga |
| `drinkemall.edad` | Constancia de declaración de mayoría de edad, con fecha y hora | Acreditar el control de edad |
| `drinkemall.edad.pedidos` | Constancia prestada al confirmar cada pedido | Acreditar el control por operación |
| `drinkemall.sesion` | Nombre, correo y teléfono (si se cargó) de la sesión iniciada, y dos códigos de acceso | Mantener la sesión; se borra al cerrarla |
| `drinkemall.visita` | Fecha de la primera visita | No repetir la invitación a crear una cuenta |

Las claves del carrito, de la edad y de la visita no contienen datos
identificatorios. La de la sesión sí: mientras la sesión está iniciada guarda el
nombre y el correo.

### 3.2 Datos de la cuenta, que se guardan en servidores propios

Al crear una cuenta se solicitan y se guardan en la base de datos del sitio:

- Nombre y apellido.
- DNI (documento nacional de identidad), que identifica a la persona que compra.
  Se admite una sola cuenta por DNI.
- Fecha de nacimiento, que se usa para comprobar que la persona tiene 18 años o
  más al crear la cuenta.
- Correo electrónico, que se usa para ingresar.
- Teléfono, solo si la persona decide cargarlo.
- Contraseña. **No se guarda tal como se escribe**: se transforma con un
  algoritmo de cifrado irreversible (bcrypt), de modo que el responsable no puede
  conocerla.
- La fecha de alta y un identificador de cliente, que es el que se asocia a las
  compras.
- Un registro de las sesiones abiertas: de cada una se guarda una huella cifrada
  del código de renovación (no el código en sí), su vencimiento y si fue
  revocada.

Además, el servidor web registra en un archivo de acceso la dirección IP, la
fecha y la dirección visitada de cada pedido que recibe, por razones de seguridad
y de funcionamiento.

### 3.3 Datos que el formulario de compra solicita y no se guardan

El circuito de compra pide nombre, apellido, correo electrónico, teléfono,
domicilio, ciudad y código postal. En la versión actual **esos datos permanecen
en la memoria del navegador mientras la página está abierta y se descartan al
cerrarla o recargarla**. No se transmiten, no se almacenan y no se comparten con
terceros.

### 3.4 Datos que no se recolectan

- No se utilizan cookies de seguimiento ni analítica de terceros. La única
  excepción es el mapa de Google Maps, que **solo se carga si la persona pulsa
  «Ver el mapa»**: en ese momento Google recibe su conexión y puede usar sus
  propias cookies. El responsable no recibe esa información.
- No se elaboran perfiles ni se toman decisiones automatizadas sobre usuarios.
- No se solicitan datos sensibles en los términos del artículo 2 de la Ley 25.326.
- No se recolectan intencionalmente datos de personas menores de 18 años: el alta
  de cuenta exige una fecha de nacimiento que acredite 18 años cumplidos.

---

## 4. Finalidad del tratamiento

Los datos indicados en 3.1 y 3.2 se tratan con estas finalidades y ninguna otra:

- **Sostener el carrito de compras** entre páginas y recargas.
- **Acreditar el cumplimiento de la prohibición de venta de alcohol a menores**,
  conservando la constancia de la declaración con su fecha y hora.
- **Crear y administrar la cuenta**: permitir ingresar y reconocer a la persona en
  cada visita.
- **Comprobar la mayoría de edad al crear la cuenta**: el servidor rechaza el alta
  de quien no tiene 18 años cumplidos.
- **Identificar a la persona que compra** y permitir verificar su identidad, y con
  ella su mayoría de edad, al momento de la entrega.
- **Asociar las compras a la ficha de cliente**, una vez que el circuito de compra
  esté conectado a los servidores.
- **Proteger el sitio**: el registro de acceso y el límite de intentos de ingreso
  se usan para detectar abusos y fallas.

Los datos no se ceden a terceros ni se usan con fines publicitarios. Cuando la
plataforma opere comercialmente, los datos de contacto y domicilio se tratarán
con la finalidad exclusiva de gestionar, facturar y entregar el pedido.

---

## 5. Base legal y consentimiento

El artículo 5 de la Ley 25.326 exige que el consentimiento sea **libre, expreso e
informado**. En esta plataforma se presta mediante actos afirmativos y explícitos:
la declaración de mayoría de edad al ingresar, la fecha de nacimiento y la casilla
de aceptación de esta política en el alta de cuenta, y la casilla de conformidad
al confirmar el pedido. Ninguna viene marcada por defecto.

> Se deja constancia de que la aceptación de esta política se exige en el
> formulario de alta, pero el sistema todavía no guarda en el servidor una
> constancia de ella con fecha y hora.

---

## 6. Medidas de seguridad

Medidas efectivamente implementadas:

- **Minimización.** Para la cuenta se piden solo los datos necesarios; el
  teléfono es opcional. Del formulario de compra no se guarda nada.
- **Contraseñas protegidas.** Se almacenan únicamente cifradas con bcrypt, nunca
  en texto plano.
- **Conexión cifrada.** Todo el tráfico viaja por HTTPS, con certificado emitido
  por Let's Encrypt.
- **Sesiones acotadas y revocables.** El código de acceso dura un día. El de
  renovación dura siete, se reemplaza en cada uso y se invalida al cerrar sesión
  o al cambiar la contraseña, lo que cierra todas las sesiones abiertas.
- **Límite de intentos.** No se admiten más de diez intentos de ingreso o
  registro en quince minutos.
- **Base de datos aislada.** No está expuesta a internet: solo la alcanza el
  servidor de la aplicación, dentro de la red interna del servicio.
- **Almacenamiento del navegador acotado.** Lo guardado en el navegador es
  accesible únicamente desde el dominio del sitio, por la política de mismo
  origen, y puede borrarse desde la configuración del navegador en cualquier
  momento.
- **Degradación segura.** Si el navegador bloquea el almacenamiento —modo privado
  o configuración restrictiva— el sitio sigue funcionando; la sesión dura hasta
  cerrar la pestaña.
- **Sin transmisión a terceros.** No hay píxeles, balizas ni bibliotecas externas
  de seguimiento, salvo el mapa descripto en 3.4, que solo se carga a pedido.

> Se deja constancia de que lo guardado en el navegador, incluida la sesión,
> puede ser leído por cualquier código que se ejecute en la página. Por eso el
> sitio no carga programas de terceros que no controle.

---

## 7. Plazo de conservación

Los datos del navegador se conservan hasta que la persona usuaria los elimine; la
sesión, hasta que cierre sesión. Los datos de la cuenta se conservan mientras la
cuenta exista y hasta que se solicite su supresión.

El servidor guarda copias de respaldo de la base de datos, que incluyen los datos
de la cuenta, y un registro de acceso que se rota automáticamente y se conserva
por un tiempo limitado (por defecto, unos 90 días).

La constancia de mayoría de edad asociada a un pedido se conservará, cuando exista
operación comercial, por el plazo necesario para acreditar el cumplimiento de la
normativa sobre venta de alcohol.

---

## 8. Derechos ARCO

La Ley 25.326 reconoce a todo titular de datos los siguientes derechos,
ejercitables de forma gratuita:

| | Derecho | Alcance |
| --- | --- | --- |
| **A** | **Acceso** | Solicitar información sobre si se tratan datos suyos, con qué finalidad y de qué fuente provienen. La ley prevé que pueda ejercerse en intervalos no menores a seis meses, salvo interés legítimo acreditado (art. 14). |
| **R** | **Rectificación** | Pedir que se corrijan o actualicen datos inexactos o incompletos. La ley fija un plazo de cinco días hábiles para responder (art. 16). |
| **C** | **Cancelación** | Pedir la supresión de los datos cuando ya no sean necesarios para la finalidad que motivó su recolección, o cuando el tratamiento no se ajuste a la ley. |
| **O** | **Oposición** | Oponerse al tratamiento por motivos legítimos, en particular cuando se destine a publicidad o a la elaboración de perfiles. |

Para ejercerlos, escribir a **hola@drinkemall.com** indicando cuál de los cuatro
derechos se invoca y acreditando identidad. Si la solicitud no fuera atendida,
puede presentarse un reclamo ante la **Agencia de Acceso a la Información
Pública**.

> Los datos de la cuenta pueden consultarse en la página «Mi cuenta». La
> rectificación y la cancelación se solicitan por correo: al cancelar la cuenta se
> eliminarán sus datos de la base, salvo los que deban conservarse por obligación
> legal o por tener compras asociadas. Lo guardado en el navegador puede además
> eliminarse desde su configuración.

---

## 9. Verificación de edad

La venta de bebidas alcohólicas a menores de 18 años está prohibida. El sitio
solicita una declaración de mayoría de edad al ingresar, una fecha de nacimiento al
crear la cuenta y una conformidad específica al confirmar cada pedido. El servidor
rechaza el alta de quien no tiene 18 años cumplidos. Las constancias del ingreso y
del pedido se conservan en el navegador con fecha y hora.

> El DNI y la fecha de nacimiento se registran tal como los informa la persona: el
> sistema no los contrasta con ningún registro oficial ni con una imagen del
> documento, por lo que no acreditan por sí solos la mayoría de edad. La
> verificación efectiva se realiza al entregar el pedido.

> Se deja constancia de que este control opera del lado del cliente y puede
> eludirse borrando el almacenamiento del navegador. Al habilitarse la venta
> efectiva, la verificación será validada también del lado del servidor.

---

## 10. Cambios en esta política

Cualquier modificación se publicará en la misma página con su fecha de
actualización. Los cambios que alteren la finalidad del tratamiento requerirán un
nuevo consentimiento.
