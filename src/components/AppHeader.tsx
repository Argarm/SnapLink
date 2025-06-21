import Link from "next/link";

export default function AppHeader() {
  return (
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
  );
}
