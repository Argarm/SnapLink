import connectDB from '@/../lib/db';
import URL from '@/../models/Url';
import { NextRequest } from 'next/server';
import { errorResponse } from '@/../lib/errorResponse';
import { SimpleCache } from '@/../lib/cache';
import { findAndTrackUrl } from '@/../lib/urlLookup';

// Cache for frequently accessed URLs (simple in-memory cache)
const urlCache = new SimpleCache<string, string>(100, 1000 * 60 * 5); // 5 minutes

// Use any type for params to bypass TypeScript errors during build
export async function GET(
  _req: NextRequest,
  { params }: any
) {
  try {
    const { shortId } = params;

    // Check cache first for better performance
    const cacheKey = `url-${shortId}`;
    const cachedUrl = urlCache.get(cacheKey);
    if (cachedUrl) {
      return Response.redirect(cachedUrl, 302);
    }

    // Start DB connection - we need it only if not found in cache
    const longUrl = await findAndTrackUrl(shortId)
    if (!longUrl) {
      return errorResponse(404, 'URL no encontrada')
    }
    urlCache.set(cacheKey, longUrl)
    return Response.redirect(longUrl, 302);
  } catch (error) {
    console.error('Error redirecting URL:', error)
    return errorResponse(500, 'Error al procesar la redirección')
  }
}
