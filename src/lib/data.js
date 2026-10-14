export const CEBU = [10.3157, 123.8854]
export const CARRIERS = ['Smart', 'Globe', 'DITO']
const P = [
  ['Fuente Osmeña', 10.3111, 123.8915, -82, 160], ['Cebu Business Park', 10.3187, 123.9050, -74, 185], ['IT Park', 10.3306, 123.9060, -88, 92],
  ['Guadalupe', 10.3202, 123.8683, -106, 28], ['Busay', 10.3650, 123.8800, -121, 3], ['Colon', 10.2960, 123.9020, -90, 75],
  ['SM Seaside', 10.2825, 123.8800, -80, 140], ['Mactan Airport', 10.3075, 123.9794, -86, 110], ['Lahug', 10.3300, 123.8993, -95, 55],
]
export const SEED = P.flatMap(([name, lat, lng, rsrp, down], i) =>
  CARRIERS.map((c, j) => ({
    id: `s${i}${j}`, seed: true, place: name, lat: lat + (j - 1) * 0.0006, lng: lng + (j - 1) * 0.0007, carrier: c,
    tech: down > 100 ? '5G' : '4G', rsrp: rsrp - j * 3 + (i % 2) * 2, down: Math.round(down * (1 - j * 0.18)),
    up: Math.round(down * 0.25 * (1 - j * 0.15)), latency: 15 + j * 6 + i, ts: Date.now() - (i * 7 + j * 3 + 2) * 60000, env: 'outdoor',
  })))
export const BADGES = [
  { key: 'b_jeepney', need: 1, bg: '#ffd36b' }, { key: 'b_sampaguita', need: 5, bg: '#d2e4ff' }, { key: 'b_parol', need: 10, bg: '#ffb4ab' },
  { key: 'b_bangka', need: 25, bg: '#a7f3d0' }, { key: 'b_sinulog', need: 50, bg: '#ddd6fe' }, { key: 'b_bayani', need: 100, bg: '#fde68a' },
]
export const levelOf = (n) => 1 + Math.floor(n / 5)
