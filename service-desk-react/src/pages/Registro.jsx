import { useState, useId } from 'react';
import { useAuth } from '../context/useAuth';
import { agregarSolicitud } from '../lib/data';
import { useNavigate } from 'react-router';
import EncabezadoProyecto from '../components/EncabezadoProyecto';

export default function Registro() {
  const { perfil } = useAuth();
  const navigate = useNavigate();
  const id = useId();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('hardware');
  const [prioridad, setPrioridad] = useState('media');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim()) {
      setError('El título y la descripción no pueden estar vacíos.');
      return;
    }
    setError('');
    setCargando(true);

    try {
      await agregarSolicitud({ titulo: titulo.trim(), descripcion: descripcion.trim(), categoria, prioridad }, perfil);
      navigate('/seguimiento');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="pagina">
      <EncabezadoProyecto nombre="Registrar Solicitud" subtitulo="Nuevo Ticket" />
      <section className="panel">
        {error && <p role="alert" className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit} className="formulario" noValidate>
          <div className="form-group">
            <label htmlFor={id + '-titulo'}>Título</label>
            <input id={id + '-titulo'} value={titulo} onChange={e => setTitulo(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor={id + '-cat'}>Categoría</label>
            <select id={id + '-cat'} value={categoria} onChange={e => setCategoria(e.target.value)}>
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="red">Red</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor={id + '-prioridad'}>Prioridad</label>
            <select id={id + '-prioridad'} value={prioridad} onChange={e => setPrioridad(e.target.value)}>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor={id + '-desc'}>Descripción</label>
            <textarea id={id + '-desc'} value={descripcion} onChange={e => setDescripcion(e.target.value)} rows="4" />
          </div>
          <button type="submit" disabled={cargando}>{cargando ? 'Guardando...' : 'Registrar'}</button>
        </form>
      </section>
    </div>
  );
}