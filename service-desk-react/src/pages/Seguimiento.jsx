import { useState, useEffect } from 'react';
import { cargarSolicitudes } from '../lib/data';
import EncabezadoProyecto from '../components/EncabezadoProyecto';
import TarjetaRegistro from '../components/TarjetaRegistro';

export default function Seguimiento() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');

  useEffect(() => {
    cargarSolicitudes().then(data => {
      setSolicitudes(data);
      setCargando(false);
    });
  }, []);

  const resultados = solicitudes.filter(sol => {
    const coincideTexto = sol.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'todas' || sol.estado === filtroEstado;
    return coincideTexto && coincideEstado;
  });

  return (
    <div className="pagina">
      <EncabezadoProyecto nombre="Seguimiento" subtitulo="Listado General" />
      <section className="panel">
        <div className="filtros-flex">
          <input
            placeholder="Buscar por título..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="todas">Todos los estados</option>
            <option value="abierta">Abiertas</option>
            <option value="en-proceso">En Proceso</option>
            <option value="cerrada">Cerradas</option>
          </select>
        </div>

        <p role="status" className="contador">Resultados: {resultados.length}</p>

        {cargando ? <p>Cargando datos...</p> : (
          resultados.length === 0 ? (
            <p className="sin-resultados">No hay coincidencias con su búsqueda.</p>
          ) : (
            <div className="rejilla">
              {resultados.map(sol => <TarjetaRegistro key={sol.id} registro={sol} />)}
            </div>
          )
        )}
      </section>
    </div>
  );
}