import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import Button from "./Button";

export default function Sidebar() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      setEmail(data.user?.email || "");
      setEmpresa(
        data.user?.user_metadata?.nombre_empresa || "Mi Negocio"
      );
    };

    getUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const active = (path) =>
    location.pathname === path ? activeLink : link;

  return (
    <div style={container}>
      {/* HEADER */}
      <div>
        <h2 style={logo}>PuntoPyme</h2>

        <p style={empresaStyle}>{empresa}</p>

        <nav style={nav}>
          <Link to="/app" style={active("/app")}>Dashboard</Link>
          <Link to="/productos" style={active("/productos")}>Productos</Link>
          <Link to="/ventas" style={active("/ventas")}>Ventas</Link>
          <Link to="/compras" style={active("/compras")}>Compras</Link>
          <Link to="/clientes" style={active("/clientes")}>Clientes</Link>
        </nav>
      </div>

      {/* FOOTER */}
      <div>
        <p style={emailStyle}>{email}</p>

        <Button variant="danger" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}

/* ESTILOS */

const container = {
  width: 260,
  height: "100vh",
  background: "linear-gradient(180deg, #1e1e2f, #151521)",
  color: "#fff",
  padding: 20,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRight: "1px solid rgba(255,255,255,0.05)",
};

const logo = {
  marginBottom: 5,
  fontWeight: 700,
};

const empresaStyle = {
  fontSize: 13,
  opacity: 0.7,
  marginBottom: 20,
};

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const link = {
  color: "#fff",
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.04)",
  transition: "all 0.2s ease",
};

const activeLink = {
  ...link,
  background: "linear-gradient(135deg, #5f66ff, #7c83ff)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const emailStyle = {
  fontSize: 12,
  opacity: 0.6,
  marginBottom: 10,
};