const SOLO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

export function formatearFecha(valor) {
  if (!valor) return '';
  const soloFecha = SOLO_FECHA.test(valor);
  const fecha = new Date(soloFecha ? valor + 'T00:00:00' : valor);
  if (Number.isNaN(fecha.getTime())) return String(valor);
  const opciones = soloFecha
    ? { dateStyle: 'medium' }
    : { dateStyle: 'medium', timeStyle: 'short' };
  return new Intl.DateTimeFormat('es-CO', opciones).format(fecha);
}