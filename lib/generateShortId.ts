import URL from '@/../models/Url'

/**
 * Genera un shortId único para URLs, con manejo de colisiones y fallback por timestamp.
 * @returns {Promise<string>} shortId único
 */
export async function generateUniqueShortId(): Promise<string> {
  const maxAttempts = 5
  let attempts = 0
  const generateId = () => Math.random().toString(36).substring(2, 8)

  while (attempts < maxAttempts) {
    const shortId = generateId()
    try {
      const existing = await Promise.race([
        URL.findOne({ shortCode: shortId }).lean().select('_id'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB lookup timeout')), 1000))
      ])
      if (!existing) return shortId
    } catch (err) {
      // On timeout, just try another ID
    }
    attempts++
  }
  // Fallback: timestamp para evitar colisiones
  const timestamp = Date.now().toString(36).slice(-4)
  return generateId().substring(0, 4) + timestamp
}
