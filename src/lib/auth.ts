/** Token JWT stocké par le store (persist) et synchronisé dans localStorage. */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}
