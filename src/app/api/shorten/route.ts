import connectDB from '@/../lib/db';
import URL from '@/../models/Url';
import validator from 'validator';

// Optimized shortId generator with better collision handling
async function generateUniqueShortId() {
  const maxAttempts = 5; // Limit attempts to prevent infinite loops
  let attempts = 0;
  
  // Pre-generate shortIds for better performance
  const generateId = () => Math.random().toString(36).substring(2, 8);
  
  // Try to find a unique ID efficiently
  while (attempts < maxAttempts) {
    const shortId = generateId();
    
    // Check if it already exists (with lean query for performance)
    // Use a timeout to prevent long-running queries
    try {
      const existing = await Promise.race([
        URL.findOne({ shortCode: shortId }).lean().select('_id'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DB lookup timeout')), 1000)
        )
      ]);
      
      if (!existing) {
        return shortId;
      }
    } catch (err) {
      console.warn('ID lookup error, generating new one:', err);
      // On timeout, just try another ID
    }
    
    attempts++;
  }
  
  // In case of repeated collisions, use timestamp for uniqueness
  const timestamp = Date.now().toString(36).slice(-4);
  return generateId().substring(0, 4) + timestamp;
}

// Cache recently created URLs to avoid database hits
const urlCache = new Map();
const URL_CACHE_SIZE = 100; // Maximum cache size
const URL_CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export async function POST(req: Request) {
  try {
    // Start the database connection early while processing the request
    const connectPromise = connectDB();
    
    // Parse request body with timeout
    const bodyPromise = req.json().catch(err => {
      console.error('Error parsing request body:', err);
      throw new Error('Invalid request body');
    });
      // Wait for both operations to complete with a timeout
    const [, body] = await Promise.all([
      connectPromise,
      bodyPromise
    ]);
    
    const { url } = body;
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Validate URL format with proper error message
    if (!validator.isURL(url, { require_protocol: true })) {
      return new Response(
        JSON.stringify({ 
          error: 'URL inválida. Asegúrate de incluir el protocolo (http:// o https://)'
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Check cache first to avoid unnecessary DB operations
    const cacheKey = `orig-${url}`;
    if (urlCache.has(cacheKey)) {
      const shortCode = urlCache.get(cacheKey);
      return new Response(
        JSON.stringify({ shortCode, cached: true }), 
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Generate shortId with timeout protection
    const shortCodePromise = generateUniqueShortId();
    const shortCode = await Promise.race([
      shortCodePromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('ShortID generation timeout')), 2000)
      ) 
    ]);
    
    // Save to database with timeout protection
    await Promise.race([
      URL.create({ 
        shortCode, 
        longUrl: url,
        createdAt: new Date() 
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database operation timed out')), 5000)
      )
    ]);
    
    // Update cache - maintain cache size limit
    if (urlCache.size >= URL_CACHE_SIZE) {
      // Remove oldest entry
      const firstKey = urlCache.keys().next().value;
      urlCache.delete(firstKey);
    }
    urlCache.set(cacheKey, shortCode);
    setTimeout(() => urlCache.delete(cacheKey), URL_CACHE_TTL);
    
    return new Response(
      JSON.stringify({ shortCode }), 
      { 
        status: 201,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store' 
        }
      }
    );
  } catch (error) {
    console.error('Error shortening URL:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al acortar la URL. Por favor, intenta de nuevo.'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
