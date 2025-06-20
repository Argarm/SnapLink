import connectDB from '@/../lib/db';
import { Schema, models, model } from 'mongoose';
import validator from 'validator';

const UrlSchema = new Schema({
  shortId: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Url = models.Url || model('Url', UrlSchema);

export async function POST(req: Request) {
  await connectDB();
  const { url } = await req.json();

  if (!validator.isURL(url, { require_protocol: true })) {
    return new Response(JSON.stringify({ error: 'URL inválida' }), { status: 400 });
  }

  // Generar un shortId simple
  const shortId = Math.random().toString(36).substring(2, 8);
  // Guardar en la base de datos
  try {
    await Url.create({ shortId, originalUrl: url });
    return new Response(JSON.stringify({ shortId }), { status: 201 });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al acortar la URL' }), { status: 500 });
  }
}
