/**
 * Utilidades para manejo de fechas en la zona horaria local
 */

/**
 * Retorna la fecha local en formato YYYY-MM-DD
 * Ideal para evitar el desfase horario de UTC que ocurre al usar toISOString()
 */
export const formatDateLocal = (date: Date = new Date()): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Retorna la fecha de ayer local en formato YYYY-MM-DD
 */
export const getYesterdayLocal = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return formatDateLocal(date);
};

/**
 * Retorna la fecha completa en texto (ej. Lunes, 30 de marzo de 2026)
 * Evita fallos de toLocaleDateString en diferentes plataformas (Android/iOS)
 */
export const getFullFriendlyDateLocal = (): string => {
  const date = new Date();
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  
  const diaSemana = dias[date.getDay()];
  const dia = date.getDate();
  const mes = meses[date.getMonth()];
  const anio = date.getFullYear();
  
  return `${diaSemana}, ${dia} de ${mes} de ${anio}`;
};
