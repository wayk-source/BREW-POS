import type { Role, User } from '../../lib/auth'

export function getSession(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('session')
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function getSessionRole(): Role | null {
  const s = getSession()
  return s?.role ?? null
}

