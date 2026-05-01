import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { obtenerEmpresa } from "../lib/empresa";
import { dinero } from "../lib/format";
import Ticket from "../components/Ticket";
import Button from "../components/Button";
import { imprimir } from "../lib/print";

export default function HistorialVentas() {
  const [empresaId, setEmpresaId] = useState(null);
  const [ventas, setVentas] = useState([]);
  const [filtro, setFiltro] = useState("hoy");

  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const emp = await obtenerEmpresa();
    setEmpresaId(emp);
    if (emp) cargar(emp);
  };

  const getRango = () => {
    const ahora = new Date();

    let inicio = new Date();

    if (filtro === "hoy") {
      inicio.setHours(0, 0, 0, 0);
    }

    if (filtro === "semana") {
      inicio.setDate(ahora.getDate() - 7);
    }

    if (filtro === "mes") {
      inicio.setMonth(ahora.getMonth() - 1);
    }

    return { inicio, fin: ahora };
  };

  const cargar = async (empId) => {
    const { inicio, fin } = getRango();

    const { data } = await supabase
      .from("ventas")
      .select("*")
      .eq("empresa_id", empId)
      .gte("created_at", inicio.toISOString())
      .lte("created_at", fin.toISOString())
      .order("created_at", { ascending: false });

    setVentas(data || []);
  };

  const verDetalle = async (venta) => {
    const { data } = await supabase
      .from("ventas_detalle")
      .select("cantidad, precio, productos(nombre)")
      .eq("venta_id", venta.id);

    const lista = data.map((d) => ({
      nombre: d.productos?.nombre,
      cantidad: d.cantidad,
      precio: d.precio,
    }));

    setVentaSeleccionada(venta);
    setDetalles(lista);
  };

  if (!empresaId) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Historial de Ventas</h1>

      {/* FILTROS */}
      <div style={{ marginBottom: 20 }}>
        <Button onClick={() => { setFiltro("hoy"); cargar(empresaId); }}>
          Hoy
        </Button>

        <Button onClick={() => { setFiltro("semana"); cargar(empresaId); }}>
          Semana
        </Button>

        <Button onClick={() => { setFiltro("mes"); cargar(empresaId); }}>
          Mes
        </Button>
      </div>

      {/* LISTA */}
      {ventas.map((v) => (
        <div key={v.id} style={{ marginBottom: 10 }}>
          <b>{new Date(v.created_at).toLocaleString()}</b> - {dinero(v.total)}

          <Button onClick={() => verDetalle(v)}>
            Ver
          </Button>
        </div>
      ))}

      {/* DETALLE */}
      {ventaSeleccionada && (
        <div style={{ marginTop: 30 }}>
          <h3>Detalle de venta</h3>

          <Ticket venta={ventaSeleccionada} detalles={detalles} />

          <Button onClick={imprimir}>
            Imprimir
          </Button>
        </div>
      )}
    </div>
  );
}