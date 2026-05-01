import { supabase } from "./supabase";

export const obtenerEmpresaInfo = async () => {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) return null;

  // buscar empresa del usuario
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("empresa_id")
    .eq("user_id", user.id)
    .single();

  if (!usuario) return null;

  // traer empresa
  const { data: empresa } = await supabase
    .from("empresas")
    .select("*")
    .eq("id", usuario.empresa_id)
    .single();

  return empresa;
};