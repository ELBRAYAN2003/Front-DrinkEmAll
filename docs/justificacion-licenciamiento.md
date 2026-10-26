# Justificación del Modelo de Licenciamiento

**DrinkEmAll** — Proyecto Integrador Interdisciplinar 2026
Espacio curricular: Legislación Informática

**Equipo:** Senger, Brian Leonel Miguel - Baumgatner, Jose Ignacio - Riquel, Gaston Azula

---

## 1. Qué hay que licenciar

La consigna habla del "código fuente de la plataforma web y sus producciones
digitales asociadas". Son dos cosas distintas y el error más común es cubrirlas
con una sola licencia. El proyecto produce:

| Producción | Naturaleza |
| --- | --- |
| Código de la aplicación web (React, CSS, JavaScript) | Software |
| Código del backend (Node, Express, Sequelize) | Software |
| `productos.json` y el arte SVG generado | Datos y obra visual |
| Documentos del portafolio (declaraciones, informes) | Obra literaria |

El software y las obras no-software se rigen por lógicas de licenciamiento
diferentes. Tratarlos igual produce una licencia que no sirve para ninguno de
los dos.

---

## 2. Marco legal argentino

La **Ley 11.723 de Propiedad Intelectual** protege estas producciones. Su
artículo 1 incluye expresamente a **los programas de computación fuente y
objeto** y a **las compilaciones de datos**, incorporados por la Ley 25.036 de
1998.

Dos consecuencias prácticas:

- **La protección nace con la creación.** No hace falta registrar nada para ser
  titular. El registro ante la Dirección Nacional del Derecho de Autor es
  declarativo, no constitutivo.
- **Sin licencia expresa, rige "todos los derechos reservados".** Un repositorio
  sin archivo de licencia no es código abierto: es código cerrado por omisión,
  aunque esté publicado. Nadie puede usarlo legalmente.

Ese último punto es el que vuelve obligatorio tomar una decisión explícita.

---

## 3. Las opciones

### 3.1 Licencia de código cerrado (propietaria)

El titular retiene todos los derechos. Terceros no pueden usar, modificar ni
redistribuir sin autorización expresa.

**A favor:** control total sobre la explotación comercial; posibilidad de vender
licencias de uso; ningún competidor puede partir del trabajo hecho.

**En contra:** impide la colaboración externa; anula el valor del repositorio
como pieza de portafolio verificable; contradice el espíritu de un proyecto
académico formativo; y no aporta protección adicional real frente a una
reimplementación independiente, que de todos modos es legal.

### 3.2 GNU GPL v3 (copyleft fuerte)

Permite usar, estudiar, modificar y redistribuir, **con la condición de que toda
obra derivada se distribuya bajo la misma licencia** y con su código fuente
disponible.

**A favor:** garantiza que las mejoras vuelvan a la comunidad; impide que un
tercero tome el trabajo, lo cierre y lo comercialice sin aportar nada; incluye
una concesión expresa de patentes y cláusulas contra la tivoización.

**En contra:** su carácter viral desalienta a empresas que quieran integrarlo en
productos cerrados, lo que reduce la adopción.

### 3.3 Licencias permisivas (MIT, Apache 2.0)

Permiten casi cualquier uso, incluso cerrado y comercial, con la sola condición
de conservar el aviso de autoría.

**A favor:** máxima adopción; integración sin fricción en cualquier producto.

**En contra:** no obligan a devolver nada. Un competidor puede tomar el código,
cerrarlo y comercializarlo sin contribuir ni reconocer más que una línea de
atribución.

### 3.4 Creative Commons

**No corresponde para software.** Este punto merece desarrollo porque la
consigna las presenta como alternativa equivalente a la GPL, y no lo son.

La propia organización Creative Commons **desaconseja expresamente** el uso de
sus licencias para código fuente, y recomienda en su lugar las licencias de la
Free Software Foundation o la Open Source Initiative. Las razones son concretas:

- Las licencias CC **no distinguen entre código fuente y código objeto**. Una
  obra puede distribuirse compilada cumpliendo la licencia al pie de la letra,
  dejando al receptor sin posibilidad de estudiarla ni modificarla, que es
  justamente lo que una licencia de software libre busca garantizar.
- **No contemplan cláusulas de patentes**, centrales en software y ausentes en
  el diseño de CC, pensado para obras culturales.
- **No son compatibles** con el ecosistema de licencias de software, lo que
  genera conflictos al combinar código de distintas procedencias.

Donde Creative Commons **sí es la herramienta correcta** es en las producciones
no-software: los documentos del portafolio, el arte generado y el catálogo de
datos.

---

## 4. Decisión adoptada: licenciamiento dual

Se adopta un esquema de **dos licencias según el tipo de obra**:

| Producción | Licencia |
| --- | --- |
| Código fuente (frontend y backend) | **GNU GPL v3.0** |
| Documentos, arte generado y catálogo de datos | **CC BY-SA 4.0** |

### Por qué GPL v3 para el código

**Coherencia con el modelo de triple impacto.** El proyecto declara un
compromiso con el valor comunitario. Una licencia copyleft lo hace operativo en
lugar de declamarlo: garantiza que cualquier mejora sobre este trabajo siga
siendo accesible.

**Protección frente al aprovechamiento unilateral.** Una licencia permisiva
permitiría que un competidor tome la plataforma, la cierre y la comercialice sin
devolver nada. La GPL lo impide: puede comercializarla, pero debe publicar el
código de lo que modifique.

**No bloquea la explotación comercial propia.** Este punto suele malinterpretarse.
Al ser titulares de los derechos, el equipo conserva la facultad de **licenciar
el mismo código bajo condiciones distintas** a quien lo solicite. La GPL
restringe a los terceros, no al titular. Es el modelo de licenciamiento dual que
usan numerosos proyectos comerciales.

**Transparencia verificable.** En una plataforma que vende alcohol y declara
controles de edad y tratamiento de datos personales, poder auditar el código es
un respaldo concreto de lo que se afirma en la Política de Privacidad.

### Por qué CC BY-SA 4.0 para las producciones asociadas

Permite reutilizar y adaptar los documentos y el material visual citando la
fuente, y exige que las adaptaciones mantengan la misma apertura. Es la
licencia adecuada para obra no-software, y su cláusula de compartir-igual
mantiene la coherencia con el copyleft elegido para el código.

---

## 5. Implementación

| Archivo | Contenido |
| --- | --- |
| `LICENSE` | Texto completo de la GNU GPL v3.0 |
| `LICENSE-CONTENIDO` | Referencia a CC BY-SA 4.0 para las producciones no-software |
| `README.md` | Sección que explica el alcance de cada una |

El encabezado de licencia debe conservarse en las redistribuciones. Los
titulares de los derechos son los integrantes del equipo: Senger, Brian Leonel Miguel - Baumgatner, Jose Ignacio - Riquel, Gaston Azula.

---

## 6. Lo que esta decisión no resuelve

- **Las dependencias tienen sus propias licencias.** React, Express y Sequelize
  son MIT, compatible con GPL en este sentido de combinación. Incorporar a
  futuro una dependencia con licencia incompatible obligaría a revisar el
  esquema.
- **El arte generado plantea una cuestión abierta.** Las ilustraciones se
  producen por código propio y determinista, de modo que la titularidad es
  clara. Si en el futuro se incorporan imágenes de modelos generativos, su
  protegibilidad queda sujeta al debate analizado en la Declaración Ética de Uso
  de Inteligencia Artificial.
- **Este documento no es asesoramiento legal.** Expresa una decisión fundada del
  equipo; una explotación comercial efectiva amerita revisión profesional.
