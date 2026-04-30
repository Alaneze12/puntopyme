import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { obtenerEmpresa } from "../lib/empresa";

export default function Dashboard() {
  const [empresaId, setEmpresaId] = useState(null);

  const [ventasHoy, setVentasHoy] = useState(0);
  const [ingresosHoy, setIngresosHoy] = useState(0);
  const [ticketPromedio, setTicketPromedio] = useState(0);
  const [topProductos, setTopProductos] = useState([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const emp = await obtenerEmpresa();
    setEmpresaId(emp);
    await cargar(emp);
  };

  const hoyRango = () => {
    const inicio = new Date();
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date();
    fin.setHours(23, 59, 59, 999);

    return { inicio, fin };
  };

  const cargar = async (empId) => {
    const { inicio, fin } = hoyRango();

    // 🔥 VENTAS DEL DÍA
    const { data: ventas } = await supabase
      .from("ventas")
      .select("*")
      .eq("empresa_id", empId)
      .gte("created_at", inicio.toISOString())
      .lte("created_at", fin.toISOString());

    const totalVentas = ventas?.length || 0;
    setVentasHoy(totalVentas);

    // 🔥 INGRESOS
    const total = ventas?.reduce((acc, v) => acc + Number(v.total || 0), 0) || 0;
    setIngresosHoy(total);

    // 🔥 TICKET PROMEDIO
    setTicketPromedio(totalVentas > 0 ? total / totalVentas : 0);

    // 🔥 TOP PRODUCTOS
    const { data: detalles } = await supabase
      .from("ventas_detalle")
      .select("producto_id, cantidad, productos(nombre)")
      .eq("empresa_id", empId);

    const resumen = {};

    detalles?.forEach(d => {
      const nombre = d.productos?.nombre || "Sin nombre";

      if (!resumen[nombre]) {
        resumen[nombre] = 0;
      }

      resumen[nombre] += Number(d.cantidad);
    });

    const top = Object.entries(resumen)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    setTopProductos(top);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <Card titulo="Ventas Hoy" valor={ventasHoy} />
        <Card titulo="Ingresos Hoy" valor={`$${ingresosHoy}`} />
        <Card titulo="Ticket Promedio" valor={`$${ticketPromedio.toFixed(2)}`} />
      </div>

      <br />

      <div style={{ background: "#fff", padding: 20, borderRadius: 10 }}>
        <h3>Productos más vendidos</h3>

        {topProductos.length === 0 && <p>No hay datos</p>}

        {topProductos.map((p, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            {p[0]} - {p[1]} vendidos
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ titulo, valor }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        minWidth: 180,
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
      }}
    >
      <h4>{titulo}</h4>
      <h2>{valor}</h2>
    </div>
  );
}