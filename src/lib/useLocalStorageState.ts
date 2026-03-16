import { useEffect, useState } from 'react'

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        setValue(JSON.parse(raw) as T)
      }
    } catch {
      // ignore
    } finally {
      setInitialized(true)
    }
  }, [key])

  useEffect(() => {
    if (!initialized) return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value, initialized])

  return [value, setValue] as const
}

