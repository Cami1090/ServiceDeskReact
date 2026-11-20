import { supabase } from './supabase';

export function formatearId(n) {
  return 'SD-' + String(n).padStart(3, '0');
}

export const ETIQUETAS = {
  estado: { 'abierta': 'Abierta', 'en-proceso': 'En proceso', 'resuelta': 'Resuelta', 'cerrada': 'Cerrada' },
  prioridad: { 'baja': 'Baja', 'media': 'Media', 'alta': 'Alta', 'urgente': 'Urgente' },
  categoria: { 'hardware': 'Hardware', 'software': 'Software', 'red': 'Red', 'cuentas': 'Cuentas y accesos', 'otro': 'Otro' },
  satisfaccion: { 'satisfecho': 'Satisfecho', 'neutral': 'Neutral', 'insatisfecho': 'Insatisfecho' },
  role: { 'usuario': 'Usuario', 'tecnico': 'Técnico', 'admin': 'Administrador' }
};

export function etiqueta(tipo, valor) {
  return (ETIQUETAS[tipo] && ETIQUETAS[tipo][valor]) || valor || '';
}

export async function cargarSolicitudes() {
  const { data, error } = await supabase.from('solicitudes').select('*').order('id', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
}

export async function obtenerSolicitudPorId(id, signal) {
  const { data, error } = await supabase.from('solicitudes').select('*').eq('id', id).abortSignal(signal).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function agregarSolicitud(datos, perfil) {
  const nueva = {
    titulo: datos.titulo,
    descripcion: datos.descripcion || '',
    solicitante_id: perfil.id,
    solicitante_nombre: perfil.nombre || perfil.email,
    categoria: datos.categoria,
    prioridad: datos.prioridad,
    fecha: datos.fecha || new Date().toISOString().split('T')[0]
  };
  const { data, error } = await supabase.from('solicitudes').insert(nueva).select().single();
  if (error) throw error;

  await supabase.from('historial').insert({
    solicitud_id: data.id,
    texto: 'Solicitud reportada por ' + (perfil.nombre || perfil.email),
    autor_id: perfil.id,
    autor_nombre: perfil.nombre || perfil.email
  });
  return data;
}

export async function actualizarSolicitud(id, cambios) {
  const { data, error } = await supabase.from('solicitudes').update(cambios).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function asignarSolicitud(id, { responsable_id, responsable_nombre, equipo, prioridad, notas }, perfil) {
  await actualizarSolicitud(id, {
    responsable_id, responsable_nombre, equipo: equipo || '', prioridad, estado: 'en-proceso'
  });
  await supabase.from('historial').insert({
    solicitud_id: id,
    texto: `Asignada a ${responsable_nombre}${equipo ? ' · ' + equipo : ''}${notas ? '. ' + notas : ''}`,
    autor_id: perfil.id,
    autor_nombre: perfil.nombre || perfil.email
  });
}

export async function agregarAvance(id, texto, nuevoEstado, perfil) {
  await supabase.from('historial').insert({
    solicitud_id: id, texto, autor_id: perfil.id, autor_nombre: perfil.nombre || perfil.email
  });
  if (nuevoEstado) await actualizarSolicitud(id, { estado: nuevoEstado });
}

export async function cerrarSolicitud(id, { solucion, fecha_cierre, satisfaccion }, perfil) {
  await actualizarSolicitud(id, {
    estado: 'cerrada', solucion, fecha_cierre, satisfaccion,
    cerrado_por_id: perfil.id, cerrado_por_nombre: perfil.nombre || perfil.email
  });
  await supabase.from('historial').insert({
    solicitud_id: id, fecha: new Date(fecha_cierre).toISOString(),
    texto: `Cerrada por ${perfil.nombre || perfil.email}. Solución: ${solucion}${satisfaccion ? ' · ' + etiqueta('satisfaccion', satisfaccion) : ''}`,
    autor_id: perfil.id, autor_nombre: perfil.nombre || perfil.email
  });
}

export async function cargarHistorial(id, signal) {
  const { data, error } = await supabase.from('historial').select('*').eq('solicitud_id', id).order('id', { ascending: true }).abortSignal(signal);
  if (error) throw new Error(error.message);
  return data || [];
}

export async function cargarPerfiles() {
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: true });
  return data || [];
}

export async function cargarTecnicos() {
  const { data } = await supabase.from('profiles').select('*').eq('role', 'tecnico').order('nombre');
  return data || [];
}

export async function actualizarRol(id, role) {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
  if (error) throw error;
}