import AppHeaderClient from "./AppHeaderClient";
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
  return <AppHeaderClient email={user?.email as string | undefined} />;
}
