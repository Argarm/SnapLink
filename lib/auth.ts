import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'snaplink_dev_secret';
const COOKIE_NAME = 'snaplink_token';

export function getUserFromRequest(req: Request): null | { userId: string, email: string } {
  try {
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) return null;
    const cookies = Object.fromEntries(cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, decodeURIComponent(v.join('='))];
    }));
    const token = cookies[COOKIE_NAME];
    if (!token) return null;
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (typeof payload === 'object' && payload.userId && payload.email) {
      return { userId: payload.userId as string, email: payload.email as string };
    }
    return null;
  } catch {
    return null;
  }
}
