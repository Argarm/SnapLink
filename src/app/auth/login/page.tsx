"use client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    setError("");
    alert("Login simulado exitoso!\nEmail: " + email);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center pt-16 px-4">
      <header className="w-full flex items-center justify-between p-4 absolute top-0 left-0 z-10">
        <div className="flex gap-2">
          <Link href="/">
            <span className="text-3xl font-extrabold text-blue-700 hover:underline cursor-pointer">
              SnapLink
            </span>
          </Link>
        </div>
        <div className="flex gap-2">
          <Link
            href="/auth/login"
            className="px-5 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/auth/register"
            className="px-5 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            Registrarse
          </Link>
        </div>
      </header>

      <div className="flex flex-col flex-grow w-full items-center">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl mt-24 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
            Iniciar sesión
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                className="block w-full border border-slate-300 rounded-lg px-3 py-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Tu email"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-slate-700">
                Contraseña
              </label>
              <input
                type="password"
                className="block w-full border border-slate-300 rounded-lg px-3 py-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Contraseña"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Iniciar sesión
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            ¿No tienes cuenta?{" "}
            <Link href="/auth/register">
              <span className="text-blue-600 hover:underline">Regístrate</span>
            </Link>
          </p>
        </div>
      </div>

      <footer className="w-full max-w-5xl mt-auto mb-8 text-center text-slate-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} SnapLink. Todos los derechos
          reservados.
        </p>
      </footer>
    </main>
  );
}
