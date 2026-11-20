import { useState } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/useAuth';

export default function Acceso() {
  const { session, cargando, entrar } = useAuth();
  const [pendiente, setPendiente] = useState(false);
  const [error, setError] = useState('');

  async function iniciar() {
    setPendiente(true);
    setError('');
    try {
      await entrar();
    } catch {
      setError('No se pudo iniciar el acceso. Inténtelo de nuevo.');
      setPendiente(false);
    }
  }

  if (cargando) return <p role="status" className="cargando-pantalla">Comprobando sesión…</p>;
  if (session) return <Navigate to="/seguimiento" replace />;

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1>ServiceDesk</h1>
          <p>Gestione sus solicitudes de soporte</p>
          {error && <p role="alert" className="mensaje-error">{error}</p>}
          <button type="button" onClick={iniciar} disabled={pendiente} className="btn-google">
            {pendiente ? 'Abriendo el acceso…' : 'Continuar con Google'}
          </button>
        </div>
      </div>
    </div>
  );
}