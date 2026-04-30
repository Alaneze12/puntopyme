import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
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

  return (
    <div style={container}>
      <Sidebar />

      <div style={main}>
        {/* HEADER */}
        <div style={header}>
          <div>
            <h2 style={{ margin: 0 }}>Panel de control</h2>
          </div>

          <div style={userBox}>
            <span style={{ fontSize: 13, opacity: 0.7 }}>
              {email}
            </span>

            <button style={logoutBtn} onClick={logout}>
              Salir
            </button>
          </div>
        </div>

        {/* CONTENIDO */}
        <div style={content}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ESTILOS */

const container = {
  display: "flex",
  height: "100vh",
  fontFamily: "Arial, sans-serif"
};

const main = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  background: "#f4f6f8"
};

const header = {
  background: "#fff",
  padding: "15px 25px",
  borderBottom: "1px solid #ddd",
  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const userBox = {
  display: "flex",
  alignItems: "center",
  gap: 10
};

const logoutBtn = {
  padding: "6px 10px",
  border: "none",
  borderRadius: 6,
  background: "#ff4d4f",
  color: "#fff",
  cursor: "pointer"
};

const content = {
  flex: 1,
  padding: 25,
  overflowY: "auto"
};