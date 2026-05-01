import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { input, card } from "../components/ui";
import { obtenerEmpresa } from "../lib/empresa";
import { dinero } from "../lib/format";
import Button from "../components/Button";

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

      await supabase.from("compras_detalle").insert([
        {
          compra_id: compra.id,
          producto_id: p.id,
          cantidad: cant,
          precio: p.precio,
          empresa_id: empresaId,
        },
      ]);

      const nuevoStock = Number(p.stock) + cant;

      await supabase
        .from("productos")
        .update({ stock: nuevoStock })
        .eq("id", p.id)
        .eq("empresa_id", empresaId);

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

      <div style={card}>
        {/* SELECT */}
        <select
          style={{
            ...input,
            marginBottom: 15
          }}
          onChange={(e) => setId(e.target.value)}
          value={id}
        >
          <option value="">Elegir producto</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} ({dinero(p.precio)}) - Stock: {p.stock}
            </option>
          ))}
        </select>

        {/* CANTIDAD */}
        <input
          style={{
            ...input,
            marginBottom: 15
          }}
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />

        {/* BOTON PRO */}
        <Button onClick={comprar} disabled={loading}>
          {loading ? "Procesando..." : "Agregar Stock"}
        </Button>
      </div>
    </div>
  );
}