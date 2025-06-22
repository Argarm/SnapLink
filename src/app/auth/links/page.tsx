import { cookies } from 'next/headers';
import URL from '@/../models/Url';
import connectDB from '@/../lib/db';
import { getUserFromRequest } from '@/../lib/auth';

export const dynamic = 'force-dynamic';

export default async function UserLinksPage() {
  await connectDB();
  // Obtener usuario autenticado desde cookie
  const cookieHeader = cookies().toString();
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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Tus enlaces acortados</h2>
      {links.length === 0 ? (
        <p className="text-gray-500">Aún no has acortado ningún enlace.</p>
      ) : (
        <ul className="space-y-4">
          {links.map((link) => (
            <li key={link._id} className="border-b pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="font-mono text-blue-600">{process.env.NEXT_PUBLIC_BASE_URL || 'https://snap.link/'}{link.shortCode}</span>
                  <div className="text-xs text-gray-500 truncate">{link.longUrl}</div>
                </div>
                <div className="mt-2 md:mt-0 text-sm text-gray-700">Clics: {link.clicks}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
