import Link from "next/link";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'snaplink_dev_secret';
const COOKIE_NAME = 'snaplink_token';

async function getUserFromCookie(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (typeof payload === 'object' && payload && 'email' in payload) {
      return payload as JwtPayload;
    }
    return null;
  } catch {
    return null;
  }
}

// No "use client" aquí: Server Component
export default async function AppHeader() {
  const user = await getUserFromCookie();
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
        {!user && (
          <>
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
          </>
        )}
        {user && (
          <>
            <span className="px-5 py-2 rounded bg-gray-100 text-blue-700 font-semibold">
              {user.email as string}
            </span>
            <form
              action="/api/logout"
              method="POST"
              className="inline"
              style={{ display: 'inline' }}
            >
              <button
                type="submit"
                className="ml-2 px-5 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              >
                Cerrar sesión
              </button>
            </form>
          </>
        )}
      </div>
    </header>
  );
}
