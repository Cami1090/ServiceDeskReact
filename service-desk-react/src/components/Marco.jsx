import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { useAuth } from '../context/useAuth';
import { useMenuCompacto } from '../hooks/useMenuCompacto';
import styles from './Marco.module.css';

const claseEnlace = ({ isActive }) =>
  isActive ? styles.enlace + ' ' + styles.activo : styles.enlace;

export function Marco({ children }) {
  const { session, perfil, cargando, salir } = useAuth();
  const { compacto, alternar } = useMenuCompacto();
  const [pendiente, setPendiente] = useState(false);
  const [error, setError] = useState('');

  const rol = perfil?.role || 'usuario';
  const esStaff = rol === 'admin' || rol === 'tecnico';
  const puedeRegistrar = rol === 'usuario' || rol === 'admin';

  async function cerrar() {
    setError('');
    setPendiente(true);
    try {
      await salir();
    } catch {
      setError('No se pudo cerrar la sesión. Vuelva a intentarlo.');
    } finally {
      setPendiente(false);
    }
  }

  return (
    <>
      <header className={styles.cabecera}>
        <Link to="/" className={styles.marca}>ServiceDesk</Link>
        <nav aria-label="Principal" className={compacto ? styles.compacto : styles.menu}>
          <NavLink to="/" end className={claseEnlace}>Inicio</NavLink>
          {session && !cargando && (
            <>
              <NavLink to="/seguimiento" className={claseEnlace}>Seguimiento</NavLink>
              {puedeRegistrar && <NavLink to="/registro" className={claseEnlace}>Registrar solicitud</NavLink>}
              {esStaff && <NavLink to="/asignacion" className={claseEnlace}>Asignación</NavLink>}
              {esStaff && <NavLink to="/tecnico" className={claseEnlace}>Mis asignaciones</NavLink>}
              {rol === 'admin' && <NavLink to="/admin" className={claseEnlace}>Admin</NavLink>}
            </>
          )}
          {session === null && <NavLink to="/acceso" className={claseEnlace}>Acceso</NavLink>}
        </nav>
        <div className={styles.controles}>
          {session && !cargando && (
            <span className={styles.usuario}>{perfil?.nombre || session.user.email} ({rol})</span>
          )}
          <button type="button" className="btn-auth" aria-pressed={compacto} onClick={alternar}>
            Menú compacto
          </button>
          {session && (
            <button type="button" className="btn-auth btn-auth-salir" disabled={pendiente} onClick={cerrar}>
              {pendiente ? 'Cerrando…' : 'Cerrar sesión'}
            </button>
          )}
        </div>
        {error && <p role="alert" className={'mensaje-error ' + styles.error}>{error}</p>}
      </header>
      <main>{children}</main>
    </>
  );
}