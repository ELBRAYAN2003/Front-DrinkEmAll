# Declaración Ética de Uso de Inteligencia Artificial

**Contenido sintético en DrinkEmAll**
Documento de transparencia dirigido al usuario final

**Equipo:** Senger, Brian Leonel Miguel - Baumgatner, Jose Ignacio - Riquel, Gaston Azula

> Este documento describe prácticas y analiza el estado de un debate jurídico
> abierto. No constituye asesoramiento legal. Antes de la puesta en producción
> comercial corresponde validación por profesional del derecho.

---

## 1. Qué contenido de esta tienda es sintético

Durante la etapa de desarrollo y demostración, **la totalidad del catálogo de
DrinkEmAll es ficticio**. Ningún producto exhibido corresponde a una bebida real
en venta.

Concretamente, es contenido generado y no real:

| Elemento | Origen | Estado |
| --- | --- | --- |
| Nombres de producto | Redacción asistida por IA | Ficticio |
| Marcas y bodegas | Redacción asistida por IA | Inventadas |
| Notas de cata y descripciones | Redacción asistida por IA | Ficticias |
| Precios y stock | Valores de ejemplo | No comerciales |
| Reseñas y puntajes | Valores de ejemplo | No provienen de clientes |
| Imágenes de producto | Generación procedural por código | Ilustrativas |
| Testimonios | Redacción asistida por IA | Personas inexistentes |

Ninguna de las marcas mencionadas —Finca del Sauce, Barrio Nueve, Casa Miramar,
Destilería Sur y las demás— existe. Ninguna de las personas que aparecen en la
sección de opiniones es real.

---

## 2. Precisión técnica sobre cómo se genera cada cosa

La consigna habitual asume que las imágenes de un catálogo sintético provienen
de modelos generativos de imagen. **En este proyecto no es así**, y la
distinción tiene consecuencias jurídicas concretas que conviene no borrar.

### 2.1 Las imágenes: generación procedural, no modelo generativo

Las ilustraciones de producto se producen con una función escrita por el equipo
(`src/lib/placeholder.js`) que dibuja vectores SVG. Los trazados de las
siluetas —botella, lata, botella de destilado— están escritos a mano en el
código fuente. La función recibe un tono de color y una forma, y devuelve
siempre el mismo resultado para los mismos parámetros.

Es decir: **es un programa determinista, no un modelo entrenado sobre obras de
terceros**. No interviene difusión, no hay corpus de entrenamiento, no hay
imágenes ajenas involucradas en ninguna etapa.

Consecuencia jurídica: la obra protegible acá es **el código fuente**, que tiene
autoría humana clara y no plantea ninguna de las controversias descriptas en la
sección 4. Las ilustraciones son salida determinista de ese programa.

### 2.2 Los textos: asistidos por IA

Los nombres, descripciones y notas de cata sí fueron redactados con asistencia
de un modelo de lenguaje, con revisión y edición humana posterior. A este
contenido sí le aplica, en lo pertinente, el debate de la sección 4.

### 2.3 Por qué se explicita esta diferencia

Declarar "usamos imágenes generadas por IA" cuando en realidad se usa dibujo
vectorial programático sería inexacto en perjuicio propio: asumiría riesgos
legales que el proyecto no tiene. La transparencia exige precisión, no
autoinculpación genérica.

---

## 3. Compromiso de transparencia con el usuario

1. **Identificación visible.** Mientras el catálogo sea de demostración, la
   tienda lo señala de forma clara y no en letra chica.
2. **Sin simulación de reseñas reales.** Los testimonios y puntajes ficticios se
   identifican como tales. No se presentan opiniones inventadas como si
   provinieran de clientes.
3. **Sin marcas ajenas.** No se generan etiquetas, envases ni denominaciones que
   imiten marcas reales del rubro.
4. **Sin personas simuladas como reales.** No se utilizan retratos sintéticos
   presentados como clientes, empleados ni especialistas.
5. **Trazabilidad interna.** Se documenta qué contenido fue asistido por IA,
   para poder auditarlo y reemplazarlo.

---

## 4. Estado del debate legal sobre obras generadas por IA

El punto de partida común a la mayoría de los ordenamientos es el requisito de
**autoría humana**. La divergencia aparece al determinar cuánta intervención
humana hace falta y qué ocurre con el material usado para entrenar los modelos.

### 4.1 Argentina — marco aplicable al proyecto

La Ley 11.723 de Propiedad Intelectual estructura la protección alrededor de un
autor persona física. No contiene previsiones específicas sobre generación
automatizada, y no existe jurisprudencia local consolidada sobre imágenes
generadas por IA.

La lectura mayoritaria en doctrina sigue la tradición de autoría humana: una
salida producida sin intervención creativa humana suficiente difícilmente
acceda a protección. Al no haber pronunciamiento judicial firme, es un terreno
de interpretación abierta.

### 4.2 Estados Unidos

Es la jurisdicción con desarrollo más denso:

- La Oficina de Derechos de Autor sostiene de manera constante que se requiere
  autoría humana. En *Zarya of the Dawn* (2023) registró el texto y la
  selección y disposición de una obra, pero **rechazó** el registro de las
  imágenes individuales generadas por el modelo.
- En *Thaler v. Perlmutter*, el Circuito de D.C. confirmó en 2025 que una obra
  presentada como generada autónomamente por una máquina, sin autor humano, no
  es registrable.
- El informe de la Copyright Office sobre IA y registrabilidad (2025) concluyó
  que **los prompts, por sí solos, no suelen bastar** para conferir autoría,
  pero que las contribuciones humanas de selección, disposición y modificación
  sí pueden ser protegibles.

Sobre los datos de entrenamiento hay litigios abiertos —entre ellos los
iniciados por artistas contra Stability AI y por Getty Images— y decisiones de
2025 sobre uso legítimo que resolvieron de manera acotada y sin sentar criterio
general. Es materia no resuelta.

### 4.3 Unión Europea

El estándar exige que la obra sea "creación intelectual propia" de su autor, lo
que la jurisprudencia del TJUE ha vinculado a decisiones libres y creativas de
una persona.

En paralelo, el Reglamento de IA (2024/1689) introduce obligaciones de
**transparencia sobre contenido sintético**: marcado en formato legible por
máquina y deber de informar cuando el contenido ha sido generado o manipulado
artificialmente. Su aplicación es escalonada, con las obligaciones de
transparencia previstas para 2026.

Su relevancia para este proyecto es indirecta —no opera en la UE— pero marca la
dirección regulatoria internacional: el eje se está desplazando de "quién es
titular" hacia "el usuario debe poder saberlo".

### 4.4 Reino Unido

Constituye la excepción histórica: su ley de 1988 previó las obras generadas por
computadora sin autor humano, atribuyendo la autoría a quien hubiera realizado
las disposiciones necesarias para su creación. Esa figura, anterior a la IA
generativa, ha sido objeto de consultas públicas y propuestas de derogación por
considerarse mal ajustada a la tecnología actual.

### 4.5 China — divergencia relevante

Tribunales chinos han reconocido protección sobre imágenes generadas por IA
cuando el usuario acreditó una intervención intelectual sustantiva —diseño
iterativo de instrucciones y ajuste de parámetros—. Es la posición más
permisiva entre las jurisdicciones mayores y muestra que el criterio de
"suficiente aporte humano" dista de ser uniforme.

### 4.6 Síntesis del estado actual

| Aspecto | Estado |
| --- | --- |
| Autoría de salida puramente automática | Rechazada en la mayoría de las jurisdicciones |
| Aporte humano suficiente para proteger | Sin criterio uniforme |
| Legalidad del entrenamiento con obra ajena | En litigio, sin resolución general |
| Deber de transparencia hacia el usuario | Tendencia clara a exigirlo |

La conclusión operativa es que **no conviene construir una estrategia comercial
sobre el supuesto de exclusividad respecto de contenido generado por IA**.

---

## 5. Riesgos concretos para la estrategia comercial

### 5.1 Ausencia de exclusividad

Si en el futuro se incorporan imágenes de modelos generativos, es probable que
no se pueda impedir que un competidor use material equivalente. La
diferenciación debe apoyarse en el servicio, la logística y la curaduría, no en
la titularidad del arte del catálogo.

### 5.2 Publicidad engañosa — el riesgo más serio

Es el punto de mayor exposición comercial y no es de propiedad intelectual sino
de defensa del consumidor. Mostrar una imagen sintética de una botella que no
coincide con el producto realmente entregado puede configurar publicidad
engañosa bajo la Ley 24.240.

**Compromiso**: cuando la tienda pase a vender producto real, las ilustraciones
sintéticas se reemplazan por fotografía del producto efectivo. No se usará arte
generado para representar mercadería concreta en venta.

### 5.3 Riesgo marcario

En bebidas, la forma del envase y la presentación pueden estar protegidas.
Generar etiquetas o envases que evoquen marcas existentes expone a conflicto
marcario con independencia de quién sea titular de la imagen. Por eso las
siluetas del proyecto son genéricas y no reproducen identidad visual de ninguna
marca real.

### 5.4 Procedencia del material de entrenamiento

Si se incorporan herramientas generativas de terceros, se asume el riesgo
asociado a la procedencia de sus datos de entrenamiento, hoy en discusión
judicial. Corresponde priorizar proveedores que documenten el origen del
material y ofrezcan indemnidad contractual.

---

## 6. Compromisos operativos

1. **Sustitución antes de la venta real.** Ninguna ilustración sintética
   representará un producto efectivamente ofrecido. Se reemplaza por fotografía
   real antes de habilitar la venta.
2. **Revisión humana.** Todo texto asistido por IA se revisa y edita antes de
   publicarse. No se publica salida sin revisar.
3. **Sin datos personales en los prompts.** No se incorpora información de
   clientes a herramientas de terceros.
4. **Sin decisiones automatizadas sobre personas.** La IA no interviene en
   precios personalizados, scoring ni decisiones que afecten a un cliente
   concreto.
5. **Registro de uso.** Se documenta qué herramientas se emplean y para qué.
6. **Marcado del contenido.** Se adopta el criterio de identificar el contenido
   sintético, alineado con la dirección regulatoria internacional, aun sin
   obligación local vigente.
7. **Revisión periódica.** Este documento se revisa al menos una vez al año o
   ante cambios normativos relevantes.

---

## 7. Qué cambia cuando el catálogo sea real

| Hoy | Al operar comercialmente |
| --- | --- |
| Catálogo ficticio completo | Productos reales del comercio |
| Ilustraciones vectoriales | Fotografía del producto |
| Reseñas de ejemplo | Opiniones verificadas de clientes |
| Precios de muestra | Precios vigentes |
| Aviso de demostración | Aviso retirado, sustituido por trazabilidad interna |

La arquitectura del sistema ya contempla esta transición: la capa de datos está
aislada del resto de la aplicación, de modo que el reemplazo del catálogo es una
sustitución de origen y no una reescritura.

---

## 8. Limitaciones de esta declaración

- El panorama jurídico descripto está en evolución. Hay litigios abiertos cuyo
  resultado puede alterar varias de las afirmaciones de la sección 4.
- El equipo no cuenta con asesoramiento legal profesional a la fecha. Este
  documento refleja una posición razonada, no un dictamen.
- Los compromisos de la sección 6 son declarativos: su cumplimiento debe poder
  auditarse antes de sostener que se cumplen.
