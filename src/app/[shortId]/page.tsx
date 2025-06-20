import connectDB from '@/../lib/db';
import { Schema, models, model } from 'mongoose';
import { redirect } from 'next/navigation';

const UrlSchema = new Schema({
  shortId: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Url = models.Url || model('Url', UrlSchema);

export default async function Page(props: { params: Promise<{ shortId: string }> }) {
  const { shortId } = await props.params;
  await connectDB();
  const urlDoc = await Url.findOne({ shortId });
  if (urlDoc && urlDoc.originalUrl) {
    redirect(urlDoc.originalUrl);
  }
  // Si no se encuentra, puedes mostrar un mensaje de error personalizado
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">URL no encontrada</h1>
      <p>El enlace que intentas visitar no existe o ha expirado.</p>
    </main>
  );
}
