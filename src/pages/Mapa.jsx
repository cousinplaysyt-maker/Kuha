import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Icon from '../components/Icon.jsx'
import tarsee from '../assets/tarsee.svg'
import { useApp } from '../lib/store.jsx'
import { CEBU, CARRIERS, SEED } from '../lib/data.js'
import { quality, Q_COLOR, km, ago, getPos } from '../lib/measure.js'

const CC = { Smart: 'bg-secondary', Globe: 'bg-primary-container', DITO: 'bg-tertiary' }
const avg = (a, k) => (a.length ? Math.round(a.reduce((s, x) => s + x[k], 0) / a.length) : 0)

export default function Mapa() {
  const { t, readings } = useApp()
  const nav = useNavigate()
  const el = useRef(null), map = useRef(null), layer = useRef(null), me = useRef(null)
  const [legend, setLegend] = useState(true)
  const [car, setCar] = useState('all')
  const [tech, setTech] = useState('all')
  const [sel, setSel] = useState(null)

  const all = useMemo(() => [...SEED, ...readings], [readings])
  const list = useMemo(() => all.filter((r) => (car === 'all' || r.carrier === car) && (tech === 'all' || r.tech === tech)), [all, car, tech])
  const picked = all.find((r) => r.id === sel)
  const area = picked ? all.filter((r) => km([r.lat, r.lng], [picked.lat, picked.lng]) < 1.5) : all
  const areaList = picked ? area.filter((r) => list.includes(r)) : list
  const best = CARRIERS.map((c) => [c, area.filter((r) => r.carrier === c)]).filter(([, a]) => a.length).sort((a, b) => avg(b[1], 'rsrp') - avg(a[1], 'rsrp'))[0]
  const latest = areaList.length ? Math.max(...areaList.map((r) => r.ts)) : Date.now()

  useEffect(() => {
    const m = L.map(el.current, { zoomControl: false }).setView(CEBU, 12)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap contributors' }).addTo(m)
    L.control.zoom({ position: 'bottomleft' }).addTo(m)
    layer.current = L.layerGroup().addTo(m)
    map.current = m
    setTimeout(() => m.invalidateSize(), 200)
    return () => m.remove()
  }, [])

  useEffect(() => {
    const g = layer.current
    if (!g) return
    g.clearLayers()
    list.forEach((r) => {
      const c = Q_COLOR[quality(r.rsrp)]
      L.circle([r.lat, r.lng], { radius: 220, stroke: false, fillColor: c, fillOpacity: 0.22 }).addTo(g)
      L.circleMarker([r.lat, r.lng], { radius: r.id === sel ? 13 : 9, color: '#fff', weight: 3, fillColor: c, fillOpacity: 1 })
        .bindTooltip(`${r.carrier} ${r.tech} • ${r.rsrp} dBm • ${r.down} Mbps`)
        .on('click', () => setSel(r.id)).addTo(g)
    })
  }, [list, sel])

  const locate = async () => {
    const p = await getPos()
    if (!p || !map.current) return
    map.current.setView(p, 15)
    me.current?.remove()
    me.current = L.circleMarker(p, { radius: 8, color: '#fff', weight: 3, fillColor: '#2d6197', fillOpacity: 1 }).addTo(map.current).bindTooltip(t('map_you'))
  }

  const chip = (on) => `px-3.5 py-1 rounded-full font-label-sm text-label-sm shadow-sm shrink-0 transition-all ${on ? 'bg-secondary text-on-secondary' : 'bg-surface-container-lowest/95 text-on-surface-variant'}`
  const LG = [['excellent', '< -85'], ['good', '-86..-99'], ['weak', '-100..-115'], ['none', '> -116']]

  return (
    <div className="flex flex-col w-full relative">
      <div className="relative w-full h-[470px] overflow-hidden bg-surface-container-high">
        <div ref={el} className="absolute inset-0 z-0" />
        <div className="absolute top-3 inset-x-0 px-margin flex flex-col gap-2 z-[500] pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="flex-1 h-11 px-3.5 rounded-full bg-surface-container-lowest/95 shadow-md flex items-center gap-2">
              <Icon name="explore" className="text-secondary text-[20px]" />
              <span className="font-body-sm text-body-sm font-semibold truncate">{t('map_overview')}</span>
              <span className="ml-auto font-label-sm text-label-sm text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full">Live</span>
            </div>
            <button type="button" onClick={() => setLegend(!legend)} className="w-11 h-11 rounded-full bg-surface-container-lowest/95 shadow-md flex items-center justify-center"><Icon name="layers" className="text-[20px]" /></button>
            <button type="button" onClick={locate} className="w-11 h-11 rounded-full bg-primary-container text-on-primary-container shadow-md flex items-center justify-center active:scale-95"><Icon name="my_location" className="text-[20px]" /></button>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 pointer-events-auto">
            {['all', ...CARRIERS].map((c) => <button key={c} type="button" onClick={() => setCar(c)} className={chip(car === c)}>{c === 'all' ? t('all') : c}</button>)}
            <div className="w-px h-5 bg-outline-variant/50 shrink-0" />
            {['all', '5G', '4G'].map((x) => <button key={x} type="button" onClick={() => setTech(x)} className={`${chip(tech === x)} ${tech === x ? '!bg-primary-container !text-on-primary-container font-bold' : ''}`}>{x === 'all' ? t('all') : x}</button>)}
          </div>
          <div className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-inverse-surface/85 text-inverse-on-surface shadow-sm">
            <Icon name="diversity_3" className="text-primary-container text-[14px]" />
            <span className="font-label-sm text-label-sm">{t('map_crowd', { n: list.length })}</span>
          </div>
        </div>
        {legend && (
          <div className="absolute right-3 bottom-12 w-44 p-3 rounded-2xl bg-surface-container-lowest/95 shadow-lg z-[500]">
            <div className="font-label-sm text-label-sm font-bold mb-1.5">{t('legend')} (dBm)</div>
            {LG.map(([k, r]) => (
              <div key={k} className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 font-label-sm text-label-sm"><span className="w-2.5 h-2.5 rounded-full" style={{ background: Q_COLOR[k] }} />{t('q_' + k)}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">{r}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="-mt-8 relative z-20 w-full px-margin pb-6">
        <div className="w-full bg-surface-container-lowest rounded-t-3xl rounded-b-2xl shadow-2xl p-space-md flex flex-col gap-space-sm relative">
          <div className="absolute top-0 inset-x-8 h-1 bg-gradient-to-r from-secondary via-primary-container to-secondary rounded-full opacity-80" />
          <div className="w-12 h-1.5 rounded-full bg-surface-container-highest self-center mt-0.5 mb-1" />
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Icon name="location_on" className="text-tertiary text-[18px]" />
                <h2 className="font-title-lg text-title-lg tracking-tight truncate">{picked ? picked.place || t('map_you') : t('map_overview')}</h2>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5"><Icon name="update" className="text-[13px] text-secondary" />{t('map_updated', { t: ago(latest, t) })}</span>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant">dBm</span>
              <span className="font-title-lg text-title-lg font-extrabold" style={{ color: Q_COLOR[quality(avg(areaList, 'rsrp'))] }}>{areaList.length ? avg(areaList, 'rsrp') : '--'}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-surface-container"><div className="font-label-sm text-label-sm text-on-surface-variant">{t('map_reports')}</div><div className="font-headline-sm text-headline-sm font-extrabold">{areaList.length}</div></div>
            <div className="p-2.5 rounded-xl bg-surface-container"><div className="font-label-sm text-label-sm text-secondary">{t('map_avg_speed')}</div><div className="font-headline-sm text-headline-sm text-secondary font-extrabold">{avg(areaList, 'down')}</div><div className="text-[11px] text-on-surface-variant">{t('mbps')}</div></div>
            <div className="p-2.5 rounded-xl bg-secondary-fixed/50"><div className="font-label-sm text-label-sm text-on-secondary-fixed font-bold">{t('map_top')}</div><div className="font-title-md text-title-md text-on-secondary-fixed font-black">{best ? best[0] : '--'}</div><div className="text-[11px] text-on-secondary-fixed-variant">{best ? avg(best[1], 'rsrp') + ' dBm' : ''}</div></div>
          </div>
          <div className="p-3 rounded-2xl bg-surface-container-low flex flex-col gap-2">
            <span className="font-label-sm text-label-sm font-bold">{t('map_dist')}</span>
            <div className="w-full h-3 rounded-full bg-surface-container-high overflow-hidden flex">
              {CARRIERS.map((c) => <div key={c} className={`h-full ${CC[c]}`} style={{ width: `${(area.filter((r) => r.carrier === c).length / Math.max(1, area.length)) * 100}%` }} />)}
            </div>
            <div className="flex justify-between text-[11px] font-label-sm text-on-surface-variant">
              {CARRIERS.map((c) => <span key={c} className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${CC[c]}`} />{c} {Math.round((area.filter((r) => r.carrier === c).length / Math.max(1, area.length)) * 100)}%</span>)}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-surface-container-high/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0"><img src={tarsee} alt="" className="w-8 h-8" /></div>
            <div className="min-w-0"><p className="font-label-sm text-label-sm text-primary font-bold">{t('tip_title')} 🐾</p><p className="font-body-sm text-body-sm leading-snug">{t('tip_text')}</p></div>
          </div>
          <button type="button" onClick={() => nav('/')} className="w-full h-14 rounded-full bg-primary-container active:scale-[0.98] text-on-primary-container shadow-lg shadow-primary-container/40 flex items-center justify-center gap-2.5 transition-all">
            <Icon name="add_location_alt" className="text-[24px]" /><span className="font-label-lg text-label-lg font-extrabold">{t('map_measure')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
