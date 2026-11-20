import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/useAuth';

export function RutaPrivada({ roles }) {
  const { session, perfil, cargando } = useAuth();

  if (cargando) return <p role="status" className="cargando-pantalla">Comprobando sesión…</p>;
  if (!session) return <Navigate to="/acceso" replace />;

  const rol = perfil?.role || 'usuario';
  if (roles && !roles.includes(rol)) return <Navigate to="/seguimiento" replace />;

  return <Outlet />;
}