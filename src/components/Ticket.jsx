export default function Ticket({ venta, detalles, empresa }) {
  const fecha = new Date().toLocaleString();

  const total = Number(venta.total || 0);

  return (
    <div id="ticket" style={ticketStyle}>
      {/* HEADER */}
      <div style={center}>
        <h2 style={titulo}>{empresa || "PuntoPyme"}</h2>
        <p style={small}>{fecha}</p>
      </div>

      <div style={divider} />

      {/* ITEMS */}
      {detalles.map((d, i) => (
        <div key={i} style={item}>
          <span style={nombre}>
            {d.nombre} x{d.cantidad}
          </span>
          <span>${(d.precio * d.cantidad).toFixed(2)}</span>
        </div>
      ))}

      <div style={divider} />

      {/* TOTAL */}
      <div style={totalBox}>
        <span>Total</span>
        <strong>${total.toFixed(2)}</strong>
      </div>

      <div style={divider} />

      {/* FOOTER */}
      <div style={center}>
        <p style={small}>¡Gracias por su compra!</p>
      </div>
    </div>
  );
}

/* ESTILOS */

const ticketStyle = {
  width: 260,
  padding: 12,
  fontFamily: "monospace",
  background: "#fff",
  color: "#000",
  borderRadius: 6,
  border: "1px dashed #ccc",
};

const center = {
  textAlign: "center",
};

const titulo = {
  margin: 0,
  fontSize: 18,
};

const small = {
  fontSize: 12,
  opacity: 0.7,
  margin: 0,
};

const divider = {
  borderTop: "1px dashed #ccc",
  margin: "10px 0",
};

const item = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 13,
  marginBottom: 4,
};

const nombre = {
  maxWidth: 160,
};

const totalBox = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 15,
};