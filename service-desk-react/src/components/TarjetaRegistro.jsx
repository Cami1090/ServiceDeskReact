import { Link } from 'react-router';
import { etiqueta } from '../lib/data';
import { useToggle } from '../hooks/useToggle';

export default function TarjetaRegistro({ registro }) {
  const { value: verDetalles, toggle } = useToggle(false);

  return (
    <article className="tarjeta">
      <div className="tarjeta-header">
        <span className={`badge estado-${registro.estado}`}>{etiqueta('estado', registro.estado)}</span>
        <span className="tarjeta-id">SD-{registro.id}</span>
      </div>
      <h3>{registro.titulo}</h3>

      <button type="button" onClick={toggle} aria-expanded={verDetalles} className="btn-toggle">
        {verDetalles ? 'Ocultar detalles' : 'Mostrar detalles'}
      </button>

      {verDetalles && (
        <div className="detalles-extra">
          <p>{registro.descripcion}</p>
          <p><strong>Prioridad:</strong> {etiqueta('prioridad', registro.prioridad)}</p>
          <p><strong>Resp:</strong> {registro.responsable_nombre || 'Sin asignar'}</p>
        </div>
      )}

      <Link to={`/seguimiento/${encodeURIComponent(registro.id)}`} className="btn-detalle">Gestionar Ticket</Link>
    </article>
  );
}