# Plan de Casos de Prueba (Test Cases)

**DrinkEmAll** — Proyecto Integrador Interdisciplinar 2026
Espacio curricular: Dirección y Gestión de Proyectos Informáticos

**Equipo:** Senger, Brian Leonel Miguel — Baumgatner, Jose Ignacio — Riquel, Gaston Azula
**Responsable del plan:** Senger, Brian Leonel Miguel — Project Manager
**Fecha de emisión:** 23 de octubre de 2026 · **Sprint:** 3 (Semanas 7 a 9)
**Versión:** 1.0 — plan inicial, previo al lanzamiento final

---

## 1. Propósito y alcance

La Tarea 3.4 del Sprint 3 encomienda *"redactar el plan de pruebas inicial (Test
Cases) para verificar la funcionalidad del carrito, la navegación adaptable y el
cumplimiento de las reglas de negocio antes del lanzamiento final"*.

Este plan especifica **59 casos de prueba** repartidos en cinco conjuntos, cada
uno con su procedimiento y su resultado esperado, redactados de forma que dos
personas distintas que los ejecuten obtengan el mismo veredicto.

**Dentro del alcance:** el frontend de la tienda —carrito, catálogo, ficha de
producto, checkout, verificación de edad y navegación adaptable— tanto en su modo
conectado a la API como en su modo de catálogo estático.

**Fuera del alcance:** las pruebas internas de la API, que corresponden al
repositorio del backend; las pruebas de carga y de seguridad, previstas para
después del lanzamiento; y la compatibilidad con navegadores sin soporte de las
funciones de JavaScript que el proyecto usa.

**Para qué sirve ahora.** Las pruebas todavía se ejecutan a mano. El valor
inmediato del plan es triple: sirve de lista de verificación antes de cada
entrega, define qué significa "terminado" para una tarjeta del tablero, y deja
los casos escritos para que automatizarlos en el Sprint 4 sea transcribirlos y
no diseñarlos.

---

## 2. Estrategia de prueba

| Aspecto | Definición |
| --- | --- |
| **Niveles** | Prueba de componente (lógica aislada: reglas de validación, cálculo de totales, reductor del carrito) y prueba de sistema (recorridos completos en el navegador) |
| **Tipos** | Funcional, de interfaz adaptable, de reglas de negocio y de integración de datos asincrónicos |
| **Técnica de diseño** | Partición de equivalencia y análisis de valores límite. El límite de envío gratis, por ejemplo, se prueba en $79,99, $80,00 y $80,01 |
| **Ejecución actual** | Manual, siguiendo este documento |
| **Ejecución prevista** | Automatizada en el Sprint 4, según el plan de la sección 9 |

### Criterios de entrada

Antes de ejecutar una ronda de pruebas debe cumplirse que el proyecto compile
sin errores (`pnpm build`), que el análisis estático no reporte advertencias
(`pnpm lint`) y que el entorno de prueba de la sección 3 esté disponible.

### Criterios de salida

Una ronda se considera superada cuando **todos los casos de prioridad alta
pasan** y los de prioridad media o baja que fallen quedan registrados como
*issue* en el repositorio, con su número anotado en el registro de ejecución.

---

## 3. Entorno de prueba

| Elemento | Configuración |
| --- | --- |
| Entorno publicado | `https://drinkemall.sbcorp.site` — frontend, API y base de datos en contenedores |
| Entorno local | `pnpm dev` con `VITE_API_URL` configurada (modo API) |
| Modo sin API | `pnpm dev` con `VITE_API_URL` vacía: la tienda lee `public/productos.json` |
| Datos | 1.183 productos y 393 marcas en el modo API; 24 productos en el modo estático |
| Navegadores | Firefox y un navegador basado en Chromium, en sus versiones estables |
| Resoluciones | 1440, 1100, 901, 900, 620, 520 y 460 píxeles de ancho |
| Herramientas | Panel de desarrollo del navegador: pestaña de red, almacenamiento local y modo de diseño adaptable |

> **Los dos modos de datos no son opcionales.** Varios casos se comportan
> distinto con la API conectada y sin ella, y el modo sin API es justamente el
> que exige la consigna. Cada caso indica en qué modo debe ejecutarse.

---

## 4. Convenciones

**Identificación.** `CP-<conjunto>-<número>`, donde el conjunto es CAR (carrito),
NAV (navegación adaptable), NEG (reglas de negocio), VAL (validación del
checkout) o DAT (datos asincrónicos).

**Prioridad.** **A (alta):** bloquea el lanzamiento si falla. **M (media):**
degrada la experiencia, se registra como *issue*. **B (baja):** detalle de
acabado.

**Estado de ejecución.** `Pasa` · `Falla` · `Bloqueado` · `Pendiente`.

---

## 5. Conjunto CAR — Funcionalidad del carrito

| ID | Qué verifica | Procedimiento | Resultado esperado | Pri. |
| --- | --- | --- | --- | :-: |
| **CP-CAR-01** | Agregar un producto | Desde el catálogo, con el carrito vacío, usar "Agregar al carrito" en una tarjeta | El contador de la cabecera pasa a 1 y el producto aparece en `/carrito` con su nombre, precio e imagen | A |
| **CP-CAR-02** | Agregar dos veces el mismo producto | Repetir el agregado sobre el mismo producto | Una sola línea en el carrito con cantidad 2; no se duplica la fila | A |
| **CP-CAR-03** | Aumentar la cantidad | En `/carrito`, usar el control "+" de una línea | La cantidad sube de a uno y el subtotal, el envío y el total se recalculan en el acto | A |
| **CP-CAR-04** | Tope inferior de cantidad | Con cantidad 1, usar el control "−" repetidamente | La cantidad no baja de 1; para eliminar hay que usar el control de quitar | A |
| **CP-CAR-05** | Tope por existencias | Agregar un producto con 3 unidades de *stock* e intentar llegar a 4 | La cantidad se detiene en 3; el control de aumentar queda deshabilitado | A |
| **CP-CAR-06** | Quitar una línea | Usar el control de quitar sobre una de dos líneas | Desaparece solo esa línea y los totales se recalculan con la restante | A |
| **CP-CAR-07** | Vaciado al confirmar | Completar el checkout y confirmar el pedido | El carrito queda vacío y el contador de la cabecera vuelve a estar oculto | A |
| **CP-CAR-08** | Persistencia entre recargas | Con dos productos en el carrito, recargar la página | El carrito conserva las dos líneas con sus cantidades; la clave `drinkemall.carrito` existe en el almacenamiento local | A |
| **CP-CAR-09** | El contador suma unidades | Agregar dos productos distintos y subir uno a cantidad 2 | El contador de la cabecera muestra 3, no 2: cuenta unidades, no líneas | M |
| **CP-CAR-10** | Carrito vacío | Con el carrito vacío, visitar `/carrito` y luego `/checkout` | `/carrito` muestra su estado vacío con salida al catálogo; `/checkout` redirige a `/carrito` | A |
| **CP-CAR-11** | Almacenamiento bloqueado | Abrir el sitio en una ventana privada con el almacenamiento del sitio bloqueado | La tienda carga y el carrito funciona durante la sesión; no se produce ningún error que deje la pantalla en blanco | M |
| **CP-CAR-12** | Dato corrupto almacenado | Escribir `{` en la clave `drinkemall.carrito` y recargar | La tienda arranca con el carrito vacío, sin error visible | M |
| **CP-CAR-13** | Coherencia entre vistas | Con productos en el carrito, comparar el resumen de `/carrito` con el de `/checkout` | Subtotal, envío, IVA y total coinciden exactamente en ambas vistas | M |

---

## 6. Conjunto NAV — Navegación adaptable

Los cortes se verifican con el modo de diseño adaptable del navegador, fijando
el ancho exacto indicado. El corte principal de la cabecera está en 900 píxeles.

| ID | Qué verifica | Procedimiento | Resultado esperado | Pri. |
| --- | --- | --- | --- | :-: |
| **CP-NAV-01** | Cabecera de escritorio | Fijar el ancho en 901 px en la portada | Se ven la barra de categorías y el menú "Más"; el botón de menú lateral no aparece | A |
| **CP-NAV-02** | Cabecera móvil | Fijar el ancho en 900 px | Aparece el botón de menú; la barra de categorías se oculta | A |
| **CP-NAV-03** | Panel lateral | A 900 px o menos, abrir el panel de menú | El panel se despliega con el catálogo y las categorías, y **el fondo deja de desplazarse** mientras está abierto | A |
| **CP-NAV-04** | Cierre del panel | Cerrar el panel con su botón y, en un segundo intento, tocando fuera | Cierra en ambos casos y el desplazamiento del fondo se restablece | A |
| **CP-NAV-05** | Sin desplazamiento horizontal | Recorrer portada, catálogo, ficha, carrito y checkout a 460 px | Ninguna vista desborda a lo ancho; no aparece barra de desplazamiento horizontal | A |
| **CP-NAV-06** | Grilla de productos | Comparar el catálogo a 1440, 1100, 900 y 520 px | La cantidad de columnas se reduce progresivamente y las tarjetas conservan su proporción, sin recortes ni superposiciones | A |
| **CP-NAV-07** | Formulario del checkout | Fijar el ancho en 620 px en el paso 1 del checkout | Los campos pasan a una sola columna y las etiquetas siguen asociadas a su campo | M |
| **CP-NAV-08** | Resumen del pedido | Ver `/carrito` a 1100 px y a 520 px | De columna lateral pasa a bloque apilado debajo del listado, sin perder ninguna cifra | M |
| **CP-NAV-09** | Buscador en móvil | A 520 px, buscar "malbec" desde la cabecera | Lleva a `/catalogo?q=malbec`, muestra resultados y la búsqueda sobrevive a una recarga | M |
| **CP-NAV-10** | Navegación por teclado | Recorrer la cabecera con la tecla de tabulación | El foco pasa por todos los controles en orden visible, con indicación de foco perceptible | B |

---

## 7. Conjunto NEG — Reglas de negocio

| ID | Qué verifica | Procedimiento | Resultado esperado | Pri. |
| --- | --- | --- | --- | :-: |
| **CP-NEG-01** | Puerta de edad al ingresar | Borrar el almacenamiento del sitio y entrar a la portada | Aparece el cartel de verificación antes de poder usar la tienda | A |
| **CP-NEG-02** | Respuesta afirmativa | Responder que se es mayor de 18 | El cartel desaparece y queda la clave `drinkemall.edad` con la marca de aceptación **y la fecha y hora** | A |
| **CP-NEG-03** | Respuesta negativa | Responder que no | Se muestra el aviso de que no puede acceder, con la opción de volver, y no se habilita la tienda | A |
| **CP-NEG-04** | La respuesta persiste | Habiendo aceptado, recargar la página | No vuelve a preguntar | A |
| **CP-NEG-05** | Conformidad del pedido | Confirmar dos pedidos seguidos | La clave `drinkemall.edad.pedidos` acumula **dos** registros, cada uno con su fecha y hora, independientes del ingreso | A |
| **CP-NEG-06** | Envío gratis — límite inferior | Dejar el subtotal en $79,99 con envío a domicilio | El resumen cobra $8 de envío y muestra el aviso de cuánto falta para el envío gratis | A |
| **CP-NEG-07** | Envío gratis — valor exacto | Llegar a un subtotal de $80,00 | El envío pasa a "Gratis" y el aviso desaparece | A |
| **CP-NEG-08** | Retiro en el local | En el paso de entrega, elegir retiro con un subtotal de $20 | El envío es 0 aunque no se alcance el mínimo, y no se piden datos de domicilio | A |
| **CP-NEG-09** | IVA discriminado, no sumado | Con un subtotal de $100 y envío gratis | El total es $100: el IVA se muestra como importe incluido ($17,36), no se suma al total | A |
| **CP-NEG-10** | Producto sin existencias | Abrir la ficha de un producto con *stock* 0 | Se muestra "Sin stock", el botón de agregar queda deshabilitado y los controles de cantidad no responden | A |
| **CP-NEG-11** | Conformidad obligatoria | En el último paso del checkout, intentar confirmar sin marcar la casilla | El botón de confirmar permanece deshabilitado; con la tecla Intro tampoco se registra el pedido | A |
| **CP-NEG-12** | Aviso de envío gratis | Comparar el resumen con el carrito vacío, con $50 y con retiro en el local | El aviso aparece solo con subtotal mayor que cero, menor que $80 y con envío a domicilio | M |
| **CP-NEG-13** | Comprobante de la orden | Confirmar un pedido | La pantalla final informa la fecha y hora de la conformidad y aclara que el pedido es una simulación que no se envía a ningún lado | M |

---

## 8. Conjunto VAL — Validación del checkout

Todos estos casos se ejecutan en el paso 1 o 2 del checkout, con al menos un
producto en el carrito.

| ID | Qué verifica | Procedimiento | Resultado esperado | Pri. |
| --- | --- | --- | --- | :-: |
| **CP-VAL-01** | Paso vacío | Con los cuatro campos vacíos, pulsar "Continuar" | No avanza; aparecen los cuatro mensajes de error y el aviso general del paso | A |
| **CP-VAL-02** | Nombre inválido | Escribir `Brayan2` en el nombre y salir del campo | Mensaje "Usa solo letras" | A |
| **CP-VAL-03** | Nombre con caracteres del idioma | Probar `María José`, `Núñez` y `O'Connor` | Los tres se aceptan sin error | A |
| **CP-VAL-04** | Correo inválido | Probar `brayan`, `brayan@` y `brayan@correo` | Los tres son rechazados con el mensaje de formato | A |
| **CP-VAL-05** | Correo válido | Escribir `brayan@correo.com` | Se acepta y permite avanzar | A |
| **CP-VAL-06** | Teléfono corto | Escribir `362000` | Mensaje de que faltan dígitos | A |
| **CP-VAL-07** | Teléfono con símbolos | Escribir `+54 9 362 000-0000` | Se acepta: se cuentan los dígitos, no los símbolos | A |
| **CP-VAL-08** | Dirección sin altura | Escribir `Calle Falsa` | Mensaje "Falta la altura de la calle" | A |
| **CP-VAL-09** | Código postal | Probar `3500`, `H3500ABC` y `350` | Los dos primeros se aceptan; el tercero se rechaza con el mensaje de formato | A |
| **CP-VAL-10** | Retiro en el local | En el paso 2, elegir retiro y pulsar "Continuar" | Avanza sin pedir dirección, ciudad ni código postal | A |
| **CP-VAL-11** | Salto de pasos | Desde el paso 1 vacío, pulsar el número del paso 4 en el indicador | No salta: queda en el paso 1 con sus errores visibles | A |
| **CP-VAL-12** | Momento del error | Escribir una letra en el nombre y luego borrarla sin salir del campo | El error no aparece mientras se escribe por primera vez; aparece al salir del campo | M |
| **CP-VAL-13** | Corrección en vivo | Con el error de correo visible, completar el correo correctamente | El mensaje desaparece sin necesidad de salir del campo | M |
| **CP-VAL-14** | Volver no borra lo cargado | Completar el paso 1, avanzar y volver | Los datos siguen cargados | M |
| **CP-VAL-15** | Revisión final | Completar todo, llegar al paso 4 y revisar el resumen | Se muestran el contacto cargado y la dirección de entrega tal como se ingresaron | A |

---

## 9. Conjunto DAT — Consumo asincrónico de datos

Este conjunto corresponde a la integración de JavaScript del Sprint 3 y cubre
los riesgos R-09 y R-10 de la matriz reevaluada.

| ID | Qué verifica | Procedimiento | Resultado esperado | Pri. |
| --- | --- | --- | --- | :-: |
| **CP-DAT-01** | Lectura asincrónica del catálogo | En modo sin API, abrir la portada con la pestaña de red abierta | Aparece una petición a `/productos.json` con código 200 y tipo `application/json`; los productos se dibujan a partir de su contenido | A |
| **CP-DAT-02** | Una sola petición compartida | En la misma carga, contar las peticiones a `/productos.json` | Exactamente una, aunque la cabecera, los filtros y la grilla necesiten el catálogo | A |
| **CP-DAT-03** | Respaldo ante API caída | En modo API, detener la API y recargar el catálogo | La tienda muestra el catálogo estático en lugar de quedar vacía | A |
| **CP-DAT-04** | Recuperación tras un fallo | Con el archivo inaccesible, cargar la tienda; restablecerlo y volver a navegar | El segundo intento vuelve a pedir el archivo y muestra los productos; no queda trabada en el error | A |
| **CP-DAT-05** | Respuestas desordenadas | Con la red limitada, escribir y borrar rápido en el buscador | Los resultados mostrados corresponden al último término escrito | A |
| **CP-DAT-06** | Cambio de ficha de producto | Navegar de un producto a otro directamente | No se muestra el producto anterior mientras carga el nuevo | A |
| **CP-DAT-07** | Estados de carga | Recargar el catálogo con la red limitada | Se percibe el estado de carga y no un listado vacío con el mensaje de "no hay productos" | M |
| **CP-DAT-08** | Dirección inexistente | Visitar `/una-ruta-que-no-existe` | Se muestra la página 404 con salidas al inicio y al catálogo | A |

---

## 10. Matriz de cobertura

| Requisito de la consigna | Casos | Riesgo de la matriz que mitiga |
| --- | --- | --- |
| Lógica interactiva del carrito | CP-CAR-01 a CP-CAR-13 | R-07, R-12 |
| Navegación adaptable | CP-NAV-01 a CP-NAV-10 | R-03 |
| Reglas de negocio | CP-NEG-01 a CP-NEG-13 | R-01, R-07 |
| Validación del checkout | CP-VAL-01 a CP-VAL-15 | R-07, R-11 |
| Consumo asincrónico de `productos.json` | CP-DAT-01 a CP-DAT-08 | R-06, R-09, R-10 |

---

## 11. Registro de la primera ronda de ejecución

Ronda ejecutada el 23 de octubre de 2026, al cierre del Sprint 3. Se distingue
**lo verificado** de **lo pendiente**: declarar aprobado un caso que no se
ejecutó sería repetir el error que este sprint detectó en el tablero.

| Conjunto | Ejecutados | Resultado | Evidencia |
| --- | :-: | --- | --- |
| VAL | 9 de 15 — CP-VAL-02 a CP-VAL-10, sobre las reglas | Pasa | Las siete reglas se ejecutaron con 30 juegos de datos —vacíos, tildes, eñes, apóstrofos, correos mal formados, teléfonos con símbolos, direcciones sin altura y códigos postales en los dos formatos— sin ninguna falla |
| DAT | 2 de 8 — CP-DAT-02 y CP-DAT-04 | Pasa | Una simulación de red confirmó que las lecturas simultáneas comparten una única petición y que, tras un error 404, el intento siguiente se recupera y devuelve los 24 productos |
| DAT | CP-DAT-01, parcial | Parcial | El archivo se sirve desde la compilación con código 200 y tipo `application/json` con sus 24 productos; **el dibujado en pantalla a partir de esa respuesta no se verificó** |
| CAR | 0 de 13 | Pendiente | — |
| NAV | 0 de 10 | Pendiente | — |
| NEG | 0 de 13 | Pendiente | — |

**Aclaración sobre el conjunto VAL.** Lo verificado son las reglas, sobre el
módulo de validación y no sobre el formulario dibujado. Eso prueba que las
reglas deciden bien; **no** prueba que el formulario las muestre bien, ni cubre
los casos de comportamiento del formulario —CP-VAL-01, y CP-VAL-11 a
CP-VAL-15—, que quedan pendientes y forman parte de los criterios de salida.

**Verificaciones transversales ejecutadas.** `pnpm lint` sin advertencias y
`pnpm build` sin errores sobre el estado entregado del repositorio.

---

## 12. Plan de automatización para el Sprint 4

| Orden | Qué se automatiza | Por qué primero | Herramienta prevista |
| :-: | --- | --- | --- |
| 1 | Conjunto VAL completo | Son funciones puras sin interfaz: se automatizan tal como están escritas | Ejecutor de pruebas unitarias |
| 2 | Cálculo de totales (CP-NEG-06 a CP-NEG-09, CP-CAR-13) | Reglas de negocio aisladas en un módulo propio, con valores límite ya definidos | Ejecutor de pruebas unitarias |
| 3 | Reductor del carrito (CP-CAR-02 a CP-CAR-06) | Lógica sin interfaz, con topes superior e inferior fáciles de comprobar | Ejecutor de pruebas unitarias |
| 4 | Recorridos del carrito y del checkout | Requieren navegador: son los más caros de automatizar y los que más tardan en correr | Prueba de extremo a extremo |
| 5 | Conjunto NAV | Depende de comparación visual; se evalúa si conviene automatizarlo o mantenerlo manual | A definir |

La condición que hace posible este orden ya está cumplida: durante el Sprint 3
las reglas de validación y el cálculo de totales se escribieron **fuera de los
componentes**, en módulos que pueden ejecutarse sin dibujar nada en pantalla.

---

## 13. Mantenimiento del plan

1. Todo *issue* de defecto que se corrija incorpora un caso nuevo que lo cubra,
   para que la misma falla no vuelva sin ser detectada.
2. El plan se revisa al cierre de cada sprint junto con la matriz de riesgos.
3. Un caso de prioridad alta que falle bloquea la entrega hasta su corrección o
   hasta que el Project Manager lo baje de prioridad por escrito, dejando el
   motivo asentado.

---

**Documento emitido por:** Senger, Brian Leonel Miguel — Project Manager
**Fecha:** 23 de octubre de 2026
**Versión:** 1.0 · Plan inicial del Sprint 3
