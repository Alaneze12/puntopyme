import { useState } from "react";
import { supabase } from "../lib/supabase";
import { input, card } from "../components/ui";
import Button from "../components/Button";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (loading) return;

    if (!email || !password) {
      return alert("Completá todos los campos");
    }

    if (password.length < 6) {
      return alert("La contraseña debe tener al menos 6 caracteres");
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre_empresa: nombreEmpresa || "Mi Negocio",
        },
        emailRedirectTo: window.location.origin, // 🔥 vuelve al login
      },
    });

    if (error) {
      setLoading(false);
      return alert(error.message);
    }

    alert("Cuenta creada. Revisá tu correo para confirmar.");

    window.location.href = "/";
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f6f8",
      }}
    >
      <div style={{ ...card, width: 350 }}>
        <h1 style={{ marginBottom: 20 }}>Crear cuenta</h1>

        <input
          style={{ ...input, width: "100%", marginBottom: 10 }}
          type="text"
          placeholder="Nombre del negocio"
          value={nombreEmpresa}
          onChange={(e) => setNombreEmpresa(e.target.value)}
        />

        <input
          style={{ ...input, width: "100%", marginBottom: 10 }}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={{ ...input, width: "100%", marginBottom: 20 }}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleRegister} disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>

        <p style={{ marginTop: 15, fontSize: 14 }}>
          ¿Ya tenés cuenta?{" "}
          <a href="/">Iniciar sesión</a>
        </p>
      </div>
    </div>
  );
}