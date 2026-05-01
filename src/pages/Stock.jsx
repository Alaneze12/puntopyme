import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { obtenerEmpresa } from "../lib/empresa";
import { dinero } from "../lib/format";

export default function Stock() {
  const [empresaId, setEmpresaId] = useState(null);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

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
      .from("productos")
      .select("*")
      .eq("empresa_id", empId);

    setProductos(data || []);
  };

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalStock = productos.reduce((acc, p) => acc + p.stock, 0);
  const valorTotal = productos.reduce(
    (acc, p) => acc + p.stock * p.precio,
    0
  );

  if (!empresaId) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Stock</h1>

      <input
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <h3>Total unidades: {totalStock}</h3>
      <h3>Valor inventario: {dinero(valorTotal)}</h3>

      {filtrados.map((p) => (
        <div key={p.id} style={{ marginBottom: 10 }}>
          {p.nombre} - {dinero(p.precio)} - Stock: {p.stock}
        </div>
      ))}
    </div>
  );
}