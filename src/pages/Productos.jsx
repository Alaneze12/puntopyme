import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { card, input, button } from "../components/ui";
import { obtenerEmpresa } from "../lib/empresa";
import { dinero } from "../lib/format";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [busqueda, setBusqueda] = useState("");
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

  const agregar = async () => {
    if (loading) return;

    if (!nombre) return alert("Falta nombre");

    const precioNum = Number(precio);
    const stockNum = Number(stock);

    if (precioNum < 0) return alert("Precio inválido");
    if (stockNum < 0) return alert("Stock inválido");

    setLoading(true);

    const { error } = await supabase.from("productos").insert([
      {
        nombre,
        precio: precioNum,
        stock: stockNum,
        empresa_id: empresaId,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error guardando producto");
      setLoading(false);
      return;
    }

    setNombre("");
    setPrecio("");
    setStock("");

    await cargar(empresaId);
    setLoading(false);
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;

    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("id", id)
      .eq("empresa_id", empresaId);

    if (error) {
      console.error(error);
      return alert("Error eliminando");
    }

    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  const editarStock = async (p, cambio) => {
    const nuevoStock = p.stock + cambio;

    if (nuevoStock < 0) return alert("No podés bajar de 0");

    const { error } = await supabase
      .from("productos")
      .update({ stock: nuevoStock })
      .eq("id", p.id)
      .eq("empresa_id", empresaId);

    if (error) {
      console.error(error);
      return alert("Error actualizando stock");
    }

    setProductos((prev) =>
      prev.map((prod) =>
        prod.id === p.id ? { ...prod, stock: nuevoStock } : prod
      )
    );
  };

  if (empresaId === null) return <p>Cargando...</p>;

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h1>Productos</h1>

      <div style={card}>
        <input
          style={input}
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          style={input}
          placeholder="Precio"
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />

        <input
          style={input}
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <button style={button} onClick={agregar} disabled={loading}>
          {loading ? "Guardando..." : "Agregar"}
        </button>
      </div>

      <br />

      <input
        style={input}
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <br />
      <br />

      <div style={card}>
        {filtrados.map((p) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span>
              {p.nombre} - {dinero(p.precio)} - Stock: {p.stock}
            </span>

            <div>
              <button onClick={() => editarStock(p, 1)}>+</button>
              <button onClick={() => editarStock(p, -1)}>-</button>
              <button onClick={() => eliminar(p.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
