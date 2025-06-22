import { NextResponse } from 'next/server';

const COOKIE_NAME = 'snaplink_token';

export async function POST() {
  // Elimina la cookie JWT
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // Expira inmediatamente
  });
  return response;
}
