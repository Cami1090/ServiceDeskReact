import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useAuth } from '../context/useAuth';
import { AvisoError } from '../components/AvisoError';
import { idValido } from '../lib/idSolicitud';
import { formatearFecha } from '../lib/formato';
import { agregarAvance, cargarHistorial, etiqueta, obtenerSolicitudPorId } from '../lib/data';

function Pagina({ children }) {
  return (
    <div className="pagina">
      <section className="panel">{children}</section>
    </div>
  );
}

export default function Detalle() {
  const { id } = useParams();
  const { session, perfil } = useAuth();
  const usuario = session.user.id;
  const [revision, setRevision] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorAvance, setErrorAvance] = useState('');
  const valido = idValido(id);

  useEffect(() => {
    if (!valido) return;
    const control = new AbortController();
    let vigente = true;

    async function cargar() {
      try {
        const solicitud = await obtenerSolicitudPorId(id, control.signal);
        const historial = solicitud ? await cargarHistorial(id, control.signal) : [];
        if (vigente) setResultado({ id, usuario, revision, solicitud, historial });
      } catch {
        if (vigente) setResultado({ id, usuario, revision, fallo: true });
      }
    }
    cargar();

    return () => {
      vigente = false;
      control.abort();
    };
  }, [id, usuario, revision, valido]);

  async function guardarAvance(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const texto = form.elements.texto.value.trim();
    const estado = form.elements.estado.value;
    if (!texto) return;

    setGuardando(true);
    setErrorAvance('');
    try {
      await agregarAvance(id, texto, estado, perfil);
      form.reset();
      setRevision(n => n + 1);
    } catch {
      setErrorAvance('No se pudo guardar el avance.');
    } finally {
      setGuardando(false);
    }
  }

  const actual = resultado?.id === id && resultado?.usuario === usuario && resultado?.revision === revision;

  if (!valido) {
    return (
      <Pagina>
        <p>Identificador inválido.</p>
        <Link to="/seguimiento">Volver al listado</Link>
      </Pagina>
    );
  }

  if (!actual) return <p role="status" className="cargando-pantalla">Consultando solicitud…</p>;

  if (resultado.fallo) {
    return (
      <Pagina>
        <AvisoError>No se pudo consultar la solicitud.</AvisoError>
        <div className="acciones-form">
          <button type="button" onClick={() => setRevision(n => n + 1)}>Reintentar</button>
          <Link to="/seguimiento">Volver al listado</Link>
        </div>
      </Pagina>
    );
  }

  const { solicitud, historial } = resultado;

  if (!solicitud) {
    return (
      <Pagina>
        <p>Solicitud no disponible.</p>
        <Link to="/seguimiento">Volver al listado</Link>
      </Pagina>
    );
  }

  const esStaff = perfil?.role === 'admin' || perfil?.role === 'tecnico';

  return (
    <div className="pagina">
      <section className="panel">
        <h2>SD-{solicitud.id}: {solicitud.titulo}</h2>
        <p>
          <span className={`badge estado-${solicitud.estado}`}>{etiqueta('estado', solicitud.estado)}</span>
          {' '}· <strong>Prioridad:</strong> {etiqueta('prioridad', solicitud.prioridad)}
          {solicitud.fecha && <> · <strong>Reportada:</strong> {formatearFecha(solicitud.fecha)}</>}
        </p>
        <p>{solicitud.descripcion}</p>
        <Link to="/seguimiento">Volver al listado</Link>
      </section>

      <section className="panel">
        <h3>Historial</h3>
        <ul className="historial-lista">
          {historial.map(h => (
            <li key={h.id}>
              <strong>{h.autor_nombre}:</strong> {h.texto}
              {h.fecha && <> · {formatearFecha(h.fecha)}</>}
            </li>
          ))}
        </ul>
      </section>

      {esStaff && solicitud.estado !== 'cerrada' && (
        <section className="panel">
          <h3>Agregar avance</h3>
          {errorAvance && <AvisoError>{errorAvance}</AvisoError>}
          <form key={solicitud.estado} onSubmit={guardarAvance} className="formulario">
            <textarea name="texto" placeholder="Escriba un avance..." required />
            <select name="estado" defaultValue={solicitud.estado}>
              <option value="abierta">Abierta</option>
              <option value="en-proceso">En proceso</option>
              <option value="resuelta">Resuelta</option>
              <option value="cerrada">Cerrada</option>
            </select>
            <button type="submit" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar avance'}</button>
          </form>
        </section>
      )}
    </div>
  );
}