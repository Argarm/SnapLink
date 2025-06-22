import connectDB from '@/../lib/db';
import URL from '@/../models/Url';
import { isValidUrl } from '@/../lib/validateUrl';
import { errorResponse } from '@/../lib/errorResponse';
import { SimpleCache } from '@/../lib/cache';
import { generateUniqueShortId } from '@/../lib/generateShortId';
import { getUserFromRequest } from '@/../lib/auth';

// Cache recently created URLs to avoid database hits
const URL_CACHE_SIZE = 100; // Maximum cache size
const URL_CACHE_TTL = 1000 * 60 * 5; // 5 minutes
const urlCache = new SimpleCache<string, string>(URL_CACHE_SIZE, URL_CACHE_TTL);

interface ShortenRequestBody {
  url: string
}

interface ShortenResponse {
  shortCode: string
  cached?: boolean
  error?: string
}

export async function POST(req: Request): Promise<Response> {
  try {
    // Start the database connection early while processing the request
    const connectPromise = connectDB();
    
    // Parse request body with timeout
    const bodyPromise = req.json() as Promise<ShortenRequestBody>;
    
    // Wait for both operations to complete with a timeout
    const [, bodyData] = await Promise.all([
      connectPromise,
      bodyPromise
    ]);
    
    const { url } = bodyData;
    
    if (!url) {
      return errorResponse(400, 'URL is required');
    }
    
    // Validate URL format with proper error message
    if (!isValidUrl(url)) {
      return errorResponse(400, 'URL inválida. Asegúrate de incluir el protocolo (http:// o https://)');
    }
    
    // Check cache first to avoid unnecessary DB operations
    const cacheKey = `orig-${url}`;
    if (urlCache.has(cacheKey)) {
      const shortCode = urlCache.get(cacheKey) as string;
      return new Response(
        JSON.stringify({ shortCode, cached: true } as ShortenResponse),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Generate shortId with timeout protection
    const shortCodePromise = generateUniqueShortId();
    const shortCode = await Promise.race([
      shortCodePromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('ShortID generation timeout')), 2000)
      ) 
    ]) as string;
    
    // Obtener usuario autenticado (si existe)
    const userPayload = getUserFromRequest(req);
    // Save to database with timeout protection
    await Promise.race([
      URL.create({ 
        shortCode, 
        longUrl: url,
        createdAt: new Date(),
        user: userPayload && userPayload.userId ? userPayload.userId : undefined
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database operation timed out')), 5000)
      )
    ]);
    
    // Update cache - maintain cache size limit
    urlCache.set(cacheKey, shortCode);
    
    return new Response(
      JSON.stringify({ shortCode } as ShortenResponse),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    )
  } catch (error) {
    console.error('Error shortening URL:', error);
    return errorResponse(500, 'Error al acortar la URL. Por favor, intenta de nuevo.');
  }
}
