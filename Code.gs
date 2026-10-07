/**
 * =====================================================================
 *  BACKEND · Consulta a radioescuchas · Enfócate 2026
 *  Google Apps Script vinculado a una Hoja de cálculo de Google.
 *  - doPost: recibe cada respuesta de index.html y la agrega a "Respuestas".
 *  - doGet : con ?token=... devuelve las respuestas en JSON para panel.html.
 *
 *  CONTROL DE METADATOS
 *  IA Utilizada: Claude (Anthropic)
 *  Catedrático/Autor: Luis Arturo López Vergara
 *  Correo Electrónico: luislopezv71@gmail.com
 *  Fecha de desarrollo: 2026-10-06
 *  Identificador Único: ProgramasPoliticos-ENFOCATE-2026-EncuestaRadio-V2
 * =====================================================================
 *
 *  ANTES DE PUBLICAR: ejecute una vez la función `configurar` (menú Ejecutar)
 *  para crear la hoja y definir el token del panel.
 */

const HOJA = 'Respuestas';
const MAX_CAMPO = 500;            // recorta textos muy largos
const MAX_POR_MINUTO = 120;       // freno básico contra envíos masivos

function configurar() {
  const props = PropertiesService.getScriptProperties();
  // Cambie este valor por una clave propia y compártala solo con su equipo:
  props.setProperty('PANEL_TOKEN', 'CAMBIE-ESTA-CLAVE-' + Utilities.getUuid().slice(0, 8));
  hoja_();
  Logger.log('Token del panel: ' + props.getProperty('PANEL_TOKEN'));
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    if (!limite_()) return json_({ ok: false, error: 'limite' });
    const rec = JSON.parse(e.postData.contents);
    if (!rec || !rec.folio) return json_({ ok: false, error: 'formato' });

    const sh = hoja_();
    let headers = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0].filter(String);
    const keys = Object.keys(rec);
    const nuevos = keys.filter(k => headers.indexOf(k) === -1);
    if (nuevos.length) {
      sh.getRange(1, headers.length + 1, 1, nuevos.length).setValues([nuevos]);
      headers = headers.concat(nuevos);
    }
    // Evita duplicar el mismo folio (reintentos desde la cola local)
    const folios = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues().flat() : [];
    if (folios.indexOf(rec.folio) !== -1) return json_({ ok: true, duplicado: true });

    const fila = headers.map(h => {
      let v = rec[h] === undefined || rec[h] === null ? '' : String(rec[h]);
      if (/^[=+\-@]/.test(v)) v = "'" + v;           // evita inyección de fórmulas
      return v.slice(0, MAX_CAMPO);
    });
    // Se escribe como TEXTO para que Sheets no convierta "1", "8 9 10" o folios en números o fechas
    const rng = sh.getRange(sh.getLastRow() + 1, 1, 1, fila.length);
    rng.setNumberFormat('@');
    rng.setValues([fila]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const token = PropertiesService.getScriptProperties().getProperty('PANEL_TOKEN');
  if (!e || !e.parameter || !e.parameter.token) return json_({ ok: true, estado: 'activo' });
  if (e.parameter.token !== token) return json_({ ok: false, error: 'token' });
  const sh = hoja_();
  const vals = sh.getDataRange().getValues();
  const headers = vals.shift() || [];
  const rows = vals.map(r => {
    const o = {};
    headers.forEach((h, i) => o[h] = r[i] instanceof Date ? r[i].toISOString() : String(r[i]));
    return o;
  });
  return json_({ ok: true, total: rows.length, rows: rows });
}

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(HOJA);
  if (!sh) {
    sh = ss.insertSheet(HOJA);
    sh.getRange(1, 1, 1, 2).setValues([['folio', 'fecha']]);
    sh.setFrozenRows(1);
    sh.getRange('1:1').setFontWeight('bold').setBackground('#1B2A4A').setFontColor('#FFFFFF');
  }
  return sh;
}

function limite_() {
  const cache = CacheService.getScriptCache();
  const k = 'n_' + Math.floor(Date.now() / 60000);
  const n = Number(cache.get(k) || 0) + 1;
  cache.put(k, String(n), 120);
  return n <= MAX_POR_MINUTO;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
