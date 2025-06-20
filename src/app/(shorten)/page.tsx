'use client';

import { useState } from 'react';

export default function ShortenPage() {
  const [url, setUrl] = useState('');
  const [shortId, setShortId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortId('');
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.ok) {
        setShortId(data.shortId);
      } else {
        setError(data.error || 'Error al acortar la URL');
      }
    } catch (err) {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Acortador de URLs</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="url"
          className="border p-2 rounded"
          placeholder="Pega tu URL aquí..."
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Acortando...' : 'Acortar URL'}
        </button>
      </form>
      {shortId && (
        <div className="mt-4 p-2 bg-green-100 rounded">
          <span>Tu URL corta: </span>
          <a
            href={`/${shortId}`}
            className="text-blue-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {`${process.env.NEXT_PUBLIC_BASE_DOMAIN || 'http://localhost:3000'}/${shortId}`}
          </a>
        </div>
      )}
      {error && <div className="mt-4 p-2 bg-red-100 rounded text-red-700">{error}</div>}
    </main>
  );
}
