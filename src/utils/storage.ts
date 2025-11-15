const getBrowserStorage = (
  type: 'localStorage' | 'sessionStorage'
): Storage | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window[type]
  } catch {
    return null
  }
}

const localStore = getBrowserStorage('localStorage')
const sessionStore = getBrowserStorage('sessionStorage')

const get = (key: string): string | null => {
  const localValue = localStore?.getItem(key)
  if (localValue !== null && localValue !== undefined) {
    return localValue
  }
  return sessionStore?.getItem(key) ?? null
}

const set = (key: string, value: string) => {
  localStore?.setItem(key, value)
  sessionStore?.setItem(key, value)
}

const remove = (key: string) => {
  localStore?.removeItem(key)
  sessionStore?.removeItem(key)
}

const getJSON = <T>(key: string): T | null => {
  const value = get(key)
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

const setJSON = (key: string, value: unknown) => {
  set(key, JSON.stringify(value))
}

const clearKeys = (keys: string[]) => {
  keys.forEach(remove)
}

export const storage = {
  get,
  set,
  remove,
  getJSON,
  setJSON,
  clearKeys
}

