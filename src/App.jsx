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

  // 🔒 componente protector
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/" />;
  };

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
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/productos"
          element={
            <PrivateRoute>
              <Layout>
                <Productos />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/ventas"
          element={
            <PrivateRoute>
              <Layout>
                <Ventas />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/compras"
          element={
            <PrivateRoute>
              <Layout>
                <Compras />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <Layout>
                <Clientes />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}