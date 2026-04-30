import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { card, button } from "../components/ui";
import { obtenerEmpresa } from "../lib/empresa";
import { dinero } from "../lib/format";
import Ticket from "../components/Ticket";
import { imprimir } from "../lib/print";

export default function Ventas() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [empresaId, setEmpresaId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [ultimaVenta, setUltimaVenta] = useState(null);
  const [detallesVenta, setDetallesVenta] = useState([]);

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

  const agregar = (p) => {
    const cantidadEnCarrito = carrito.filter((x) => x.id === p.id).length;

    if (cantidadEnCarrito >= p.stock) {
      return alert("Sin stock suficiente");
    }

    setCarrito((prev) => [...prev, p]);
  };

  const quitar = (index) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  };

  const total = carrito.reduce((acc, p) => acc + Number(p.precio), 0);

  const vender = async () => {
    if (loading) return;
    if (carrito.length === 0) return alert("Carrito vacío");

    setLoading(true);

    try {
      const { data: venta, error } = await supabase
        .from("ventas")
        .insert([
          {
            empresa_id: empresaId,
            total: total,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const agrupados = {};

      carrito.forEach((p) => {
        if (!agrupados[p.id]) {
          agrupados[p.id] = { ...p, cantidad: 0 };
        }
        agrupados[p.id].cantidad++;
      });

      for (let key in agrupados) {
        const p = agrupados[key];

        if (Number(p.stock) < p.cantidad) {
          throw new Error(`Stock insuficiente para ${p.nombre}`);
        }

        const { error: errDetalle } = await supabase
          .from("ventas_detalle")
          .insert([
            {
              venta_id: venta.id,
              producto_id: p.id,
              cantidad: p.cantidad,
              precio: p.precio,
              empresa_id: empresaId,
            },
          ]);

        if (errDetalle) throw errDetalle;

        const nuevoStock = Number(p.stock) - p.cantidad;

        const { error: errStock } = await supabase
          .from("productos")
          .update({ stock: nuevoStock })
          .eq("id", p.id)
          .eq("empresa_id", empresaId);

        if (errStock) throw errStock;
      }

      setUltimaVenta(venta);

      const detallesListos = Object.values(agrupados).map((p) => ({
        nombre: p.nombre,
        cantidad: p.cantidad,
        precio: p.precio,
      }));

      setDetallesVenta(detallesListos);

      setCarrito([]);
      await cargar(empresaId);

      alert("Venta registrada correctamente");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error en la venta");
    }

    setLoading(false);
  };

  if (empresaId === null) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Ventas</h1>

      <div style={card}>
        {productos.map((p) => (
          <button key={p.id} onClick={() => agregar(p)}>
            {p.nombre} ({dinero(p.precio)}) - Stock: {p.stock}
          </button>
        ))}
      </div>

      <br />

      <div style={card}>
        <h3>Carrito</h3>

        {carrito.length === 0 && <p>Sin productos</p>}

        {carrito.map((p, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span>{p.nombre}</span>
            <button onClick={() => quitar(i)}>Quitar</button>
          </div>
        ))}

        <h2>Total: {dinero(total)}</h2>

        <button style={button} onClick={vender} disabled={loading}>
          {loading ? "Procesando..." : "Confirmar Venta"}
        </button>
      </div>

      {ultimaVenta && (
        <div style={{ marginTop: 20 }}>
          <h3>Ticket</h3>

          <Ticket venta={ultimaVenta} detalles={detallesVenta} />

          <button style={button} onClick={imprimir}>
            Imprimir Ticket
          </button>
        </div>
      )}
    </div>
  );
}
