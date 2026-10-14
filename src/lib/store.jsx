import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { DICT } from './i18n.js'

const Ctx = createContext(null)
const KEY = 'kuha-state-v1'
const DEFAULTS = { lang: 'en', carrier: 'Smart', fuzz: true, liveMs: 4000, user: null, readings: [], last: null }

export function AppProvider({ children }) {
  const [s, setS] = useState(() => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return DEFAULTS }
  })
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* ignore */ } }, [s])
  const set = useCallback((p) => setS((o) => ({ ...o, ...(typeof p === 'function' ? p(o) : p) })), [])
  const t = useCallback((k, v) => {
    let x = (DICT[s.lang] || DICT.en)[k] ?? DICT.en[k] ?? k
    if (v) for (const a in v) x = x.replace(`{${a}}`, v[a])
    return x
  }, [s.lang])
  const who = s.user?.email || 'guest'
  const addReading = (r) => set((o) => {
    const q = (x) => (o.fuzz ? Math.round(x * 2000) / 2000 : x)
    return { readings: [...o.readings, { ...r, lat: q(r.lat), lng: q(r.lng), by: who }] }
  })
  const value = {
    ...s, set, t, mine: s.readings.filter((r) => r.by === who), addReading,
    login: (name, email) => set({ user: { name, email: email.toLowerCase() } }),
    logout: () => set({ user: null }),
    clearMine: () => set((o) => ({ readings: o.readings.filter((r) => r.by !== who) })),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useApp = () => useContext(Ctx)
