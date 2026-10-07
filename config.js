/* =====================================================================
   CONFIGURACIÓN · Consulta a radioescuchas · Enfócate 2026
   ---------------------------------------------------------------------
   1. Publique Code.gs como Aplicación web en Google Apps Script
      (ver README.md) y pegue aquí la URL que termina en /exec.
   2. Si SCRIPT_URL queda vacío, la encuesta funciona en MODO PRUEBA:
      las respuestas se guardan solo en el navegador y pueden
      descargarse en CSV desde panel.html.
   ===================================================================== */
window.CONFIG = {
  SCRIPT_URL: "",                 // ej. "https://script.google.com/macros/s/AKfy.../exec"
  ESTUDIO_ID: "ProgramasPoliticos-ENFOCATE-2026-EncuestaRadio-V2",
  CONTACTO_PRIVACIDAD: "luislopezv71@gmail.com",
  RESPONSABLE: "Enfócate Consultores y Comunicación",
  CIERRE: "",                     // opcional, fecha ISO para cerrar la consulta, ej. "2026-11-15"

  /* PONDERACIÓN (opcional) · proporciones objetivo del universo, p. ej. listado nominal
     del INE para las secciones del estudio. Con null, el panel no pondera.
     Las claves deben coincidir EXACTAMENTE con las opciones del cuestionario.
     Ejemplo (SUSTITUIR por las cifras oficiales):
  PONDERACION: {
    sexo: { "Mujer": 0.52, "Hombre": 0.48 },
    edad: { "18 a 24": 0.15, "25 a 35": 0.24, "36 a 45": 0.21, "46 a 60": 0.24, "Más de 60": 0.16 }
  },
  */
  PONDERACION: null
};
