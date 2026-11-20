import { useState, useEffect } from 'react';
import { cargarSolicitudes } from '../lib/data';
import TarjetaRegistro from './TarjetaRegistro';

export default function ListaSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await cargarSolicitudes();
      setSolicitudes(data);
      setCargando(false);
    }
    fetchData();
  }, []);

  if (cargando) return <p>Cargando datos desde Supabase...</p>;

  if (solicitudes.length === 0) {
    return <p>No hay solicitudes registradas aún.</p>;
  }

  
  return (
    <>
      {solicitudes.map((sol) => (
        <TarjetaRegistro key={sol.id} registro={sol} />
      ))}
    </>
  );
}