export default function Ticket({ venta, detalles }) {
  return (
    <div id="ticket" style={ticketStyle}>
      <h2 style={{ textAlign: "center" }}>PuntoPyme</h2>
      <p style={{ textAlign: "center" }}>
        {new Date().toLocaleString()}
      </p>

      <hr />

      {detalles.map((d, i) => (
        <div key={i} style={{ marginBottom: 5 }}>
          {d.nombre} x{d.cantidad} - ${d.precio * d.cantidad}
        </div>
      ))}

      <hr />

      <h3>Total: ${venta.total}</h3>

      <p style={{ textAlign: "center" }}>
        ¡Gracias por su compra!
      </p>
    </div>
  );
}

const ticketStyle = {
  width: 250,
  padding: 10,
  fontFamily: "monospace",
  background: "#fff",
  color: "#000"
};