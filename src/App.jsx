import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

// páginas
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import Compras from "./pages/Compras";
import Clientes from "./pages/Clientes";
import HistorialVentas from "./pages/HistorialVentas";
import HistorialCompras from "./pages/HistorialCompras";
import Stock from "./pages/Stock";

// layout
import Layout from "./components/Layout";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <p>Cargando...</p>;

  // 🔒 PROTECTOR
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/" />;
  };

  // 🔥 ENVOLVER TODO CON LAYOUT (evita repetir código)
  const AppLayout = ({ children }) => (
    <PrivateRoute>
      <Layout>{children}</Layout>
    </PrivateRoute>
  );

  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 PUBLICAS */}
        <Route
          path="/"
          element={user ? <Navigate to="/app" /> : <Login />}
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/app" /> : <Register />}
        />

        {/* 🔒 PRIVADAS */}
        <Route path="/app" element={<AppLayout><Dashboard /></AppLayout>} />

        <Route path="/productos" element={<AppLayout><Productos /></AppLayout>} />

        <Route path="/ventas" element={<AppLayout><Ventas /></AppLayout>} />

        <Route path="/compras" element={<AppLayout><Compras /></AppLayout>} />

        <Route path="/clientes" element={<AppLayout><Clientes /></AppLayout>} />

        {/* 🔥 NUEVAS */}
        <Route path="/historial" element={<AppLayout><HistorialVentas /></AppLayout>} />

        <Route path="/historial-compras" element={<AppLayout><HistorialCompras /></AppLayout>} />

        <Route path="/stock" element={<AppLayout><Stock /></AppLayout>} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}