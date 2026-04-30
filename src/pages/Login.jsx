import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return alert(error.message);
    }

    const user = data.user;

    if (!user) {
      return alert("No se pudo iniciar sesión");
    }

    // bloquear si no confirmó mail
    if (!user.email_confirmed_at) {
      await supabase.auth.signOut();
      return alert("Debés confirmar tu correo antes de ingresar.");
    }

    // verificar si ya existe en usuarios
    const { data: existe } = await supabase
      .from("usuarios")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!existe) {
      const nombreEmpresa =
        user.user_metadata?.nombre_empresa || "Mi Negocio";

      const { data: empresa, error: errEmpresa } = await supabase
        .from("empresas")
        .insert([{ nombre: nombreEmpresa }])
        .select()
        .single();

      if (errEmpresa) {
        console.error(errEmpresa);
        return alert("Error creando empresa");
      }

      const { error: errUser } = await supabase
        .from("usuarios")
        .insert([
          {
            user_id: user.id,
            empresa_id: empresa.id,
            rol: "admin",
          },
        ]);

      if (errUser) {
        console.error(errUser);
        return alert("Error creando usuario");
      }
    }

    window.location.href = "/app";
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Iniciar sesión</h1>

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

      <button onClick={handleLogin}>Ingresar</button>

      <br /><br />

      <p>No tenés cuenta?</p>
      <a href="/register">Registrate</a>
    </div>
  );
}
