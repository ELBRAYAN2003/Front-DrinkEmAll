# Matriz y Registro de Riesgos del Proyecto

**DrinkEmAll** — Proyecto Integrador Interdisciplinar 2026
Espacio curricular: Dirección y Gestión de Proyectos Tecnológicos

**Equipo:** Senger, Brian Leonel Miguel - Baumgatner, Jose Ignacio - Riquel, Gaston Azula
**Fecha de emisión:** 1 de octubre de 2026 · **Sprint:** 2

---

## 1. Metodología

Se sigue el enfoque de gestión de riesgos del PMI: identificación, análisis
cualitativo, planificación de respuesta y seguimiento.

Cada riesgo se evalúa cruzando **probabilidad de ocurrencia** e **impacto sobre
el proyecto**, en escalas de tres niveles:

| Nivel | Probabilidad | Impacto |
| --- | --- | --- |
| **3 — Alta** | Es esperable que ocurra | Compromete la entrega o su validez |
| **2 — Media** | Puede ocurrir | Genera retrabajo significativo |
| **1 — Baja** | Improbable | Molesta, no frena |

La **prioridad** resulta del producto de ambos valores:

| Resultado | Prioridad | Tratamiento |
| --- | --- | --- |
| 6 a 9 | **Crítica** | Plan de acción inmediato y seguimiento semanal |
| 3 a 4 | **Media** | Plan de acción definido, revisión por sprint |
| 1 a 2 | **Baja** | Aceptado y monitoreado |

---

## 2. Registro de riesgos

| ID | Riesgo | Categoría | Prob. | Imp. | Prior. |
| --- | --- | --- | :-: | :-: | :-: |
| R-01 | Control de edad eludible del lado del cliente | Legal / Técnico | 3 | 3 | **9 Crítica** |
| R-02 | Divergencia de ramas e integración tardía | Equipo | 3 | 3 | **9 Crítica** |
| R-03 | La interfaz no resiste el volumen real del catálogo | Técnico | 3 | 2 | **6 Crítica** |
| R-04 | Concentración del trabajo cerca de la fecha de entrega | Tiempos | 3 | 2 | **6 Crítica** |
| R-05 | Configuración de entorno que impide levantar el proyecto | Técnico | 2 | 3 | **6 Crítica** |
| R-06 | Dependencia del backend para validar el frontend | Equipo / Técnico | 3 | 2 | **6 Crítica** |
| R-07 | Ausencia de pruebas automatizadas | Técnico | 2 | 2 | **4 Media** |
| R-08 | Material de terceros con copyright dentro del repositorio | Legal | 1 | 3 | **3 Media** |

---

## 3. Fichas de riesgo

### R-01 · Control de edad eludible del lado del cliente
**Categoría:** Legal / Técnico · **Probabilidad:** Alta · **Impacto:** Alto · **Prioridad: 9 (Crítica)**

La verificación de mayoría de edad se resuelve en el navegador y se almacena
localmente. Cualquier persona puede eludirla borrando el almacenamiento. En una
plataforma que vende alcohol, la responsabilidad por la venta a menores recae
sobre el comercio.

**Plan de acción (prevención).** Validar la conformidad también del lado del
servidor cuando el checkout se conecte a la API, rechazando allí todo pedido sin
constancia. Conservar el registro con fecha y hora para poder acreditarlo.

**Plan de contingencia (mitigación).** Mientras la validación de servidor no
exista, no habilitar la venta efectiva: mantener el circuito como simulación y
dejar la limitación asentada por escrito en la Política de Privacidad, como se
hizo.

---

### R-02 · Divergencia de ramas e integración tardía
**Categoría:** Equipo · **Probabilidad:** Alta · **Impacto:** Alto · **Prioridad: 9 (Crítica)**

Cada integrante trabaja en su propia rama y la integración se posterga. Al
momento de esta emisión, `main` acumula **16 commits de atraso** respecto de
`dev`, y las ramas personales entre 10 y 13.

> **Riesgo ya materializado.** Al integrar una rama se duplicaron componentes en
> dos rutas distintas (`components/Header.jsx` y `components/layout/Header.jsx`,
> entre otros), dejando unas 3.000 líneas sin uso. Git no marcó conflicto porque
> eran archivos distintos: el merge fue limpio y el resultado, incoherente.

**Plan de acción.** Integrar a `dev` al cierre de cada funcionalidad y no al
cierre del sprint. Acordar una única convención de rutas de componentes antes de
trabajar en paralelo sobre la misma área.

**Plan de contingencia.** Ante duplicación, decidir en equipo cuál versión queda
y eliminar la otra en un commit dedicado, antes de seguir construyendo encima.

---

### R-03 · La interfaz no resiste el volumen real del catálogo
**Categoría:** Técnico · **Probabilidad:** Alta · **Impacto:** Medio · **Prioridad: 6 (Crítica)**

El frontend se desarrolló y probó contra 24 productos de maqueta. El backend
tiene cargado un catálogo real de **1.183 productos y 394 marcas**. El filtro de
marcas del catálogo renderiza una casilla por marca: con 394 es inusable.

**Plan de acción.** Probar cada vista contra el catálogo real antes de darla por
terminada. Rediseñar el filtro de marcas con buscador o autocompletado.

**Plan de contingencia.** Limitar provisoriamente la lista a las marcas con más
productos y ofrecer un buscador para el resto.

---

### R-04 · Concentración del trabajo cerca de la fecha de entrega
**Categoría:** Tiempos de entrega · **Probabilidad:** Alta · **Impacto:** Medio · **Prioridad: 6 (Crítica)**

El historial del repositorio muestra el trabajo agrupado en ráfagas separadas
por períodos de inactividad: ocho commits entre el 8 y el 9 de septiembre, luego
**diecinueve días sin actividad**, y seis commits entre el 28 de septiembre y el
1 de octubre, con la entrega fijada para el 2.

**Plan de acción.** Fijar hitos intermedios verificables por semana, no sólo al
cierre del sprint. Usar el tablero Kanban con límite de trabajo en curso para
que el avance sea visible antes de la fecha límite.

**Plan de contingencia.** Ante atraso, priorizar los entregables obligatorios de
la consigna y declarar explícitamente como pendiente lo que no llegue, en lugar
de entregarlo a medias sin aviso.

---

### R-05 · Configuración de entorno que impide levantar el proyecto
**Categoría:** Técnico · **Probabilidad:** Media · **Impacto:** Alto · **Prioridad: 6 (Crítica)**

Un cambio de configuración puede dejar el proyecto sin arrancar en las máquinas
del resto del equipo, bloqueando a todos.

> **Riesgo ya materializado.** Una rama declaró en `package.json` un gestor de
> paquetes inexistente (`pnpm@11.24.0`, con hash de integridad inválido). El
> gestor descargó un archivo de relleno en lugar del binario y **ningún comando
> funcionaba** en esa rama. A eso se sumó un import a un archivo eliminado en
> otra rama durante un merge. La rama quedó inutilizable hasta diagnosticarlo.

**Plan de acción.** No fijar versiones de herramientas sin verificar que existan.
Antes de subir, comprobar que el proyecto instala y arranca desde cero.

**Plan de contingencia.** Ante una rama que no levanta, comparar su configuración
contra una rama que sí funcione: el diferencial suele señalar la causa en
minutos.

---

### R-06 · Dependencia del backend para validar el frontend
**Categoría:** Equipo / Técnico · **Probabilidad:** Alta · **Impacto:** Medio · **Prioridad: 6 (Crítica)**

El frontend consume la API. Si el backend no está corriendo, no se puede validar
el comportamiento real y el avance queda bloqueado por otra persona.

> **Riesgo ya materializado.** Durante toda la jornada de desarrollo del 1 de
> octubre el backend no estuvo disponible, de modo que ninguna vista pudo
> probarse contra datos reales.

**Plan de acción.** Mantener una fuente de datos local que permita trabajar sin
backend. Ya implementada: con `VITE_API_URL` vacía, la tienda lee el catálogo
desde `public/productos.json`.

**Plan de contingencia.** Acordar una ventana semanal con el backend levantado
para validar contra datos reales antes de cada cierre de sprint.

---

### R-07 · Ausencia de pruebas automatizadas
**Categoría:** Técnico · **Probabilidad:** Media · **Impacto:** Medio · **Prioridad: 4 (Media)**

No hay pruebas ni script de test. Cada cambio se valida a ojo, y una regresión
puede pasar inadvertida hasta la demostración.

**Plan de acción.** Incorporar pruebas sobre la lógica con reglas de negocio:
cálculo de totales del carrito, filtrado y orden del catálogo, y adaptación de
datos de la API.

**Plan de contingencia.** Mientras no existan, dejar asentada en el repositorio
una lista de verificación manual con los recorridos críticos a probar antes de
cada entrega.

---

### R-08 · Material de terceros con copyright dentro del repositorio
**Categoría:** Legal · **Probabilidad:** Baja · **Impacto:** Alto · **Prioridad: 3 (Media)**

El directorio de trabajo contiene una copia local de **198 MB** de una plantilla
comercial de terceros, usada como referencia visual. Subirla al repositorio
implicaría redistribuir obra ajena sin licencia.

**Plan de acción.** Mantenerla en `.gitignore` y verificar en cada commit que no
se cuele material de terceros. Dejar constancia escrita de que es material de
consulta y no se redistribuye.

**Plan de contingencia.** Si llegara a commitearse, no alcanza con borrarla en un
commit posterior: hay que reescribir el historial antes de que el repositorio se
haga público.

---

## 4. Riesgos ya materializados

Tres de los ocho riesgos registrados **ya ocurrieron** durante el desarrollo.
Esta matriz no es un ejercicio teórico: documenta lo que pasó y lo que se hizo.

| ID | Qué ocurrió | Resolución |
| --- | --- | --- |
| R-02 | Componentes duplicados en dos rutas tras un merge | Identificado y documentado; falta decidir qué versión queda |
| R-05 | Gestor de paquetes inexistente dejó una rama sin arrancar | Corregido: se eliminó la declaración inválida |
| R-06 | Backend no disponible durante el desarrollo | Mitigado: catálogo local en `productos.json` |

---

## 5. Seguimiento

La matriz se revisa al cierre de cada sprint. En cada revisión corresponde:

1. Reevaluar probabilidad e impacto de los riesgos abiertos.
2. Registrar los que se materializaron y cómo se resolvieron.
3. Incorporar los nuevos que aparezcan.
4. Dar de baja los que dejaron de aplicar, dejando constancia del motivo.
