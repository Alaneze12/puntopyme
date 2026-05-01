import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { obtenerEmpresa } from "../lib/empresa";
import { card, input } from "../components/ui";
import Button from "../components/Button";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
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
      .from("clientes")
      .select("*")
      .eq("empresa_id", empId);

    if (error) {
      console.error(error);
      return alert("Error cargando clientes");
    }

    setClientes(data || []);
  };

  const agregar = async () => {
    if (loading) return;
    if (!nombre) return alert("Ingresá un nombre");

    setLoading(true);

    const { error } = await supabase.from("clientes").insert([
      {
        nombre,
        empresa_id: empresaId,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error agregando cliente");
      setLoading(false);
      return;
    }

    setNombre("");
    await cargar(empresaId);
    setLoading(false);
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar cliente?")) return;

    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id)
      .eq("empresa_id", empresaId);

    if (error) {
      console.error(error);
      return alert("Error eliminando cliente");
    }

    setClientes((prev) => prev.filter((c) => c.id !== id));
  };

  if (empresaId === null) return <p>Cargando...</p>;

  const filtrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h1>Clientes</h1>

      {/* FORM */}
      <div style={card}>
        <input
          style={{ ...input, marginBottom: 10 }}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del cliente"
        />

        <Button onClick={agregar} disabled={loading}>
          {loading ? "Agregando..." : "Agregar Cliente"}
        </Button>
      </div>

      <br />

      {/* BUSCADOR */}
      <input
        style={{ ...input, marginBottom: 15 }}
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* LISTA */}
      <div style={card}>
        {filtrados.length === 0 && <p>No hay clientes</p>}

        {filtrados.map((c) => (
          <div
            key={c.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <span>{c.nombre}</span>

            <Button variant="danger" onClick={() => eliminar(c.id)}>
              Eliminar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
