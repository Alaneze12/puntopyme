import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { input, button } from "../components/ui";
import { obtenerEmpresa } from "../lib/empresa";
import { dinero } from "../lib/format";

export default function Compras() {
  const [productos, setProductos] = useState([]);
  const [id, setId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [empresaId, setEmpresaId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const emp = await obtenerEmpresa();
    setEmpresaId(emp);

    if (emp) {
      cargar(emp);
    }
  };

  const cargar = async (empId) => {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("empresa_id", empId);

    if (error) {
      console.error(error);
      return alert("Error cargando productos");
    }

    setProductos(data || []);
  };

  const comprar = async () => {
    if (loading) return;

    if (!id) return alert("Elegí un producto");

    const p = productos.find((x) => x.id === id);
    if (!p) return alert("Producto no encontrado");

    const cant = Number(cantidad);
    if (cant <= 0) return alert("Cantidad inválida");

    setLoading(true);

    try {
      const { data: compra, error } = await supabase
        .from("compras")
        .insert([
          {
            empresa_id: empresaId,
            total: p.precio * cant,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const { error: errDetalle } = await supabase
        .from("compras_detalle")
        .insert([
          {
            compra_id: compra.id,
            producto_id: p.id,
            cantidad: cant,
            precio: p.precio,
            empresa_id: empresaId,
          },
        ]);

      if (errDetalle) throw errDetalle;

      const nuevoStock = Number(p.stock) + cant;

      const { error: errStock } = await supabase
        .from("productos")
        .update({ stock: nuevoStock })
        .eq("id", p.id)
        .eq("empresa_id", empresaId);

      if (errStock) throw errStock;

      setProductos((prev) =>
        prev.map((prod) =>
          prod.id === p.id ? { ...prod, stock: nuevoStock } : prod
        )
      );

      alert("Compra registrada correctamente");

      setCantidad(1);
      setId("");
    } catch (err) {
      console.error(err);
      alert("Error en la compra");
    }

    setLoading(false);
  };

  if (empresaId === null) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Compras</h1>

      <select onChange={(e) => setId(e.target.value)} value={id}>
        <option value="">Elegir producto</option>
        {productos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre} ({dinero(p.precio)}) - Stock: {p.stock}
          </option>
        ))}
      </select>

      <br />
      <br />

      <input
        style={input}
        type="number"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
      />

      <br />
      <br />

      <button style={button} onClick={comprar} disabled={loading}>
        {loading ? "Procesando..." : "Agregar Stock"}
      </button>
    </div>
  );
}
