import { useState } from "react";
import { supabase } from "../lib/supabase";
import { input, card } from "../components/ui";
import Button from "../components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!email || !password) {
      return alert("Completá todos los campos");
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      return alert(error.message);
    }

    const user = data.user;

    if (!user) {
      setLoading(false);
      return alert("No se pudo iniciar sesión");
    }

    // 🚫 bloquear si no confirmó mail
    if (!user.email_confirmed_at) {
      await supabase.auth.signOut();
      setLoading(false);
      return alert("Debés confirmar tu correo antes de ingresar.");
    }

    try {
      // 🔍 buscar usuario
      const { data: existe } = await supabase
        .from("usuarios")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existe) {
        const nombreEmpresa =
          user.user_metadata?.nombre_empresa || "Mi Negocio";

        // 🏢 crear empresa
        const { data: empresa, error: errEmpresa } = await supabase
          .from("empresas")
          .insert([{ nombre: nombreEmpresa }])
          .select()
          .single();

        if (errEmpresa) throw errEmpresa;

        // 👤 crear usuario
        const { error: errUser } = await supabase
          .from("usuarios")
          .insert([
            {
              user_id: user.id,
              empresa_id: empresa.id,
              rol: "admin",
            },
          ]);

        if (errUser) throw errUser;
      }

      window.location.href = "/app";
    } catch (err) {
      console.error(err);
      alert("Error inicializando la cuenta");
    }

    setLoading(false);
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
        <h1 style={{ marginBottom: 20 }}>PuntoPyme</h1>

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

        <Button onClick={handleLogin} disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </Button>

        <p style={{ marginTop: 15, fontSize: 14 }}>
          ¿No tenés cuenta?{" "}
          <a href="/register">Registrate</a>
        </p>
      </div>
    </div>
  );
}