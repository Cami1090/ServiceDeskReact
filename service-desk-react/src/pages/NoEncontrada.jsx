import { Link } from 'react-router';

export default function NoEncontrada() {
  return (
    <div className="pagina">
      <section className="panel">
        <h1>Página no encontrada</h1>
        <p>La dirección no corresponde a ninguna vista de la aplicación.</p>
        <Link to="/" className="btn-detalle">Volver al inicio</Link>
      </section>
    </div>
  );
}