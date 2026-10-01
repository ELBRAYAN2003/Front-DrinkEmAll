# Estrategia de Canales y Embudo de Conversión

**DrinkEmAll** — Proyecto Integrador Interdisciplinar 2026
Espacio curricular: El Emprendedor Digital y el Contexto

**Equipo:** Senger, Brian Leonel Miguel - Baumgatner, Jose Ignacio - Riquel, Gaston Azula
**Fecha:** 1 de octubre de 2026 · **Sprint:** 2

---

> ## ⚠ Supuestos a completar antes de entregar
>
> Este documento se redactó sin acceso a los datos reales de la campaña del
> Sprint 1. Los siguientes puntos están marcados en el texto con **[SUPUESTO]**
> y deben reemplazarse por los datos efectivos del equipo:
>
> | Dato | Dónde aparece |
> | --- | --- |
> | Usuario de Instagram comercial | Sección 2 |
> | Formato y temática de las publicaciones del Sprint 1 | Sección 3 |
> | Alcance y seguidores alcanzados | Sección 6 |
> | Radio de reparto efectivo | Sección 2 |
>
> El resto del documento describe el producto **tal como está construido**: las
> rutas, los pasos y los puntos de fricción son los reales y verificables en el
> código.

---

## 1. Qué problema resuelve este embudo

DrinkEmAll parte de un local físico en Juan José Castelli. Su clientela actual
llega caminando. El canal digital no busca reemplazar ese mostrador sino captar
a quien hoy no entra: personas que no pueden trasladarse, que compran fuera del
horario comercial, o que viven en localidades vecinas sin oferta equivalente.

El embudo tiene que resolver un problema concreto: **una persona que ve una foto
de una botella en Instagram está a cinco pasos de comprarla**, y cada paso pierde
gente. El diseño consiste en acortar esos pasos y medir dónde se cae.

---

## 2. Público y canal

**Público objetivo.** Personas mayores de 18 años residentes en Juan José
Castelli y localidades dentro del radio de reparto **[SUPUESTO: definir radio en
kilómetros]**, con uso habitual de redes sociales y acceso a medios de pago
digitales.

**Canal principal: Instagram.** Se elige por tres razones:

1. Es el canal de mayor penetración en el segmento etario objetivo.
2. Las bebidas son un producto **visual**: la botella se vende por la foto.
3. El costo de entrada es nulo, lo que importa en un comercio pequeño que no
   tiene presupuesto publicitario inicial.

**Cuenta comercial:** **[SUPUESTO: completar usuario de Instagram]**

**Canales secundarios** (fuera del alcance de este sprint): WhatsApp Business
para consultas y recompra, y cartelería con código QR en el local físico, que
convierte al cliente presencial en cliente digital sin costo de adquisición.

---

## 3. El embudo, etapa por etapa

Se usa el modelo de tres tramos. Cada etapa indica la **ruta real** de la
aplicación donde ocurre.

### Etapa 1 — Descubrimiento (TOFU)

**Dónde:** Instagram.
**Objetivo:** que la publicación se vea y genere interés.

Contenido del Sprint 1 **[SUPUESTO: describir formato y temática efectivos]**.
El contenido que funciona acá no vende: muestra. Fotos de producto, maridajes,
recomendaciones breves.

**Acción esperada:** tocar el enlace del perfil.

**Punto de fuga.** El enlace vive solo en la biografía: Instagram no permite
enlaces en publicaciones del feed. Cada publicación debe cerrar con una llamada
explícita a "link en bio", porque si no, el interés muere ahí.

---

### Etapa 2 — Consideración (MOFU)

**Dónde:** la portada del sitio, ruta `/`.

Quien llega encuentra, en este orden: el carrusel de destacados, las tarjetas
promocionales, los servicios (envío en 24 horas, cambios, pago protegido), las
categorías y las tendencias.

**Acción esperada:** entrar a una categoría o usar el buscador.

> **Punto de fricción real y deliberado.** Antes de ver nada, aparece la
> **verificación de mayoría de edad**, que bloquea el sitio hasta responder.
> Cuesta conversión y es intencional: la venta de alcohol a menores está
> prohibida y la responsabilidad recae sobre el comercio. Es una fricción que no
> se optimiza.
>
> Lo que sí se optimiza es su costo: la respuesta se recuerda, de modo que se
> pregunta una sola vez por dispositivo y no en cada visita.

---

### Etapa 3 — Exploración

**Dónde:** `/catalogo` y `/catalogo/:categoria`.

El catálogo ofrece filtros por categoría, disponibilidad, rango de precio y
marca, más ordenamiento y paginación. El buscador de la cabecera lleva
directamente acá.

**Decisión de diseño que favorece el embudo:** la categoría viaja en la URL
(`/catalogo/tinto`), de modo que **una publicación de Instagram puede enlazar
directo a la categoría** en lugar de dejar a la persona en la portada. Eso saltea
una etapa completa: quien ve una foto de un tinto llega al listado de tintos, no
a la home.

**Acción esperada:** abrir el detalle de un producto.

---

### Etapa 4 — Decisión (BOFU)

**Dónde:** `/producto/:id`.

Muestra imagen, marca, precio, disponibilidad real, descripción, selector de
cantidad y productos relacionados de la misma categoría.

**Acción esperada:** agregar al carrito.

**Lo que sostiene la decisión:** el stock se muestra como número concreto
("17 disponibles"), no como un genérico "en stock". La disponibilidad verificable
reduce la duda que frena la compra.

---

### Etapa 5 — Conversión

**Dónde:** `/carrito` y `/checkout`.

El carrito permite ajustar cantidades y quitar productos, y **persiste entre
páginas y recargas**: quien se va y vuelve encuentra su selección intacta. El
checkout avanza en cuatro pasos (datos, entrega, pago, confirmación).

**Acciones que reducen el abandono, ya implementadas:**

- **Sin registro obligatorio.** No hay que crear cuenta para comprar. El registro
  forzado es una de las principales causas de abandono de carrito.
- **Envío gratis desde $80**, con aviso de cuánto falta para alcanzarlo. Es un
  incentivo directo a aumentar el ticket.
- **Retiro en el local** como alternativa sin costo de envío.
- **Carrito persistente**, que convierte el abandono en recuperable.

> **Estado actual.** El checkout es una simulación: no envía el pedido a ningún
> servidor. La etapa está construida pero no operativa hasta que se conecte al
> backend.

---

## 4. Diagrama del flujo

```
  INSTAGRAM  ──────────────┐
  (publicación + link bio) │
                           ▼
                    ┌──────────────┐
                    │ Verificación │  ← fricción legal obligatoria
                    │  de edad     │     (se pregunta una sola vez)
                    └──────┬───────┘
                           ▼
         ┌─────────────────────────────────┐
         │  /  portada                     │
         └────────┬────────────────────────┘
                  │        ▲
                  │        └── enlace directo desde Instagram
                  ▼            a /catalogo/:categoria
         ┌─────────────────────────────────┐
         │  /catalogo  listado + filtros   │
         └────────┬────────────────────────┘
                  ▼
         ┌─────────────────────────────────┐
         │  /producto/:id  detalle         │
         └────────┬────────────────────────┘
                  ▼
         ┌─────────────────────────────────┐
         │  /carrito   (persistente)       │
         └────────┬────────────────────────┘
                  ▼
         ┌─────────────────────────────────┐
         │  /checkout  4 pasos             │
         └────────┬────────────────────────┘
                  ▼
              CONVERSIÓN
```

---

## 5. Puntos de fuga identificados

| # | Dónde | Por qué se pierde gente | Qué hacer |
| --- | --- | --- | --- |
| 1 | Instagram → sitio | El enlace solo existe en la biografía | Llamada a la acción explícita en cada publicación |
| 2 | Verificación de edad | Interrumpe antes de mostrar nada | No se elimina: es legal. Se recuerda la respuesta |
| 3 | Portada → catálogo | La portada es larga; el catálogo queda abajo | Enlazar desde Instagram directo a la categoría |
| 4 | Catálogo → producto | 394 marcas en el filtro lo vuelven inusable | Buscador de marcas en el panel de filtros |
| 5 | Carrito → checkout | Aparecen costos no esperados | El envío se muestra antes del checkout, con el faltante para el envío gratis |
| 6 | Checkout | Formulario de cuatro pasos | Sin registro obligatorio; permitir volver a pasos anteriores |

---

## 6. Medición

> **Limitación actual, para declarar en la entrega.** El sitio **no tiene ninguna
> herramienta de analítica instalada**. El embudo descrito no se puede medir hoy:
> está diseñado, no instrumentado. La Política de Privacidad declara
> explícitamente que no se usan cookies de seguimiento ni analítica de terceros,
> de modo que incorporarlas exigiría actualizar ese documento y volver a pedir
> consentimiento.

**Instrumentación propuesta, en orden de implementación:**

1. **Parámetros UTM en el enlace de la biografía.** Es el paso más barato y no
   requiere instalar nada en el sitio: permite distinguir las visitas que llegan
   de Instagram de las que llegan por otro camino.
2. **Métricas nativas de Instagram.** Alcance, impresiones y toques en el enlace
   ya están disponibles en la cuenta comercial sin desarrollo adicional.
3. **Analítica respetuosa de la privacidad**, sin cookies ni datos personales,
   para medir los pasos dentro del sitio. Requiere actualizar la Política de
   Privacidad antes de activarla.

**Indicadores a seguir una vez instrumentado:**

| Etapa | Indicador |
| --- | --- |
| Descubrimiento | Alcance de la publicación **[SUPUESTO: dato del Sprint 1]** |
| Clic al sitio | Toques en el enlace / alcance |
| Consideración | Visitas que pasan de la portada al catálogo |
| Exploración | Visitas que abren una ficha de producto |
| Decisión | Productos agregados al carrito / fichas vistas |
| Conversión | Pedidos confirmados / carritos creados |

Ninguno de estos valores está medido todavía. Se declaran como compromiso de
instrumentación, no como resultado.

---

## 7. Lo que este embudo no resuelve

- **Depende de un solo canal.** Si el alcance orgánico de Instagram cae, el
  embudo se queda sin entrada. Diversificar hacia WhatsApp Business y el QR en
  el local reduce esa dependencia.
- **No contempla recompra.** Está diseñado para la primera venta. Retener es más
  barato que adquirir, y hoy no hay nada construido para eso.
- **El alcance orgánico tiene techo.** Sin presupuesto publicitario, el
  crecimiento depende del contenido y del boca a boca.
- **La última etapa no está operativa.** Mientras el checkout no se conecte al
  backend, el embudo termina en una simulación.
