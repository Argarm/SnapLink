import connectDB from '@/../lib/db'
import URL from '@/../models/Url'

/**
 * Busca la URL original y actualiza el contador de clicks.
 * @param shortId string
 * @returns {Promise<string|null>} URL original o null si no existe
 */
export async function findAndTrackUrl(shortId: string): Promise<string | null> {
  await connectDB()
  const urlDoc = await URL.findOne({ shortCode: shortId }).lean() as { longUrl?: string }
  if (urlDoc && urlDoc.longUrl) {
    URL.updateOne({ shortCode: shortId }, { $inc: { clicks: 1 } }).catch(err => {
      console.error('Error updating click count:', err)
    })
    return urlDoc.longUrl
  }
  return null
}
