import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) return;

    setEmail(user.email);

    // 🔥 buscar empresa
    const { data: usuario } = await supabase
      .from("usuarios")
      .select("empresa_id")
      .eq("user_id", user.id)
      .single();

    if (!usuario) return;

    const { data: emp } = await supabase
      .from("empresas")
      .select("nombre")
      .eq("id", usuario.empresa_id)
      .single();

    if (emp) {
      setEmpresa(emp.nombre);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div style={container}>
      <Sidebar />

      <div style={main}>
        {/* HEADER PREMIUM */}
        <div style={header}>
          <div>
            <h2 style={{ margin: 0 }}>
              {empresa || "PuntoPyme"}
            </h2>

            <span style={sub}>
              Panel de control
            </span>
          </div>

          <div style={userBox}>
            <span style={emailText}>
              {email}
            </span>

            <button style={logoutBtn} onClick={logout}>
              Salir
            </button>
          </div>
        </div>

        {/* CONTENIDO */}
        <div style={content}>{children}</div>
      </div>
    </div>
  );
}

/* 🎨 ESTILOS PREMIUM */

const container = {
  display: "flex",
  height: "100vh",
  fontFamily: "Inter, Arial, sans-serif",
  background: "#f4f6f8"
};

const main = {
  flex: 1,
  display: "flex",
  flexDirection: "column"
};

const header = {
  background: "#fff",
  padding: "15px 25px",
  borderBottom: "1px solid #eee",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};

const sub = {
  fontSize: 12,
  color: "#888"
};

const userBox = {
  display: "flex",
  alignItems: "center",
  gap: 12
};

const emailText = {
  fontSize: 13,
  color: "#666"
};

const logoutBtn = {
  padding: "7px 12px",
  border: "none",
  borderRadius: 8,
  background: "#ff4d4f",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 500
};

const content = {
  flex: 1,
  padding: 25,
  overflowY: "auto"
};