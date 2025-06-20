import connectDB from '@/../lib/db';
import { NextRequest } from 'next/server';
import { Schema, models, model } from 'mongoose';

const UrlSchema = new Schema({
  shortId: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Url = models.Url || model('Url', UrlSchema);

export async function GET(req: NextRequest, { params }: { params: { shortId: string } }) {
  await connectDB();
  const { shortId } = params;
  const urlDoc = await Url.findOne({ shortId });
  if (!urlDoc) {
    return new Response('URL no encontrada', { status: 404 });
  }
  // Redirigir a la URL original
  return Response.redirect(urlDoc.originalUrl, 302);
}
