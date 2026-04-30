import { supabase } from "./supabase";

export const obtenerEmpresa = async () => {
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user) {
    console.error(userError);
    return null;
  }

  const userId = userData.user.id;

  const { data, error } = await supabase
    .from("usuarios")
    .select("empresa_id")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data?.empresa_id || null;
};
