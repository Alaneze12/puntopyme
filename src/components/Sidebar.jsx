import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email || "");
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
      <div>
        <h2 style={{ marginBottom: 20 }}>PuntoPyme</h2>

        <nav style={nav}>
          <Link to="/app" style={active("/app")}>Dashboard</Link>
          <Link to="/productos" style={active("/productos")}>Productos</Link>
          <Link to="/ventas" style={active("/ventas")}>Ventas</Link>
          <Link to="/compras" style={active("/compras")}>Compras</Link>
          <Link to="/clientes" style={active("/clientes")}>Clientes</Link>
        </nav>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: "auto" }}>
        <p style={{ fontSize: 12, opacity: 0.7 }}>
          {email}
        </p>

        <button style={logoutBtn} onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

/* ESTILOS */

const container = {
  width: 240,
  height: "100vh",
  background: "#1e1e2f",
  color: "#fff",
  padding: 20,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
};

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: 12
};

const link = {
  color: "#fff",
  textDecoration: "none",
  padding: "10px",
  borderRadius: "6px",
  background: "rgba(255,255,255,0.05)",
  transition: "0.2s"
};

const activeLink = {
  ...link,
  background: "#6c5ce7"
};

const logoutBtn = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  border: "none",
  borderRadius: 6,
  background: "#ff4d4f",
  color: "#fff",
  cursor: "pointer"
};