export type Role = 'admin' | 'owner' | 'manager' | 'cashier'
export interface User {
  email: string
  role: Role
}

export async function authenticate(email: string, _password: string): Promise<User | null> {
  void _password
  const e = email.toLowerCase().trim()
  const role: Role | null =
    e.includes('admin') ? 'admin' :
    e.includes('owner') ? 'owner' :
    e.includes('manager') ? 'manager' :
    e.includes('cashier') ? 'cashier' :
    null
  if (!role) return null
  return { email: e, role }
}

export function setSession(user: User) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('session', JSON.stringify(user))
    } catch {}
  }
}
