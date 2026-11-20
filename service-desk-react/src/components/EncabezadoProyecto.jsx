export default function EncabezadoProyecto({ nombre, subtitulo }) {
  return (
    <header className="encabezado">
      <p className="subtitulo">{subtitulo}</p>
      <h1>{nombre}</h1>
    </header>
  );
}