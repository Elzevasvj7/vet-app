"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUp } from "@/app/utils/supabase/actions";

enum ErrorsCode {
 MISSING_FIELDS = 'missing_fields',
 PASSWORD_MISMATCH = 'password_mismatch',
 WEAK_PASSWORD = 'weak_password',
 USER_ALREADY_EXISTS = 'user_already_exists',
}
 enum ErrorMessages {
  MISSING_FIELDS = 'Falta información',
  PASSWORD_MISMATCH = 'Las contraseñas no coinciden',
  WEAK_PASSWORD = 'La contraseña es muy débil',
  USER_ALREADY_EXISTS = 'El usuario ya existe',
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, action, pending] = useActionState(signUp, undefined);
  const handlerAction = async () => {
    action({ email, password, confirmPassword });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-md">
        <h3 className="text-2xl font-bold text-center">Registrarse</h3>
        <form action={handlerAction} className="mt-4">
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                placeholder="Tu email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Tu contraseña"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="confirmPassword">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                placeholder="Confirma tu contraseña"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                id="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button
                type="submit"
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                disabled={pending}
              >
                {pending ? "Registrando..." : "Registrarse"}
              </button>
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:underline"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </div>
            {state?.code && (
              <div className="mt-4 text-center">
                {state.code === ErrorsCode.MISSING_FIELDS && <span className="text-sm text-red-500">{ErrorMessages.MISSING_FIELDS}</span>}
                {state.code === ErrorsCode.PASSWORD_MISMATCH && <span className="text-sm text-red-500">{ErrorMessages.PASSWORD_MISMATCH}</span>}
                {state.code === ErrorsCode.WEAK_PASSWORD && <span className="text-sm text-red-500">{ErrorMessages.WEAK_PASSWORD}</span>}
                {state.code === ErrorsCode.USER_ALREADY_EXISTS && <span className="text-sm text-red-500">{ErrorMessages.USER_ALREADY_EXISTS}</span>}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
