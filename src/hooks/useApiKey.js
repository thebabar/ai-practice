import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'anthropic_api_key'
const CHANGE_EVENT = 'anthropic_api_key_change'

function read() {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(STORAGE_KEY) || ''
}

export function useApiKey() {
  const [key, setKey] = useState(read)

  useEffect(() => {
    const sync = () => setKey(read())
    window.addEventListener(CHANGE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const saveKey = useCallback((newKey) => {
    const trimmed = (newKey || '').trim()
    if (trimmed) {
      window.localStorage.setItem(STORAGE_KEY, trimmed)
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  const clearKey = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  return { key, hasKey: !!key, saveKey, clearKey }
}
