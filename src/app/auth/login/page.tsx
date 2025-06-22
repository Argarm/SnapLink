"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      setSuccess("");
      return;
    }
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error desconocido");
        setSuccess("");
      } else {
        setSuccess("¡Inicio de sesión exitoso!");
        setEmail("");
        setPassword("");
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Error de red o del servidor.");
      setSuccess("");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center pt-16 px-4">
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
            {success && <p className="text-green-600 text-sm">{success}</p>}
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
