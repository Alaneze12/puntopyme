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

        {/* Avatar empresa */}
        <div style={avatar}>
          {empresa.charAt(0).toUpperCase()}
        </div>

        <p style={empresaStyle}>{empresa}</p>

        <nav style={nav}>
          {/* DASHBOARD */}
          <Link
            to="/app"
            style={active("/app")}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            📊 Dashboard
          </Link>

          {/* GESTIÓN */}
          <p style={section}>GESTIÓN</p>

          <Link
            to="/productos"
            style={active("/productos")}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            📦 Productos
          </Link>

          <Link
            to="/stock"
            style={active("/stock")}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            📊 Stock
          </Link>

          <Link
            to="/clientes"
            style={active("/clientes")}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            👤 Clientes
          </Link>

          {/* MOVIMIENTOS */}
          <p style={section}>MOVIMIENTOS</p>

          <Link
            to="/ventas"
            style={active("/ventas")}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            💰 Ventas
          </Link>

          <Link
            to="/compras"
            style={active("/compras")}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            🛒 Compras
          </Link>

          <Link
            to="/historial"
            style={active("/historial")}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            📜 Historial Ventas
          </Link>

          <Link
            to="/historial-compras"
            style={active("/historial-compras")}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            📑 Historial Compras
          </Link>
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

/* FUNCIONES HOVER */

const hoverIn = (e) => {
  e.target.style.opacity = 0.8;
};

const hoverOut = (e) => {
  e.target.style.opacity = 1;
};

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
  marginBottom: 10,
  fontWeight: 700,
};

const avatar = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #5f66ff, #7c83ff)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 8,
  fontWeight: "bold",
};

const empresaStyle = {
  fontSize: 13,
  opacity: 0.7,
  marginBottom: 20,
};

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const section = {
  fontSize: 11,
  opacity: 0.5,
  marginTop: 12,
  marginBottom: 4,
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