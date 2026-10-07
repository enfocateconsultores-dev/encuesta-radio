/* =====================================================================
   CUESTIONARIO · compartido por index.html (captura) y panel.html (resultados)
   Cada pregunta indica la hipótesis del informe que ayuda a validar:
   H1 conductor > estación · H2 radio comunitaria en municipios vecinos
   H3 jóvenes vía clips · H4 mesa vespertina e influencia
   H5 gestión vs. confrontación · H6 vigencia de Hablemos Claro
   CRED = matriz de credibilidad · TEMAS = agenda esperada
   INRA = módulo de audiencia tipo Mediómetro (recordación del día anterior,
          bloques de 1 hora de 6:00 a 24:00) · NSE = regla AMAI
   ===================================================================== */
/* Estaciones de la plaza (código corto = nombre de columna en la hoja) */
const ESTACIONES = [
  ["globo", "Globo 98.5"], ["variedades", "Variedades 101.9"], ["vida", "Estéreo Vida 90.5"],
  ["rtg", "RTG Radio 92.1"], ["r977", "97.7 FM (Ixtapa-Zihuatanejo)"],
  ["costenita", "La Costeñita 107.5 (Petatlán)"], ["rancherita", "La Rancherita 102.3 (La Unión)"],
  ["otra", "Otra estación (incluye AM o internet)"]
];

window.ENCUESTA = {
  version: "V2-INRA",
  estaciones: ESTACIONES,
  horas: [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],   // bloques de 1 hora, 6:00–24:00
  /* Nivel socioeconómico · Regla AMAI (6 preguntas, puntos por opción).
     VERIFIQUE puntos y cortes con la versión vigente publicada por AMAI antes del levantamiento. */
  nse: {
    preguntas: ["nse_escolaridad","nse_banos","nse_autos","nse_internet","nse_trabajan","nse_dormitorios"],
    cortes: [[205,"A/B"],[166,"C+"],[136,"C"],[112,"C-"],[90,"D+"],[48,"D"],[0,"E"]]
  },
  secciones: [
    {
      titulo: "Control de campo",
      soloCampo: true,     // solo aparece con ?modo=campo (entrevista cara a cara en vivienda)
      intro: "Lo llena el encuestador antes de iniciar la entrevista.",
      preguntas: [
        { id: "encuestador", tipo: "text", req: true, max: 20, label: "Clave del encuestador", placeholder: "Ej. E07" },
        { id: "seccion", tipo: "text", req: true, max: 6, numerico: true, label: "Sección electoral del punto de levantamiento", placeholder: "Ej. 1825" },
        { id: "punto", tipo: "text", req: false, max: 40, label: "Manzana / punto de arranque (opcional)", placeholder: "Ej. Mz 12, vivienda 4" }
      ]
    },
    {
      titulo: "Sobre usted",
      intro: "Solo datos generales. No le pedimos nombre, teléfono ni domicilio.",
      preguntas: [
        { id: "municipio", tipo: "single", req: true, label: "¿En qué municipio vive?",
          opciones: ["Zihuatanejo de Azueta", "Petatlán", "La Unión de Isidoro Montes de Oca", "Técpan de Galeana", "Coahuayutla", "Otro"] },
        { id: "localidad", tipo: "single", req: true, label: "¿Vive en la cabecera municipal o en una comunidad?",
          opciones: ["Cabecera / ciudad", "Comunidad o localidad rural"] },
        { id: "edad", tipo: "single", req: true, label: "Su edad está entre…",
          opciones: ["18 a 24", "25 a 35", "36 a 45", "46 a 60", "Más de 60"] },
        { id: "sexo", tipo: "single", req: true, label: "Sexo",
          opciones: ["Mujer", "Hombre", "Prefiero no decir"] },
        { id: "ocupacion", tipo: "single", req: true, label: "¿A qué se dedica principalmente?",
          opciones: ["Comercio", "Turismo / hotelería / restaurantes", "Pesca", "Campo / ganadería", "Empleado(a)", "Hogar", "Estudiante", "Servidor(a) público(a)", "Otro"] }
      ]
    },
    {
      titulo: "Su hogar",
      intro: "Estas preguntas sirven para clasificar las respuestas por nivel socioeconómico (regla AMAI). No identifican a nadie.",
      preguntas: [
        { id: "nse_escolaridad", tipo: "single", req: true, hyp: "NSE",
          label: "¿Cuál es el último año de estudios de quien más aporta al gasto del hogar?",
          opciones: ["Sin instrucción", "Preescolar", "Primaria incompleta", "Primaria completa", "Secundaria incompleta", "Secundaria completa", "Preparatoria incompleta", "Preparatoria completa", "Licenciatura incompleta", "Licenciatura completa", "Posgrado"],
          puntos:   [0, 0, 10, 22, 23, 31, 35, 43, 59, 73, 101] },
        { id: "nse_banos", tipo: "single", req: true, hyp: "NSE",
          label: "¿Cuántos baños completos (con regadera y excusado) hay en su vivienda?",
          opciones: ["Ninguno", "1", "2 o más"], puntos: [0, 24, 47] },
        { id: "nse_autos", tipo: "single", req: true, hyp: "NSE",
          label: "¿Cuántos automóviles o camionetas tienen en su hogar, incluyendo de trabajo?",
          opciones: ["Ninguno", "1", "2 o más"], puntos: [0, 22, 43] },
        { id: "nse_internet", tipo: "single", req: true, hyp: "NSE",
          label: "Sin contar el celular, ¿su hogar tiene internet?",
          opciones: ["No", "Sí"], puntos: [0, 32] },
        { id: "nse_trabajan", tipo: "single", req: true, hyp: "NSE",
          label: "¿Cuántas personas de 14 años o más del hogar trabajaron el mes pasado?",
          opciones: ["Ninguna", "1", "2", "3", "4 o más"], puntos: [0, 15, 31, 46, 61] },
        { id: "nse_dormitorios", tipo: "single", req: true, hyp: "NSE",
          label: "¿Cuántos cuartos se usan para dormir, sin contar pasillos ni baños?",
          opciones: ["Ninguno", "1", "2", "3", "4 o más"], puntos: [0, 6, 12, 17, 23] }
      ]
    },
    {
      titulo: "Ayer: su escucha de radio",
      intro: "Piense solo en el día de AYER, desde que se levantó hasta que se durmió.",
      preguntas: [
        { id: "escucho_ayer", tipo: "single", req: true, hyp: "INRA",
          label: "Ayer, ¿escuchó radio aunque fuera un rato, en cualquier aparato?",
          opciones: ["Sí", "No"] },
        { id: "diario", tipo: "diary", req: true, hyp: "INRA", si: { q: "escucho_ayer", v: "Sí" },
          label: "¿Qué estaciones escuchó ayer y en qué horas?",
          ayuda: "Primero marque las estaciones. Luego toque las horas en que escuchó cada una (basta con 5 minutos o más dentro de la hora)." },
        { id: "dispositivo_radio", tipo: "multi", req: true, max: 3, hyp: "INRA", si: { q: "escucho_ayer", v: "Sí" },
          label: "Ayer, ¿en qué aparato escuchó la radio? (hasta 3)",
          opciones: ["Radio o grabadora", "Radio del carro o transporte", "Celular (aplicación o página)", "Celular con radio FM", "Computadora o tableta", "Bocina inteligente / TV"] },
        { id: "lugar", tipo: "multi", req: true, max: 3, hyp: "INRA", si: { q: "escucho_ayer", v: "Sí" },
          label: "Ayer, ¿dónde la escuchó? (hasta 3)",
          opciones: ["En casa", "En el carro / transporte", "En el negocio o trabajo", "En la lancha o en el campo", "En otro lugar"] },
        { id: "semana", tipo: "multi", req: true, hyp: "INRA",
          label: "En los ÚLTIMOS 7 DÍAS, contando ayer, ¿qué estaciones escuchó?",
          opciones: ESTACIONES.map(e => e[1]).concat(["Ninguna"]) }
      ]
    },
    {
      titulo: "Cómo se informa",
      intro: "Piense en cómo se entera de lo que pasa en su municipio y en el estado.",
      preguntas: [
        { id: "medio_principal", tipo: "single", req: true, hyp: "Base",
          label: "¿Por qué medio se entera PRIMERO de las noticias?",
          opciones: ["Radio", "Facebook", "WhatsApp", "TikTok / Reels / YouTube", "Portales de noticias locales", "Televisión", "Periódico impreso", "Platicando con conocidos"] },
        { id: "estacion", tipo: "single", req: true, hyp: "H2",
          label: "Considerando toda la semana, ¿qué estación escucha MÁS?",
          opciones: ESTACIONES.map(e => e[1]).concat(["No escucho radio"]) }
      ]
    },
    {
      titulo: "Programas con contenido político",
      intro: "Programas de noticias, entrevistas o análisis sobre gobierno y política local.",
      preguntas: [
        { id: "programas", tipo: "multi", req: true, hyp: "H6",
          label: "¿Cuáles de estos programas ha escuchado en el ÚLTIMO MES?",
          opciones: ["Costa Grande en la Noticia (mañana, Globo 98.5)", "Costa Grande en la Noticia (tarde, Globo 98.5)", "En Contacto (mañana, Variedades 101.9)", "Hablemos Claro (tarde, Variedades 101.9)", "Otro programa de noticias", "Ninguno"] },
        { id: "programa_otro", tipo: "text", req: false, max: 80,
          label: "Si escucha otro programa de noticias o política, ¿cuál es?", placeholder: "Nombre del programa y estación" },
        { id: "le_cree", tipo: "single", req: true, hyp: "H1",
          label: "Cuando escucha una noticia en la radio, ¿a quién le cree más?",
          opciones: ["Al conductor o locutor", "A la estación", "Al programa", "A los reporteros que están en el lugar", "A la gente que llama al aire", "A ninguno"] },
        { id: "conductor_confianza", tipo: "text", req: false, max: 60, hyp: "H1",
          label: "¿Hay algún conductor o periodista local en quien confíe? (opcional)", placeholder: "Nombre o apodo" },
        { id: "mesa_uso", tipo: "single", req: true, hyp: "H4",
          label: "Los programas de opinión o debate de la tarde, para usted son…",
          opciones: ["Mi principal forma de entender la política local", "Útiles, los escucho de vez en cuando", "Puro pleito, casi no los escucho", "No los conozco"] },
        { id: "comenta", tipo: "single", req: true, hyp: "H4",
          label: "¿Comenta con otras personas lo que escuchó en esos programas?",
          opciones: ["Sí, seguido", "A veces", "Casi nunca", "Nunca"] }
      ]
    },
    {
      titulo: "Confianza en cada medio",
      intro: "Califique de 1 (nada de confianza) a 5 (mucha confianza). Si no lo usa, marque N/U.",
      preguntas: [
        { id: "cred", tipo: "matrix", req: true, hyp: "CRED",
          label: "¿Cuánta confianza le tiene a la información de…",
          filas: [
            ["cred_matutino", "Noticieros de radio de la mañana"],
            ["cred_vespertino", "Programas de opinión o debate de la tarde"],
            ["cred_comunitaria", "Radio comunitaria o de su localidad"],
            ["cred_publica", "Radio del gobierno del estado"],
            ["cred_portales", "Portales de noticias locales"],
            ["cred_facebook", "Páginas de noticias en Facebook"],
            ["cred_whatsapp", "Mensajes en grupos de WhatsApp"],
            ["cred_clips", "Videos cortos (Reels, TikTok)"]
          ],
          escala: ["1", "2", "3", "4", "5", "N/U"] }
      ]
    },
    {
      titulo: "Verificación y redes",
      intro: "",
      preguntas: [
        { id: "verifica", tipo: "multi", req: true, max: 3, hyp: "Base",
          label: "Si escucha algo y duda que sea cierto, ¿qué hace? (hasta 3)",
          opciones: ["Lo busco en Facebook", "Pregunto en WhatsApp", "Lo busco en un portal de noticias", "Espero a escucharlo en otro programa de radio", "Le pregunto a alguien de confianza", "Busco videos o fotos", "No hago nada"] },
        { id: "clips", tipo: "single", req: true, hyp: "H3",
          label: "¿Ha visto en redes sociales videos o fragmentos de programas de radio locales?",
          opciones: ["Sí, seguido", "A veces", "Nunca", "No uso redes sociales"] },
        { id: "clips_vs_radio", tipo: "single", req: true, hyp: "H3",
          label: "¿Cómo conoce más a los locutores de radio?",
          opciones: ["Escuchando la radio", "Por videos en redes", "Por las dos", "No los conozco"] }
      ]
    },
    {
      titulo: "Lo que quiere escuchar",
      intro: "",
      preguntas: [
        { id: "temas", tipo: "multi", req: true, max: 3, hyp: "TEMAS",
          label: "¿Qué temas deberían tratar MÁS los programas de noticias? (hasta 3)",
          opciones: ["Seguridad pública", "Agua potable y servicios", "Empleo y costo de vida", "Caminos y carreteras", "Salud (clínicas, medicamentos)", "Desempeño del gobierno municipal", "Pesca y campo (precios)", "Transporte", "Educación", "Turismo"] },
        { id: "tono", tipo: "scale5", req: true, hyp: "H5",
          label: "Cuando un político sale en la radio, prefiere que…",
          izq: "Explique lo que hizo o va a hacer", der: "Debata y señale errores de otros" },
        { id: "formato", tipo: "single", req: true, hyp: "H5",
          label: "¿Qué formato le da más confianza para escuchar a un político?",
          opciones: ["Entrevista con preguntas de la audiencia", "Debate entre varios", "Visita a mi comunidad", "Video corto en redes", "Transmisión en vivo en Facebook", "Ninguno me da confianza"] },
        { id: "centralismo", tipo: "single", req: true, hyp: "H2",
          label: "¿Los programas de radio hablan lo suficiente de SU localidad?",
          opciones: ["Sí, suficiente", "Poco", "Casi nunca", "No sé"] },
        { id: "comentario", tipo: "textarea", req: false, max: 400,
          label: "¿Algo más que quiera decirnos sobre los programas de radio de la región? (opcional)", placeholder: "Su comentario" }
      ]
    }
  ]
};
