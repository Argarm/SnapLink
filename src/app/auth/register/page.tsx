"use client";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError("");
    alert("Registro simulado exitoso!\nEmail: " + email);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">Regístrate</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Contraseña</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Confirmar contraseña</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Registrarse
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login">
              <span className="text-blue-600 hover:underline">Inicia sesión</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
