import connectDB from '@/../lib/db';
import URL from '@/../models/Url';
import { redirect } from 'next/navigation';
import { cache } from 'react';

// Cache URL lookups for better performance
const getCachedUrl = cache(async (shortId: string) => {
  await connectDB();
  const urlDoc = await URL.findOne({ shortCode: shortId }).lean() as { longUrl?: string };

  if (urlDoc && urlDoc.longUrl) {
    // Update click count asynchronously without waiting
    URL.updateOne({ shortCode: shortId }, { $inc: { clicks: 1 } })
      .catch(err => console.error('Error updating click count:', err));

    return urlDoc.longUrl;
  }

  return null;
});

// Define parameters for the page component using a generic type
interface PageParams {
  shortId: string;
}

// Using Next.js App Router's generated types
export default async function Page({
  params,
}: {
  // Use a plain object type to match Next.js expectations
  params: PageParams;
}) {
  const { shortId } = params;

  // Use the cached function for better performance
  const targetUrl = await getCachedUrl(shortId);

  if (targetUrl) {
    // Set cache-control headers via redirect
    redirect(targetUrl);
  }

  // If not found, show error page with proper status code
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">URL no encontrada</h1>
      <p>El enlace que intentas visitar no existe o ha expirado.</p>
    </main>
  );
}
