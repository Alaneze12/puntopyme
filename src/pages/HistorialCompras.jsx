import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { obtenerEmpresa } from "../lib/empresa";
import { dinero } from "../lib/format";
import Button from "../components/Button";

export default function HistorialCompras() {
  const [empresaId, setEmpresaId] = useState(null);
  const [compras, setCompras] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [compraSel, setCompraSel] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const emp = await obtenerEmpresa();
    setEmpresaId(emp);
    if (emp) cargar(emp);
  };

  const cargar = async (empId) => {
    const { data } = await supabase
      .from("compras")
      .select("*")
      .eq("empresa_id", empId)
      .order("created_at", { ascending: false });

    setCompras(data || []);
  };

  const verDetalle = async (compra) => {
    const { data } = await supabase
      .from("compras_detalle")
      .select("cantidad, precio, productos(nombre)")
      .eq("compra_id", compra.id);

    const lista = data.map((d) => ({
      nombre: d.productos?.nombre,
      cantidad: d.cantidad,
      precio: d.precio,
    }));

    setCompraSel(compra);
    setDetalles(lista);
  };

  if (!empresaId) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Historial de Compras</h1>

      {compras.map((c) => (
        <div key={c.id} style={{ marginBottom: 10 }}>
          <b>{new Date(c.created_at).toLocaleString()}</b> - {dinero(c.total)}

          <Button onClick={() => verDetalle(c)}>
            Ver
          </Button>
        </div>
      ))}

      {compraSel && (
        <div style={{ marginTop: 20 }}>
          <h3>Detalle</h3>

          {detalles.map((d, i) => (
            <div key={i}>
              {d.nombre} x{d.cantidad} - ${d.precio * d.cantidad}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}