import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      return alert("Completá todos los campos");
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre_empresa: nombreEmpresa || "Mi Negocio",
        },
      },
    });

    if (error) {
      return alert(error.message);
    }

    alert("Cuenta creada. Revisá tu correo para confirmar.");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Registrarse</h1>

      <input
        type="text"
        placeholder="Nombre del negocio"
        value={nombreEmpresa}
        onChange={(e) => setNombreEmpresa(e.target.value)}
      />
      <br /><br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleRegister}>
        Crear cuenta
      </button>

      <br /><br />

      <p>¿Ya tenés cuenta?</p>
      <a href="/">Iniciar sesión</a>
    </div>
  );
}
