import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { obtenerEmpresa } from "../lib/empresa";
import { card } from "../components/ui";
import { dinero } from "../lib/format";

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
    if (emp) await cargar(emp);
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

    const { data: ventas } = await supabase
      .from("ventas")
      .select("*")
      .eq("empresa_id", empId)
      .gte("created_at", inicio.toISOString())
      .lte("created_at", fin.toISOString());

    const totalVentas = ventas?.length || 0;
    setVentasHoy(totalVentas);

    const total =
      ventas?.reduce((acc, v) => acc + Number(v.total || 0), 0) || 0;
    setIngresosHoy(total);

    setTicketPromedio(totalVentas > 0 ? total / totalVentas : 0);

    const { data: detalles } = await supabase
      .from("ventas_detalle")
      .select("producto_id, cantidad, productos(nombre)")
      .eq("empresa_id", empId);

    const resumen = {};

    detalles?.forEach((d) => {
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

  if (empresaId === null) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      {/* KPIs */}
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <Stat titulo="Ventas Hoy" valor={ventasHoy} />
        <Stat titulo="Ingresos Hoy" valor={dinero(ingresosHoy)} />
        <Stat
          titulo="Ticket Promedio"
          valor={dinero(ticketPromedio)}
        />
      </div>

      {/* TOP PRODUCTOS */}
      <div style={card}>
        <h3 style={{ marginBottom: 15 }}>🔥 Más vendidos</h3>

        {topProductos.length === 0 && <p>No hay datos</p>}

        {topProductos.map((p, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <span>{p[0]}</span>
            <strong>{p[1]}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

/* COMPONENTE PRO */
function Stat({ titulo, valor }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 14,
        minWidth: 200,
        flex: 1,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        border: "1px solid #eee",
      }}
    >
      <p style={{ margin: 0, opacity: 0.6, fontSize: 13 }}>
        {titulo}
      </p>

      <h2 style={{ margin: "8px 0 0 0" }}>{valor}</h2>
    </div>
  );
}