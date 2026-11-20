import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { cargarPerfiles, actualizarRol } from '../lib/data';

export default function Admin() {
  const { perfil } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => { cargarPerfiles().then(setUsuarios); }, []);

  const handleRolChange = async (id, nuevoRol) => {
    try {
      await actualizarRol(id, nuevoRol);
      setUsuarios(prev => prev.map(u => u.id === id ? { ...u, role: nuevoRol } : u));
      setMsg('Rol actualizado correctamente.');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Error: ' + err.message);
    }
  };

  return (
    <div className="pagina">
      <section className="panel">
        <h1>Panel de Administración</h1>
        <p>Gestiona los roles de los usuarios registrados.</p>
        {msg && <p className={msg.startsWith('Error') ? 'mensaje-error' : 'mensaje-exito'}>{msg}</p>}
      </section>

      <section className="panel">
        <h2>Usuarios registrados</h2>
        <div className="table-container">
          <table className="tabla-cards">
            <thead>
              <tr><th>Nombre</th><th>Correo</th><th>Rol</th></tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td data-label="Nombre">{u.nombre}</td>
                  <td data-label="Correo">{u.email}</td>
                  <td data-label="Rol">
                    <select
                      className="select-rol"
                      value={u.role || 'usuario'}
                      onChange={(e) => handleRolChange(u.id, e.target.value)}
                      disabled={u.id === perfil?.id}
                    >
                      <option value="usuario">Usuario</option>
                      <option value="tecnico">Técnico</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}