"use server";

import { headers } from "next/headers";
import { createClient } from "./server";
import { redirect } from "next/navigation";

/**
 * Registra un nuevo usuario en Supabase.
 * @param formData FormData con email y password.
 * @returns Un objeto con error o redirige en caso de éxito.
 */
export type FormState =
  | {
      error?: string
      status?: number
      message?: string
      code?: string
    }
  | undefined
export async function signUp(
  state: FormState,
  {email, password, confirmPassword}: { email: string; password: string; confirmPassword: string }
) {
  const h = await headers();
  if (!email || !password || !confirmPassword) {
    console.log("Error: falta información");
    return { error: "Por favor, rellena todos los campos.", code: 'missing_fields' };
  }

  if (password !== confirmPassword) {
    console.log("Error: contraseñas no coinciden");
    return { error: "Las contraseñas no coinciden.", code: 'password_mismatch' };
  }
  const origin = h.get("origin");
  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback`,
    },
  });
  if (error) {
    console.log(error);
    return { error: error.message, status: error.status, code: error.code };
  }
  redirect(`${origin}/login`);
}
