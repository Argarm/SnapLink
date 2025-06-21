/**
 * Helper para crear respuestas de error estandarizadas en rutas API Next.js
 * @param status Código de estado HTTP
 * @param message Mensaje de error
 * @returns Response con JSON y headers adecuados
 */
export function errorResponse(status: number, message: string) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
