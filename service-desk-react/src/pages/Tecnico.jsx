import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { cargarSolicitudes } from '../lib/data';
import { Link } from 'react-router';

export default function Tecnico() {
  const { perfil } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    if (!perfil?.id) return;
    cargarSolicitudes().then(data => {
      setSolicitudes(data.filter(s => s.responsable_id === perfil.id && s.estado !== 'cerrada'));
    });
  }, [perfil?.id]);

  return (
    <div className="pagina">
      <section className="panel">
        <h1>Mis Asignaciones</h1>
        <p>Solicitudes pendientes por resolver.</p>
      </section>
      <section className="panel">
        <h2>Solicitudes a mi cargo</h2>
        <div className="table-container">
          <table className="tabla-cards">
            <thead>
              <tr><th>ID</th><th>Título</th><th>Prioridad</th><th>Estado</th><th>Acción</th></tr>
            </thead>
            <tbody>
              {solicitudes.map(s => (
                <tr key={s.id}>
                  <td data-label="ID">SD-{s.id}</td>
                  <td data-label="Título">{s.titulo}</td>
                  <td data-label="Prioridad">{s.prioridad}</td>
                  <td data-label="Estado">{s.estado}</td>
                  <td data-label="Acción"><Link to={`/seguimiento/${encodeURIComponent(s.id)}`}>Gestionar</Link></td>
                </tr>
              ))}
              {solicitudes.length === 0 && <tr><td colSpan="5">No tienes solicitudes asignadas.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}