# Registro de Solicitudes de Cambio (Change Requests)

**DrinkEmAll** — Proyecto Integrador Interdisciplinar 2026
Espacio curricular: Dirección y Gestión de Proyectos Informáticos

**Equipo:** Senger, Brian Leonel Miguel — Baumgatner, Jose Ignacio — Riquel, Gaston Azula
**Project Manager y responsable del control de cambios:** Senger, Brian Leonel Miguel
**Fecha de emisión:** 23 de octubre de 2026 · **Sprint:** 3 (Semanas 7 a 9, del 05/10 al 23/10/2026)

---

## 1. Propósito del documento

Este registro documenta la gestión formal de las solicitudes de cambio de
alcance (*Change Requests*) del proyecto DrinkEmAll, conforme a la Tarea 3.3 del
Sprint 3, que encomienda al Project Manager *"gestionar formalmente las
solicitudes de cambio de alcance, evaluando el impacto temporal de nuevas
funcionalidades sobre la fecha límite de entrega"*.

El documento cumple tres funciones:

1. **Dejar asentado qué se pidió** que no estaba en la línea base de alcance,
   quién lo pidió y cuándo.
2. **Justificar la decisión** tomada sobre cada pedido —aprobado, rechazado o
   diferido— con el impacto temporal estimado como criterio principal.
3. **Demostrar la trazabilidad** entre cada cambio aprobado y su evidencia
   verificable en el repositorio: el *issue* que lo registró y el *commit* que lo
   implementó.

Los once cambios registrados abarcan desde el inicio del desarrollo (25/08/2026)
hasta el cierre de este sprint, porque el control de cambios se formalizó en el
Sprint 3 pero el proyecto venía acumulando desvíos de alcance desde antes. En
lugar de registrar solo los del período, se reconstruyó el historial completo a
partir de los *issues* y los *commits*, que son el único registro fehaciente de
lo que efectivamente pasó.

---

## 2. Línea base de alcance

Se toma como línea base el alcance comprometido en las consignas de los Sprints
1 a 3, es decir:

| Origen | Alcance comprometido |
| --- | --- |
| Sprint 1 | Definición de la startup, propuesta de valor de triple impacto y prototipo de identidad visual |
| Sprint 2 | Maquetación adaptable con CSS externo, catálogo estructurado en `productos.json`, documentación de portafolio y Política de Privacidad |
| Sprint 3 | Consumo asincrónico de `productos.json` con Fetch API, lógica del carrito, validación del checkout, Kanban al día, matriz de riesgos reevaluada y plan de casos de prueba |

Todo pedido que agregue, adelante o reemplace trabajo respecto de esa línea base
se trata como solicitud de cambio y se registra en este documento. Las
correcciones de defectos (*bugs*) **no** se tramitan como cambio de alcance: se
resuelven dentro del sprint y se registran como *issues* de corrección. La única
excepción es CR-06, que se incluye porque el volumen de enlaces sin destino
obligó a construir una funcionalidad nueva —la página 404— y no solo a corregir.

---

## 3. Procedimiento de control de cambios

### 3.1 Circuito

| Paso | Qué ocurre | Dónde queda registrado |
| --- | --- | --- |
| 1 — Solicitud | Cualquier integrante, el docente o el PM plantea un cambio | *Issue* en el repositorio de GitHub |
| 2 — Evaluación | El PM estima el esfuerzo y el efecto sobre la fecha de entrega | Este registro |
| 3 — Decisión | Aprobado, aprobado con condición, diferido o rechazado | Este registro y la etiqueta del *issue* |
| 4 — Planificación | Si se aprueba, entra como tarjeta al tablero Kanban del sprint en curso | Tablero digital |
| 5 — Verificación | El *commit* que lo implementa queda vinculado al *issue* | Historial de Git |

### 3.2 Clasificación del impacto temporal

| Nivel | Esfuerzo estimado | Efecto sobre la fecha límite |
| --- | --- | --- |
| **Menor** | hasta 4 h | Absorbible dentro de la semana en curso |
| **Moderado** | de 5 a 12 h | Consume la holgura del sprint y obliga a reordenar el Kanban |
| **Mayor** | más de 12 h | Pone en riesgo la fecha de entrega: se difiere o se rechaza |

> **Sobre las estimaciones.** Las horas indicadas son estimaciones del Project
> Manager hechas al momento de evaluar cada solicitud. El proyecto no lleva
> registro de horas reales trabajadas, de modo que estos valores sirven para
> comparar cambios entre sí y fundamentar una decisión, no como medición.

### 3.3 Criterios de decisión

Un cambio se aprueba cuando cumple **al menos una** de estas condiciones y su
impacto no es mayor:

- Es exigido por una norma legal o por la consigna de una unidad curricular.
- Sin él, un entregable comprometido queda incompleto o no se puede verificar.
- Habilita la evaluación de otro entregable (por ejemplo, el embudo de
  conversión necesita que exista la ficha de producto).

Un cambio se rechaza o difiere cuando su impacto es mayor y no cumple ninguna de
esas condiciones, o cuando el valor que aporta no se corresponde con la
proximidad de la fecha de entrega.

---

## 4. Registro de solicitudes

| ID | Pedido | Cambio solicitado | Impacto | Decisión | Estado |
| --- | :-: | --- | :-: | --- | --- |
| CR-01 | 01/09 | Rediseño de la identidad visual de cabecera y *hero* | Moderado (8 h) | Aprobado con alcance congelado | Cerrado |
| CR-02 | 08/09 | Incorporar la API REST propia como fuente principal del catálogo | Mayor (16 h) | Aprobado con condición | Cerrado |
| CR-03 | 08/09 | Verificación de mayoría de edad al ingresar y al confirmar el pedido | Menor (4 h) | Aprobado | Cerrado |
| CR-04 | 08/09 | Página de detalle de producto | Moderado (6 h) | Aprobado | Cerrado |
| CR-05 | 08/09 | Selectores de idioma y moneda funcionales | Mayor (20 h) | **Rechazado** | Cerrado sin implementar |
| CR-06 | 08/09 | Página 404 y eliminación de los 14 enlaces sin destino | Menor (3 h) | Aprobado | Cerrado |
| CR-07 | 01/10 | Adoptar GPL-3.0 y publicar el repositorio | Menor (2 h) | Aprobado | Cerrado |
| CR-08 | 05/10 | Adelantar al Sprint 3 el despliegue en internet previsto para el Sprint 4 | Moderado (12 h) | Aprobado | Cerrado |
| CR-09 | 19/10 | Reemplazar la importación estática del catálogo por consumo asincrónico | Menor (3 h) | Aprobado | Cerrado |
| CR-10 | 08/09 | Pruebas automatizadas, *error boundary* y estados de carga | Mayor (18 h) | **Diferido al Sprint 4** | Abierto |
| CR-11 | 08/09 | Preparación para producción: enlaces profundos, escala y optimización de imágenes | Mayor (24 h) | **Diferido al Sprint 4** | Abierto |

Todas las fechas de pedido corresponden al año 2026. El solicitante y el tipo
de cada cambio constan en su ficha de la sección 5.

---

## 5. Fichas de las solicitudes

### CR-01 · Rediseño de la identidad visual de cabecera y *hero*

**Solicitado:** 01/09/2026 · **Tipo:** estético · **Impacto:** moderado (8 h) ·
**Decisión:** aprobado con alcance congelado

Se pidió reemplazar la cabecera blanca del prototipo por una barra azul con un
efecto visual que evocara una bebida congelándose, y rehacer el *hero* en dos
columnas con acercamiento al pasar el cursor sobre las tarjetas laterales.

**Evaluación.** El pedido no agregaba funcionalidad, pero la identidad visual es
un entregable del Sprint 1 y la cabecera es el elemento que más se ve. Se aprobó
con un límite: una vez fijada la versión definitiva, no se vuelve a abrir.

**Qué pasó realmente.** El efecto se rehizo cinco veces —vaho, copos de nieve,
vidrio rajado, hielo glaciar y agujas de escarcha— y todas las variantes se
descartaron: tapaban los botones y el texto, o rompían la caja del buscador. La
solución final fue un fondo animado de burbujas en CSS, mucho más simple que
cualquiera de los intentos. Las aproximadamente 6 horas gastadas en las
variantes descartadas son el desvío de alcance más caro del proyecto en relación
con lo que aportaron.

**Decisión derivada.** Desde el 02/09/2026 el alcance estético quedó
**congelado**: los cambios visuales posteriores solo se admiten si corrigen un
problema de legibilidad o de adaptabilidad, no por preferencia.

**Trazabilidad:** *commits* `87e2e9d` (01/09) y `dcbc637` (02/09).

---

### CR-02 · Incorporar la API REST propia como fuente principal del catálogo

**Solicitado:** 08/09/2026 · **Tipo:** ampliación técnica · **Impacto:** mayor
(16 h) · **Decisión:** aprobado con condición

La consigna preveía que el catálogo se leyera de un archivo `productos.json`.
Durante el Sprint 2 el arquitecto de backend tenía en marcha una API REST propia
con base de datos MySQL y 1.183 productos reales, muy por encima de los 24 del
archivo. Se solicitó consumirla como fuente principal.

**Evaluación.** El cambio aportaba una integración real entre los dos
repositorios del equipo y permitía probar la interfaz contra un volumen de datos
verdadero —lo que destapó el riesgo R-03 de la matriz—, pero tenía un impacto
mayor: obligaba a construir una capa de adaptación, manejar estados de carga y
error, y paginar del lado del servidor.

**Condición impuesta.** Se aprobó **a condición de conservar el camino al
archivo estático** como respaldo, por dos razones: la consigna lo exige
explícitamente como entregable, y si la API no responde la tienda debe seguir
mostrando productos. Hoy las dos fuentes conviven: la variable de entorno
`VITE_API_URL` decide cuál se usa, y cuando la API no contesta los *hooks* caen
al archivo en lugar de quedar vacíos.

**Trazabilidad:** *issues* #4, #9, #10 y #11; *commits* `1af5adc`, `3a9397e`,
`55c18a4`, `eb7a2c4`, `d2edad0` y `b7deb6e`.

---

### CR-03 · Verificación de mayoría de edad

**Solicitado:** 08/09/2026 · **Tipo:** requisito legal · **Impacto:** menor
(4 h) · **Decisión:** aprobado

Ninguna consigna pedía un control de edad, pero el producto que vende la
plataforma es alcohol. La Ley N° 24.788 prohíbe su expendio a menores de 18
años, y la responsabilidad por la venta recae sobre el comercio.

**Evaluación.** Impacto menor y condición necesaria para que el circuito de
compra sea presentable: se aprobó sin discusión. Se implementó una conformidad
al ingresar al sitio y una segunda, específica, antes de confirmar el pedido,
ambas registradas con fecha y hora para que queden auditables.

**Limitación declarada.** Es un control del lado del cliente y se elude borrando
el almacenamiento del navegador. Está asentado como riesgo R-01 en la matriz y
como advertencia en el propio código.

**Trazabilidad:** *issue* #8; *commit* `d109d83`.

---

### CR-04 · Página de detalle de producto

**Solicitado:** 08/09/2026 · **Tipo:** ampliación funcional · **Impacto:**
moderado (6 h) · **Decisión:** aprobado

El alcance del Sprint 2 mencionaba el listado del catálogo, no la ficha
individual. Al revisar el documento de Estrategia de Canales y Embudo de
Conversión quedó a la vista que el embudo definido —visita, vista de producto,
agregado al carrito, inicio de checkout, pedido— tenía un escalón sin
implementar: sin ficha de producto, el paso *vista de producto* no existía y la
tasa de conversión no se podía medir ni simular.

**Evaluación.** Un entregable de otra unidad curricular dependía de este cambio.
Se aprobó y se ejecutó en la misma semana.

**Trazabilidad:** *issue* #3; *commit* `f12ecf9`.

---

### CR-05 · Selectores de idioma y moneda funcionales

**Solicitado:** 08/09/2026 · **Tipo:** ampliación funcional · **Impacto:** mayor
(20 h) · **Decisión:** rechazado (revisión de cierre del Sprint 3, 23/10/2026)

La cabecera heredó del prototipo dos selectores —idioma y moneda— que no hacen
nada. Se solicitó hacerlos funcionales.

**Evaluación.** Internacionalizar la tienda implica externalizar todos los
textos, resolver la pluralización, convertir precios con una cotización y
decidir qué pasa con los nombres de producto, que son marcas comerciales y no se
traducen. Estimado en 20 horas, es un cambio mayor.

**Fundamento del rechazo.** DrinkEmAll es un local único de Juan José Castelli,
Chaco: vende en pesos argentinos a clientes de su radio de reparto. No existe el
caso de uso. Aprobar el cambio habría consumido una quinta parte de la capacidad
del sprint para resolver un problema que el negocio no tiene.

**Acción alternativa (sin costo de alcance).** Se decide retirar los dos
selectores de la cabecera en el Sprint 4, porque un control visible que no
responde es peor que su ausencia: promete algo que la tienda no hace. El *issue*
#5 queda abierto como deuda declarada hasta ejecutarlo.

**Trazabilidad:** *issue* #5 (abierto).

---

### CR-06 · Página 404 y eliminación de enlaces sin destino

**Solicitado:** 08/09/2026 · **Tipo:** corrección de alcance · **Impacto:**
menor (3 h) · **Decisión:** aprobado

La maqueta arrastraba **14 enlaces sin destino** copiados del prototipo de
referencia —redes sociales, "mis favoritos", comparador, cuenta de usuario— y no
existía ruta para direcciones inexistentes: escribir cualquier URL mal dejaba la
pantalla en blanco.

**Evaluación.** Se aprobó por impacto menor y porque un enlace que no lleva a
ningún lado invalida la demostración frente al evaluador. Se eliminaron los
enlaces de funcionalidades que no existen —en lugar de dejarlos apuntando a
`#`— y se agregó una página 404 con salidas al inicio y al catálogo.

**Trazabilidad:** *issue* #2; *commit* `0e25969`.

---

### CR-07 · Adoptar GPL-3.0 y publicar el repositorio

**Solicitado:** 01/10/2026 · **Tipo:** legal · **Impacto:** menor (2 h) ·
**Decisión:** aprobado

El proyecto no tenía licencia declarada, lo que por omisión lo deja como obra
cerrada con todos los derechos reservados. Se solicitó adoptar la Licencia
Pública General de GNU versión 3 y publicar el repositorio.

**Evaluación.** Impacto menor y requisito de la unidad curricular de Legislación
Informática, que pide justificar el modelo de licenciamiento. La elección de una
licencia copyleft fuerte es coherente con el posicionamiento de triple impacto
declarado en el Sprint 1.

**Consecuencia asumida.** La GPL-3.0 obliga a que cualquier derivado se
distribuya bajo la misma licencia. El equipo lo asume de forma deliberada: está
fundamentado en el documento de Justificación del Modelo de Licenciamiento.

**Trazabilidad:** *commit* `7521d33`; documento `justificacion-licenciamiento`.

---

### CR-08 · Adelantar el despliegue en internet al Sprint 3

**Solicitado:** 05/10/2026 · **Tipo:** adelanto de alcance · **Impacto:**
moderado (12 h) · **Decisión:** aprobado

La consigna del Sprint 3 aclara que *"la etapa final de cierre, despliegue y
Pitch de Negocios corresponderá al Sprint 4"*. Pese a eso, el PM solicitó
adelantar el despliegue: el equipo ya disponía de un servidor en la nube y un
dominio propios, y tener la tienda en línea permite mostrarla en las revisiones
semanales sin depender de levantar el entorno local de nadie.

**Evaluación.** Es el único cambio del registro que **adelanta** trabajo de un
sprint posterior en lugar de agregarlo. Se aprobó porque se ejecutó al comienzo
de la Semana 7, con holgura, y porque reduce el riesgo R-05 de la matriz
—configuración de entorno que impide levantar el proyecto— al dejar una
instalación de referencia que funciona y no depende de la máquina de cada
integrante.

**Resultado.** La tienda está publicada en `https://drinkemall.sbcorp.site`, con
el frontend, la API y la base de datos en contenedores Docker detrás de un
*proxy* inverso con certificado automático, sirviendo los 1.183 productos y sus
imágenes.

**Costo no previsto.** El despliegue destapó cinco problemas encadenados
—límite de descargas del registro público de imágenes, gestor de paquetes
distinto al relevado, dos dependencias con *scripts* de compilación bloqueados y
un cliente de base de datos que exigía cifrado— que consumieron más tiempo que
el despliegue en sí. Se incorporan al análisis de la matriz de riesgos
reevaluada de este sprint.

**Trazabilidad:** *commits* `29b590f` y `86e821d`; sitio en línea.

---

### CR-09 · Reemplazar la importación estática del catálogo por consumo asincrónico

**Solicitado:** 19/10/2026 · **Tipo:** cambio de requisito · **Impacto:** menor
(3 h) · **Decisión:** aprobado

Al incorporarse el archivo `productos.json` en el Sprint 2 (*commit* `902f92e`),
se resolvió leerlo con una importación en tiempo de compilación, para que los
*hooks* del catálogo siguieran siendo sincrónicos. La Tarea 3.1 del Sprint 3
exige explícitamente consumirlo **con la Fetch API o peticiones asincrónicas con
async/await**, de modo que la implementación existente no satisfacía el
requisito aunque el archivo estuviera en uso.

**Evaluación.** Impacto menor, requisito ineludible de la unidad curricular.
Aprobado y ejecutado el 23/10/2026.

**Qué implicó.** La lectura pasó a `fetch` con `async/await` y memorización del
pedido, para que los cuatro *hooks* que necesitan el catálogo compartan una sola
petición de red. Como la lectura dejó de ser sincrónica, los cuatro *hooks* se
reescribieron con estados de carga; de paso, el archivo salió del paquete
compilado —que bajó de 315 a 309 kB— y ahora se descarga aparte y lo guarda en
caché el navegador.

**Trazabilidad:** *commit* `b7deb6e`.

---

### CR-10 · Pruebas automatizadas, *error boundary* y estados de carga

**Solicitado:** 08/09/2026 · **Tipo:** calidad · **Impacto:** mayor (18 h) ·
**Decisión:** diferido al Sprint 4 (revisión de cierre, 23/10/2026)

El proyecto no tiene una sola prueba automatizada: cada verificación se hace a
mano. Tampoco hay un límite de error que evite que una excepción en un
componente deje la pantalla en blanco.

**Evaluación.** Montar el entorno de pruebas, escribir las pruebas del carrito y
de las reglas de validación, y agregar el límite de error se estimó en 18 horas,
cuando en la Semana 9 ya estaban comprometidas la validación del checkout y tres
documentos de gestión.

**Fundamento del diferimiento.** Se priorizó entregar la funcionalidad exigida y
documentar la estrategia de prueba: el **Plan de Casos de Prueba** de este mismo
sprint deja las pruebas especificadas y ejecutables a mano, de modo que
automatizarlas en el Sprint 4 sea transcribir casos ya escritos y no diseñarlos
desde cero.

> **Error de registro detectado en el cierre.** El *issue* #6 figura cerrado en
> GitHub desde el 08/09/2026 sin que el trabajo se haya realizado. Se cerró por
> error al depurar la lista de *issues*. Queda asentado acá porque un tablero que
> declara terminado lo que no se hizo es peor que un tablero con tarjetas
> atrasadas: el *issue* se reabre y la tarjeta vuelve al tablero como deuda del
> Sprint 4.

**Trazabilidad:** *issue* #6 (a reabrir); documento `plan-de-casos-de-prueba`.

---

### CR-11 · Preparación para producción

**Solicitado:** 08/09/2026 · **Tipo:** técnico · **Impacto:** mayor (24 h) ·
**Decisión:** diferido al Sprint 4 (revisión de cierre, 23/10/2026)

Agrupa los pendientes para que la tienda soporte uso real: enlaces profundos que
sobrevivan a una recarga en todas las vistas, comportamiento de la interfaz con
el catálogo completo de 1.183 productos y optimización de las imágenes, que hoy
pesan 59,5 MB sin tamaños adaptativos.

**Evaluación y fundamento.** Estimado en 24 horas, es el cambio más grande del
registro. La consigna asigna el cierre y la puesta en producción al Sprint 4, de
modo que diferirlo no es postergar trabajo comprometido sino devolverlo al sprint
que le corresponde. El despliegue adelantado (CR-08) ya cubre la parte urgente:
el sitio está en línea y accesible.

**Trazabilidad:** *issue* #7 (abierto).

---

## 6. Impacto acumulado sobre la fecha límite

**Capacidad estimada del sprint.** Tres integrantes con dedicación parcial de
unas 10 horas semanales cada uno, sobre tres semanas: **90 horas** de capacidad
total para el Sprint 3, de las que las tareas ya comprometidas por consigna
—Fetch API, carrito, validación del checkout, Kanban, matriz de riesgos, plan de
pruebas, además de los entregables de las otras dos unidades curriculares—
ocupaban la mayor parte.

| Categoría | Solicitudes | Esfuerzo estimado |
| --- | :-: | :-: |
| Aprobadas (Sprints 2 y 3) | 8 | 54 h |
| Aprobadas que recayeron sobre el Sprint 3 *(subconjunto de la fila anterior)* | 2 | 15 h |
| Rechazadas | 1 | 20 h |
| Diferidas al Sprint 4 | 2 | 42 h |
| **Total solicitado** | **11** | **116 h** |

**Lectura del cuadro.** Se solicitaron 116 horas de cambios sobre una línea base
que no las contemplaba. Se aprobaron 54, de las cuales solo 15 recayeron sobre
el Sprint 3: el despliegue adelantado y el cambio a consumo asincrónico. Las 62
horas restantes —un 53 % de lo solicitado— se rechazaron o difirieron.

**Conclusión del Project Manager.** La fecha límite del 23/10/2026 se sostuvo
sin pedir prórroga, y se sostuvo precisamente por las tres solicitudes que no se
aprobaron. Si CR-05, CR-10 y CR-11 se hubieran admitido en este sprint, habrían
consumido el 69 % de la capacidad total disponible, dejando sin terminar los
entregables obligatorios de las cuatro unidades curriculares. El aprendizaje de
gestión es el del documento entero: **el control de cambios no se ejerce
aprobando con criterio, se ejerce rechazando con fundamento.**

---

## 7. Cambios diferidos: entrada al Sprint 4

Los siguientes puntos ingresan al Sprint 4 como alcance ya evaluado, con su
estimación hecha. No requieren una nueva solicitud: requieren planificación.

| Origen | Trabajo diferido | Estimación |
| --- | --- | :-: |
| CR-05 | Retirar los selectores de idioma y moneda de la cabecera | 1 h |
| CR-10 | Entorno de pruebas, pruebas del carrito y de la validación, y *error boundary* | 18 h |
| CR-11 | Enlaces profundos, comportamiento a escala y optimización de imágenes | 24 h |
| CR-03 | Validación de la conformidad de edad del lado del servidor | 6 h |
| CR-02 | Integración de la rama `dev` a `main`, hoy con 25 *commits* de atraso | 3 h |

---

## 8. Lecciones aprendidas del control de cambios

1. **El alcance estético es el que se desborda más fácil.** CR-01 consumió 8
   horas, 6 de ellas en variantes descartadas, sin agregar una sola
   funcionalidad. Congelar el alcance visual después de fijar la identidad fue la
   decisión que evitó que siguiera creciendo.

2. **Un cambio aprobado con condición es mejor que uno aprobado a secas.** En
   CR-02 la condición de conservar el archivo estático como respaldo resultó
   doblemente útil: salvó un entregable de la consigna y dejó a la tienda
   funcionando cuando la API no responde.

3. **Diferir no es incumplir, si queda escrito.** CR-10 y CR-11 están
   estimados, fundamentados y con fecha de revisión. La diferencia entre deuda
   técnica gestionada y abandono es exactamente este documento.

4. **Un tablero que miente es peor que un tablero atrasado.** El *issue* #6
   cerrado sin trabajo hecho apareció recién en la auditoría de cierre. De ahí la
   regla incorporada al circuito: un *issue* solo se cierra con el *commit* que
   lo resuelve referenciado.

5. **Adelantar trabajo también es un cambio de alcance y se evalúa igual.**
   CR-08 adelantó el despliegue del Sprint 4 y salió bien, pero destapó cinco
   problemas no previstos. Aun cuando el cambio reduce riesgo futuro, el costo
   hay que estimarlo antes, no después.

---

## 9. Trazabilidad consolidada

| CR | *Issue* | *Commit*(s) | Verificación |
| --- | --- | --- | --- |
| CR-01 | — | `87e2e9d`, `dcbc637` | Cabecera y *hero* en producción |
| CR-02 | #4, #9, #10, #11 | `1af5adc`, `3a9397e`, `55c18a4`, `eb7a2c4`, `d2edad0`, `b7deb6e` | Catálogo con 1.183 productos de la API |
| CR-03 | #8 | `d109d83` | Conformidad registrada con fecha y hora |
| CR-04 | #3 | `f12ecf9` | Ruta `/producto/:id` |
| CR-05 | #5 (abierto) | — | Sin implementar, por decisión |
| CR-06 | #2 | `0e25969` | Ruta 404 y ningún enlace sin destino |
| CR-07 | — | `7521d33` | Archivo `LICENSE` y repositorio público |
| CR-08 | — | `29b590f`, `86e821d` | `https://drinkemall.sbcorp.site` |
| CR-09 | — | `b7deb6e` | Petición a `/productos.json` en la pestaña de red |
| CR-10 | #6 (a reabrir) | — | Diferido: plan de pruebas documentado |
| CR-11 | #7 (abierto) | — | Diferido al Sprint 4 |

---

**Documento emitido por:** Senger, Brian Leonel Miguel — Project Manager
**Fecha:** 23 de octubre de 2026
**Revisión:** 1.0 · Cierre del Sprint 3
