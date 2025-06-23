import { cookies } from 'next/headers';
import URL from '@/../models/Url';
import connectDB from '@/../lib/db';
import { getUserFromRequest } from '@/../lib/auth';

export const dynamic = 'force-dynamic';

export default async function UserLinksPage() {
  await connectDB();
  // Obtener usuario autenticado desde cookie
  const cookieStore = cookies();
  // cookieStore es ReadonlyRequestCookies, getAll() está disponible directamente
  // @ts-expect-error: getAll() puede no estar presente en algunas versiones, fallback a Array.from
  const allCookies = cookieStore.getAll ? cookieStore.getAll() : Array.from(cookieStore);
  const cookieHeader = allCookies.map((c: { name: string, value: string }) => `${c.name}=${encodeURIComponent(c.value)}`).join('; ');
  const req = { headers: { get: (k: string) => k === 'cookie' ? cookieHeader : undefined } } as unknown as Request;
  const user = getUserFromRequest(req);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow text-center">
        <h2 className="text-xl font-bold mb-2">Debes iniciar sesión para ver tus enlaces</h2>
      </div>
    );
  }

  // Buscar enlaces del usuario
  type UserLink = {
    _id: string;
    shortCode: string;
    longUrl: string;
    clicks: number;
    createdAt: Date;
  };
  const rawLinks = await URL.find({ user: user.userId }).sort({ createdAt: -1 }).lean();
  const links: UserLink[] = rawLinks.map((l) => ({
    _id: typeof l._id === 'object' && l._id !== null && 'toString' in l._id ? l._id.toString() : String(l._id),
    shortCode: l.shortCode,
    longUrl: l.longUrl,
    clicks: l.clicks,
    createdAt: l.createdAt
  }));

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl border border-blue-100">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700 flex items-center gap-2">
        <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>
        Tus enlaces acortados
      </h2>
      {links.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="w-16 h-16 text-blue-200 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" /></svg>
          <p className="text-gray-500 text-lg">Aún no has acortado ningún enlace.</p>
        </div>
      ) : (
        <ul className="divide-y divide-blue-100 bg-white rounded-xl shadow overflow-hidden">
          {links.map((link) => (
            <li key={link._id} className="group hover:bg-blue-50 transition px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex-1 min-w-0">
                <a
                  href={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://snap.link/'}${link.shortCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-blue-600 text-lg hover:underline break-all"
                >
                  {process.env.NEXT_PUBLIC_BASE_URL || 'https://snap.link/'}{link.shortCode}
                </a>
                <div className="text-xs text-gray-500 truncate mt-1">{link.longUrl}</div>
                <div className="text-xs text-gray-400 mt-1">Creado: {new Date(link.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" /></svg>
                  {link.clicks} clics
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
