import { Link } from 'react-router';
import { useAuth } from '../context/useAuth';
import EncabezadoProyecto from '../components/EncabezadoProyecto';

export default function Inicio() {
  const { session } = useAuth();

  return (
    <div className="pagina">
      <EncabezadoProyecto nombre="ServiceDesk" subtitulo="Soporte técnico" />
      <section className="panel">
        <h2>Gestión de solicitudes de soporte</h2>
        <p>Registre incidentes, asigne responsables y siga cada solicitud hasta su cierre.</p>
        {session === null && <Link to="/acceso" className="btn-detalle">Iniciar sesión</Link>}
        {session && <Link to="/seguimiento" className="btn-detalle">Ir al seguimiento</Link>}
      </section>
    </div>
  );
}