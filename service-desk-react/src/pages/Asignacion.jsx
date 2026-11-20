import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { cargarSolicitudes, cargarTecnicos, asignarSolicitud } from '../lib/data';

export default function Asignacion() {
  const { perfil } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    cargarSolicitudes().then(data => setSolicitudes(data.filter(s => !s.responsable_id)));
    cargarTecnicos().then(setTecnicos);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const idSol = parseInt(form.elements.solicitud.value);
    const idTec = form.elements.tecnico.value;
    const tec = tecnicos.find(t => t.id === idTec);

    if (!idSol || !tec) return;

    try {
      await asignarSolicitud(idSol, {
        responsable_id: tec.id,
        responsable_nombre: tec.nombre,
        equipo: form.elements.equipo.value,
        prioridad: form.elements.prioridad.value,
        notas: form.elements.notas.value
      }, perfil);

      setMsg(`✔ Asignada a ${tec.nombre}`);
      setSolicitudes(prev => prev.filter(s => s.id !== idSol));
      form.reset();
    } catch (err) {
      setMsg('Error: ' + err.message);
    }
  };

  return (
    <div className="pagina">
      <section className="panel">
        <h1>Asignación de solicitudes</h1>
        <p>Asigna cada solicitud pendiente a un técnico o equipo responsable.</p>
      </section>

      <section className="panel">
        <h2>Solicitudes sin asignar</h2>
        <div className="table-container">
          <table>
            <thead><tr><th>ID</th><th>Título</th><th>Prioridad</th></tr></thead>
            <tbody>
              {solicitudes.map(s => (
                <tr key={s.id}>
                  <td>SD-{s.id}</td>
                  <td>{s.titulo}</td>
                  <td>{s.prioridad}</td>
                </tr>
              ))}
              {solicitudes.length === 0 && <tr><td colSpan="3">No hay solicitudes pendientes.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Asignar solicitud</h2>
        {msg && <p className={msg.startsWith('Error') ? 'mensaje-error' : 'mensaje-exito'}>{msg}</p>}
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Detalles de asignación</legend>
            <div className="form-grid">
              <div className="form-group">
                <label>Solicitud</label>
                <select name="solicitud" required>
                  <option value="">Selecciona una solicitud</option>
                  {solicitudes.map(s => <option key={s.id} value={s.id}>SD-{s.id} — {s.titulo}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Técnico responsable</label>
                <select name="tecnico" required>
                  <option value="">Selecciona un técnico</option>
                  {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Equipo o área</label>
                <input type="text" name="equipo" />
              </div>
              <div className="form-group">
                <label>Prioridad confirmada</label>
                <select name="prioridad">
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Notas</label>
                <textarea name="notas" rows="3"></textarea>
              </div>
            </div>
          </fieldset>
          <div className="acciones-form">
            <button type="submit">Confirmar asignación</button>
          </div>
        </form>
      </section>
    </div>
  );
}