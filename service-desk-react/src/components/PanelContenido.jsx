export default function PanelContenido({ titulo, children }) {
  return (
    <section className="panel" aria-label={titulo}>
      <h2>{titulo}</h2>
      <div className="rejilla">
        {children}
      </div>
    </section>
  );
}