import validator from 'validator'

/**
 * Valida si una URL es válida y contiene protocolo (http/https).
 * @param {string} url - La URL a validar.
 * @returns {boolean} true si es válida, false en caso contrario.
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  if (!validator.isURL(url, { require_protocol: true })) return false
  return true
}
