"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="ml-2 px-5 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
    >
      Cerrar sesión
    </button>
  );
}
