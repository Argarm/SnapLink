import connectDB from '@/../lib/db';
import URL from '@/../models/Url';
import { NextRequest } from 'next/server';

// Cache for frequently accessed URLs (simple in-memory cache)
const urlCache = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export async function GET(
  _req: NextRequest,
  { params }: { params: { shortId: string } }
) {
  try {
    const { shortId } = params;

    // Check cache first for better performance
    const cacheKey = `url-${shortId}`;
    const cachedUrl = urlCache.get(cacheKey);

    if (cachedUrl) {
      // Return from cache with appropriate headers
      return Response.redirect(cachedUrl, 302);
    }

    // Start DB connection - we need it only if not found in cache
    await connectDB();    // Use lean query for better performance
    // Cast the result to avoid type errors
    const urlDoc = await URL.findOne({ shortCode: shortId })
      .lean() as { longUrl?: string };

    if (!urlDoc) {
      return new Response('URL no encontrada', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-store',
        },
      });
    }
    
    // Get URL from document
    const longUrl = urlDoc.longUrl;
    
    if (!longUrl) {
      return new Response('URL malformed', {
        status: 400,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-store',
        },
      });
    }

    // Update click count asynchronously (don't wait for it)
    URL.updateOne({ shortCode: shortId }, { $inc: { clicks: 1 } }).catch((err) =>
      console.error('Error updating click count:', err)
    );

    // Store in cache
    urlCache.set(cacheKey, longUrl);
    setTimeout(() => urlCache.delete(cacheKey), CACHE_TTL);

    // Redirect to the original URL with efficient headers
    return Response.redirect(longUrl, 302);
  } catch (error) {
    console.error('Error redirecting URL:', error);
    return new Response('Error al procesar la redirección', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store',
      },
    });
  }
}
