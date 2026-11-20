import { Route, Routes } from 'react-router';
import { Marco } from './components/Marco';
import { RutaPrivada } from './components/RutaPrivada';
import Inicio from './pages/Inicio';
import Acceso from './pages/Acceso';
import Seguimiento from './pages/Seguimiento';
import Detalle from './pages/Detalle';
import Registro from './pages/Registro';
import Asignacion from './pages/Asignacion';
import Tecnico from './pages/Tecnico';
import Admin from './pages/Admin';
import NoEncontrada from './pages/NoEncontrada';

export default function App() {
  return (
    <Marco>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/acceso" element={<Acceso />} />

        <Route element={<RutaPrivada />}>
          <Route path="/seguimiento" element={<Seguimiento />} />
          <Route path="/seguimiento/:id" element={<Detalle />} />
        </Route>

        <Route element={<RutaPrivada roles={['usuario', 'admin']} />}>
          <Route path="/registro" element={<Registro />} />
        </Route>

        <Route element={<RutaPrivada roles={['admin', 'tecnico']} />}>
          <Route path="/asignacion" element={<Asignacion />} />
          <Route path="/tecnico" element={<Tecnico />} />
        </Route>

        <Route element={<RutaPrivada roles={['admin']} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </Marco>
  );
}