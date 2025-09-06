const URL_BASE = "https://script.google.com/macros/s/AKfycbzd0PXifcGV1nG1gNucm_9DB7UI_YLdOS4qEYZm_8CcW-W4jBkh3PNZiQ2qK4tqgok6Bg/exec";
const API_KEY = "X%B~ZiP?RJA5LUGVAU_9KgDp?7~rUX8KW2D9Q3Fgiyt=1.]Ww#a^FGEMFuM:}#WP4r2L!e9U?fA+qcUjReWV"; // Opcional, si tu backend lo requiere

// 🔐 Genera un token temporal codificado en base64
export function generarToken() {
  // 🗝️ Clave privada compartida con el backend para validar el token
    const clavePrivada = API_KEY;
    // ⏱️ Obtiene el timestamp actual en milisegundos
    const timestamp = Date.now();
    // ⏳ Calcula el tiempo de expiración: 10 minutos desde ahora
    const expiracion = timestamp + 10 * 60 * 1000;
    // 🧵 Crea una cadena que une la clave privada y la expiración
    const raw = `${clavePrivada}:${expiracion}`;
    // 📦 Codifica la cadena en base64 para generar el token
    const token = btoa(raw);
    // 🚀 Devuelve el token generado
  return token;
}

//
//🔁 Realiza una petición POST a la API
//@param {Object} payload - Datos a enviar
//@returns {Promise<Response>} Respuesta cruda
//
function postToAPI(payload) {
  const formData = new URLSearchParams({
    ...payload,
    clave: API_KEY // Se incluye si estás usando autenticación
  });

  return fetch(URL_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData
  });
}
/*
function postToAPI(payload) {
  return fetch(URL_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...payload,
      clave: API_KEY // Se incluye si estás usando autenticación
    })
  });
}*/

//
//➕ Incrementa el contador de visitas para un ID
//@param {string} idvisitado
//@returns {Promise<string>} "OK inc 1" o "OK inc nuevo"
//
export function incrementarVisita(idvisitado) {
  return postToAPI({ accion: "incrementar", id: idvisitado })
    .then(res => res.text())
    .catch(err => {
      console.error("Error incrementando visita:", err);
      return "ERROR";
    });
}

//
//👁️ Consulta el número de visitas para un ID
//@param {string} idvisitado
//@returns {Promise<number>} número de visitas (ej. 12)
//
export function leerVisitas(idvisitado) {
  return postToAPI({ accion: "leer", id: idvisitado })
    .then(res => res.text())
    .then(text => parseInt(text, 10) || 0)
    .catch(err => {
      console.error("Error leyendo visitas:", err);
      return 0;
    });
}

//
//⭐ Envía una valoración (de 0 a 5) para un recurso identificado por ID
//@param {string} idvisitado
//@param {number} valor Valor numérico entre 0 y 5
//@returns {Promise<string>} "OK valoración registrada" o "OK valoración nueva"
//
export function valorarRecurso(idvisitado, valor) {
  return postToAPI({ accion: "valorar", id: idvisitado, valor })
    .then(res => res.text())
    .catch(err => {
      console.error("Error valorando recurso:", err);
      return "ERROR";
    });
}

//
//📦 Obtiene la información completa del recurso
//@param {string} idvisitado
//@returns {Promise<Object>} Objeto con propiedades: id, visitas, valoracion, votos, fechaActualizacion, obra, numVisitasCapitulo
//
export function obtenerInfo(idvisitado) {
  return postToAPI({ accion: "obtenerInfo", id: idvisitado })
    .then(res => res.json())
    .catch(err => {
      console.error("Error obteniendo información:", err);
      return {
        id: idvisitado,
        visitas: 1,
        valoracion: 5,
        votos: 1,
        fechaActualizacion: "Sin fecha",
        obra: null,
        numVisitasCapitulo: 0
      };
    });
}

//
//📋 Obtiene el resumen completo de todas las obras
//@returns {Promise<Array>} Array de objetos con datos de cada obra
//
export function obtenerResumenObras() {
  return postToAPI({ accion: "resumenObras" })
    .then(res => res.json())
    .catch(err => {
      console.error("Error obteniendo resumen de obras:", err);
      return [];
    });
}

/*
const URL_BASE = "https://script.google.com/macros/s/AKfycbzd0PXifcGV1nG1gNucm_9DB7UI_YLdOS4qEYZm_8CcW-W4jBkh3PNZiQ2qK4tqgok6Bg/exec";
//
// Incrementa el contador de visitas para un ID
// @param {string} idvisitado
// @returns {Promise<string>} "OK" si se actualizó correctamente
//
export function incrementarVisita(idvisitado) {
  const url = `${URL_BASE}?id=${encodeURIComponent(idvisitado)}&accion=incrementar`;
  return fetch(url)
    .then(res => res.text())
    .catch(err => {
      console.error("Error incrementando visita:", err);
      return "ERROR";
    });
}

//
//Consulta el número de visitas para un ID
//@param {string} idvisitado
//@returns {Promise<number>} número de visitas
//
export function leerVisitas(idvisitado) {
  const url = `${URL_BASE}?id=${encodeURIComponent(idvisitado)}&accion=leer`;
  return fetch(url)
    .then(res => res.text())
    .then(text => parseInt(text, 10) || 0)
    .catch(err => {
      console.error("Error leyendo visitas:", err);
      return 0;
    });
}

//
//Envía una valoración (de 0 a 5) para un recurso identificado por ID
//@param {string} idvisitado
//@param {number} valor Valor numérico entre 0 y 5
//@returns {Promise<string>} "OK" si se registró correctamente
//
export function valorarRecurso(idvisitado, valor) {
  const url = `${URL_BASE}?id=${encodeURIComponent(idvisitado)}&accion=valorar&valor=${valor}`;
  return fetch(url)
    .then(res => res.text())
    .catch(err => {
      console.error("Error valorando recurso:", err);
      return "ERROR";
    });
}

//
//Obtiene la información completa del recurso: visitas, valoración promedio y fecha de última actualización
//@param {string} idvisitado
//@returns {Promise<Object>} Objeto con propiedades: visitas, valoracion, fechaActualizacion
//
export function obtenerInfo(idvisitado) {
  const url = `${URL_BASE}?id=${encodeURIComponent(idvisitado)}&accion=obtenerInfo`;
  return fetch(url)
    .then(res => res.json())
    .catch(err => {
      console.error("Error obteniendo información:", err);
      return {
        visitas: 1,
        valoracion: 5,
        fechaActualizacion: null,
        votos: 1,
        obra: null,
        numVisitasCapitulo: 0
      };
    });
}*/
