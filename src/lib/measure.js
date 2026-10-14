import { CEBU, SEED } from './data.js'

export const quality = (d) => (d >= -85 ? 'excellent' : d >= -99 ? 'good' : d >= -115 ? 'weak' : 'none')
export const Q_COLOR = { excellent: '#10b981', good: '#f59e0b', weak: '#ba1a1a', none: '#867461' }

export function km(a, b) {
  const R = 6371, r = (x) => (x * Math.PI) / 180
  const dLat = r(b[0] - a[0]), dLng = r(b[1] - a[1])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export const ago = (ts, t) => {
  const m = Math.round((Date.now() - ts) / 60000)
  return m < 1 ? t('just_now') : m < 60 ? t('min_ago', { n: m }) : m < 1440 ? t('h_ago', { n: Math.round(m / 60) }) : t('d_ago', { n: Math.round(m / 1440) })
}

export const getPos = () =>
  new Promise((res) => {
    if (!navigator.geolocation) return res(null)
    navigator.geolocation.getCurrentPosition((p) => res([p.coords.latitude, p.coords.longitude]), () => res(null), { enableHighAccuracy: true, timeout: 8000 })
  })

const CF = 'https://speed.cloudflare.com'
async function f(url, opt = {}) {
  const c = new AbortController()
  const id = setTimeout(() => c.abort(), 12000)
  try { return await fetch(url, { cache: 'no-store', ...opt, signal: c.signal }) } finally { clearTimeout(id) }
}

export async function ping(n = 5) {
  const ts = []
  for (let i = 0; i < n; i++) {
    const t0 = performance.now()
    try { await f(`${CF}/__down?bytes=0&r=${Math.random()}`); ts.push(performance.now() - t0) } catch { /* offline */ }
  }
  if (!ts.length) return null
  const latency = Math.round(ts.reduce((a, b) => a + b, 0) / ts.length)
  const jitter = ts.length > 1 ? Math.round(ts.slice(1).reduce((a, b, i) => a + Math.abs(b - ts[i]), 0) / (ts.length - 1)) : 0
  return { latency, jitter }
}

async function speed(dir) {
  try {
    const t0 = performance.now()
    let bytes
    if (dir === 'down') { bytes = 4e6; await (await f(`${CF}/__down?bytes=${bytes}`)).arrayBuffer() }
    else { bytes = 1.5e6; await f(`${CF}/__up`, { method: 'POST', body: new Blob([new Uint8Array(bytes)]) }) }
    return (bytes * 8) / 1e6 / ((performance.now() - t0) / 1000)
  } catch { return null }
}

const rnd = (a, b) => a + Math.random() * (b - a)

export async function scan(step = () => {}) {
  step('loc'); const pos = await getPos()
  step('ping'); const p = await ping(5)
  step('down'); const down = await speed('down')
  step('up'); const up = await speed('up')
  const simulated = !p || down == null
  const d = down ?? rnd(40, 180)
  const [lat, lng] = pos || CEBU
  const near = SEED.map((s) => [km([lat, lng], [s.lat, s.lng]), s.place]).sort((a, b) => a[0] - b[0])[0]
  return {
    id: 'r' + Date.now(), ts: Date.now(), lat, lng, located: !!pos, place: near && near[0] < 3 ? near[1] : null,
    rsrp: Math.round(-118 + (Math.min(d, 300) / 300) * 45), down: +d.toFixed(1), up: +(up ?? d * 0.3).toFixed(1),
    latency: p?.latency ?? Math.round(rnd(18, 45)), jitter: p?.jitter ?? Math.round(rnd(1, 6)),
    tech: d >= 100 ? '5G' : '4G', net: navigator.connection?.effectiveType || null, simulated,
  }
}
