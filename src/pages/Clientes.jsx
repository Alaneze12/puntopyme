import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { obtenerEmpresa } from "../lib/empresa";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [empresaId, setEmpresaId] = useState(null);

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
      return;
    }

    setClientes(data || []);
  };

  const agregar = async () => {
    if (!nombre) return;

    const { error } = await supabase
      .from("clientes")
      .insert([
        {
          nombre,
          empresa_id: empresaId,
        },
      ]);

    if (error) {
      console.error(error);
      return;
    }

    setNombre("");
    cargar(empresaId);
  };

  if (empresaId === null) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Clientes</h1>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre cliente"
      />
      <button onClick={agregar}>Agregar</button>

      {clientes.map((c) => (
        <div key={c.id}>{c.nombre}</div>
      ))}
    </div>
  );
}
