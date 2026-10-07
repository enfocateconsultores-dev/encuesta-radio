# Consulta a Radioescuchas · Costa Grande

Aplicativo web para que los radioescuchas de Zihuatanejo, Petatlán, La Unión y municipios vecinos respondan una consulta sobre **programas de contenido político, credibilidad de medios y agenda**. Su propósito es validar, corregir o ampliar las hipótesis H1–H6 del informe *Programas de contenido político y perfiles de audiencia* (Enfócate, octubre 2026).

**Versión V2 · tipo INRA.** Incorpora un módulo de medición de audiencia al estilo del Mediómetro de INRA: recordación del día anterior en bloques de una hora, alcance semanal, nivel socioeconómico con la regla AMAI, modo encuestador para entrevista cara a cara en vivienda, registro de no respuesta y ponderación por sexo y edad.

| Archivo | Función |
|---|---|
| `index.html` | Cuestionario: autoaplicado por radioescuchas o aplicado por encuestador con `?modo=campo` (8–9 secciones, ~8 min) |
| `panel.html` | Panel: indicadores tipo INRA (share, rating, alcance, TSL, perfil), validación de hipótesis, ponderación y descarga CSV |
| `questions.js` | Cuestionario (se edita aquí; lo usan ambas páginas) |
| `config.js` | URL del servidor y datos del estudio |
| `Code.gs` | Servidor gratuito en Google Apps Script que guarda las respuestas en Google Sheets |
| `logo.png`, `favicon.png` | Identidad Enfócate |

> GitHub Pages solo sirve páginas estáticas y **no puede guardar datos**. Por eso las respuestas se envían a una Hoja de Google mediante Apps Script.

---

## 1. Crear el servidor en Google Sheets (10 minutos)

1. Cree una Hoja de cálculo nueva en Google Drive, por ejemplo *Radioescuchas 2026*.
2. Vaya a **Extensiones → Apps Script**. Borre el contenido y pegue todo `Code.gs`. Guarde.
3. En la barra superior elija la función **`configurar`** y pulse **Ejecutar**. Autorice los permisos.
   En **Registro de ejecución** aparecerá el **token del panel**; guárdelo. Puede cambiarlo en *Configuración del proyecto → Propiedades del script → PANEL_TOKEN*.
4. **Implementar → Nueva implementación → Tipo: Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
5. Copie la URL que termina en `/exec` y péguela en `config.js`:
   ```js
   SCRIPT_URL: "https://script.google.com/macros/s/AKfy..../exec",
   ```

Si después modifica `Code.gs`, use **Implementar → Administrar implementaciones → Editar → Nueva versión** para conservar la misma URL.

## 2. Publicar en GitHub Pages

1. Cree un repositorio, por ejemplo `consulta-radio`, y suba todos los archivos a la raíz.
2. **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
3. En uno o dos minutos la encuesta quedará en `https://SU-USUARIO.github.io/consulta-radio/` y el panel en `.../panel.html`.

## 3. Difusión con enlaces rastreables

Agregue `?src=` al enlace para saber qué medio trae a cada participante. El panel permite filtrar por origen.

| Medio | Enlace |
|---|---|
| Globo 98.5 | `…/consulta-radio/?src=globo` |
| Variedades 101.9 | `…/consulta-radio/?src=variedades` |
| La Costeñita 107.5 | `…/consulta-radio/?src=costenita` |
| Facebook | `…/consulta-radio/?src=facebook` |
| WhatsApp | `…/consulta-radio/?src=whatsapp` |

Para radio conviene leer al aire un enlace corto y colocar un código QR en las páginas de Facebook de cada programa.

## 4. Levantamiento tipo INRA

### Qué mide

| Indicador | Definición en el panel |
|---|---|
| **Encendido por hora** | % del universo entrevistado que escuchó cualquier estación en esa hora de ayer |
| **Rating por hora** | % del universo que escuchó una estación en esa hora |
| **Rating promedio** | Promedio del rating de la estación entre las 6:00 y las 24:00 |
| **Share** | Horas-persona de la estación entre las horas-persona de todas las estaciones |
| **Alcance diario / semanal** | % que escuchó la estación ayer / en los últimos 7 días |
| **TSL** | Horas promedio que escuchó la estación cada uno de sus oyentes de ayer |
| **Perfil** | % de mujeres, de 18 a 35 años y de NSE A/B o C+ entre los oyentes de cada estación |
| **Tasa de rechazo** | Rechazos / (entrevistas de campo + rechazos) |

### Diferencias con INRA que conviene declarar

- INRA recoge la escucha en cuartos de hora; aquí se usan **bloques de 1 hora** para que la entrevista sea más corta en celular. Si requiere cuartos de hora, cambie `horas` en `questions.js` y la etiqueta de los botones.
- INRA mide a la población de 8 años o más. Este instrumento se limita a **18 años o más**, porque su fin es el electorado y así se evita entrevistar a menores.
- La regla AMAI está capturada con sus 6 preguntas y puntos. **Verifique puntos y cortes con la versión vigente de AMAI** antes del levantamiento.

### Cómo obtener datos con validez estadística

Las respuestas autoaplicadas desde un enlace en la radio (consulta abierta) sirven para orientar, pero solo una muestra probabilística permite estimar audiencias. Para un levantamiento comparable al estudio de mayo (n=632, ±3.9%):

1. **Marco y selección:** secciones electorales del Distrito Federal 3 y los Distritos Locales 11 y 12, seleccionadas con probabilidad proporcional al tamaño; en cada sección, manzanas al azar y salto sistemático de viviendas; en cada vivienda, una persona de 18 años o más (por ejemplo, la del cumpleaños más próximo).
2. **Enlace por encuestador:** `https://SU-USUARIO.github.io/consulta-radio/?modo=campo&enc=E07`. Activa la sección de control (clave, sección electoral, punto), cambia el aviso de consentimiento y habilita el registro de no respuesta.
3. **Reparto de días:** como se pregunta por *ayer*, distribuya las entrevistas de martes a domingo para cubrir los siete días de referencia. El cuestionario guarda `dia_referido` y `fecha_referida`.
4. **Tamaño de muestra:** con p=0.5 y 95% de confianza, n ≈ 1.96² × 0.25 / e². Para ±4% se requieren unas 600 entrevistas; para ±3.5%, unas 785. Para reportar estaciones pequeñas con al menos 30 oyentes se necesita más muestra.
5. **Ponderación:** capture en `config.js → PONDERACION` las proporciones de sexo y edad del listado nominal de las secciones del estudio. El panel ajusta los pesos por raking y los acota entre 0.2 y 5.
6. **Supervisión:** filtre en el panel *Solo entrevistas de campo* y revise duración, encuestador y sección. Las entrevistas de menos de 60 segundos quedan marcadas.

## 5. Calidad de datos

- **Folio único** por respuesta; el servidor descarta folios duplicados.
- **Banderas automáticas:** `bandera_rapida` (menos de 60 s), `bandera_repetida` (mismo dispositivo) y `bandera_bot` (campo trampa). El panel excluye por defecto las rápidas y las de bot.
- **Sin conexión:** si el teléfono no tiene señal, la respuesta queda guardada y se envía la próxima vez que se abra la página.
- **Límite** de 120 envíos por minuto en el servidor y protección contra fórmulas inyectadas en la hoja.
- **Modo prueba:** con `SCRIPT_URL` vacío, las respuestas quedan solo en el navegador y se ven con *Respuestas de este navegador* en el panel.

## 6. Consideraciones metodológicas y legales

- En **modo autoaplicado** es una consulta abierta y autoseleccionada: describe a quienes participan y no representa al electorado. Solo el **modo campo con muestra probabilística** (sección 4) permite estimar audiencias. No mezcle ambos en un mismo reporte; use el filtro de modo del panel.
- Los ratings que publica INRA provienen de su estudio sindicado y auditado. Los de este instrumento son **estimaciones propias de Enfócate** y deben presentarse así, con ficha técnica.
- No incluye preguntas de intención de voto ni de preferencia por partidos o candidatos. Si se agregan, la publicación de resultados quedaría sujeta a los criterios del INE para encuestas electorales (Reglamento de Elecciones, Cap. VII y Anexo 3). Mantenga los resultados como **insumo interno**.
- No recaba datos personales identificables. El aviso de privacidad simplificado aparece al inicio. Ajuste el responsable y el contacto en `config.js`.
- Antes de difundir la consulta en un programa, acuérdelo con su producción como contenido editorial, no como tiempo contratado.

## 7. Modificar preguntas

Edite `questions.js`. Tipos disponibles: `single`, `multi` (con `max`), `text` (con `numerico`), `textarea`, `matrix` (filas × escala), `scale5` (escala bipolar) y `diary` (estaciones × horas de ayer). Una pregunta con `si: { q, v }` solo aparece cuando la pregunta `q` tiene el valor `v`. Una sección con `soloCampo: true` solo aparece en modo encuestador. Las estaciones se definen una vez en `ESTACIONES`. Al agregar campos, el servidor crea las columnas nuevas automáticamente. Las reglas de validación de hipótesis están en la función `hyps()` de `panel.html`.

---

### Control de metadatos

| Campo | Valor |
|---|---|
| IA utilizada | Claude (Anthropic) |
| Catedrático / Autor | Luis Arturo López Vergara |
| Correo electrónico | luislopezv71@gmail.com |
| Fecha de desarrollo | 6 de octubre de 2026 (V2 tipo INRA) |
| Identificador único | ProgramasPoliticos-ENFOCATE-2026-EncuestaRadio-V2 |
