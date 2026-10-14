import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import tarsee from '../assets/tarsee.svg'
import { useApp } from '../lib/store.jsx'
import { scan, ping, quality } from '../lib/measure.js'

export default function Kuha() {
  const { t, last, set, carrier, liveMs } = useApp()
  const nav = useNavigate()
  const [busy, setBusy] = useState(null)
  const [live, setLive] = useState(false)
  const [lp, setLp] = useState(null)
  const r = last
  const q = r ? quality(r.rsrp) : null
  const pct = r ? Math.max(0, Math.min(1, (r.rsrp + 120) / 50)) : 0
  const lat = lp?.latency ?? r?.latency
  const jit = lp?.jitter ?? r?.jitter
  const today = r && new Date(r.ts).toDateString() === new Date().toDateString()

  const run = async () => {
    if (busy) return
    setLive(false)
    const res = await scan(setBusy)
    set({ last: res })
    setLp(null)
    setBusy(null)
  }

  useEffect(() => {
    if (!live) return
    let stop = false
    const tick = async () => { const p = await ping(3); if (!stop && p) setLp(p) }
    tick()
    const id = setInterval(tick, liveMs)
    return () => { stop = true; clearInterval(id) }
  }, [live, liveMs])

  return (
    <div className="flex flex-col w-full px-margin pb-6 gap-y-4">
      <div className="w-full flex items-center justify-between bg-surface-container-low rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0"><Icon name="cell_tower" className="text-[18px]" /></div>
          <span className="font-title-md text-title-md truncate">{carrier}</span>
          {r && <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-lowest text-secondary font-bold shrink-0">{r.tech}</span>}
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant shrink-0 ml-2">
          <Icon name="location_on" className="text-[16px] text-primary" />
          <span className="font-body-sm text-body-sm truncate max-w-[150px]">{r ? (r.located ? (r.place ? t('near', { p: r.place }) : `${r.lat.toFixed(3)}, ${r.lng.toFixed(3)}`) : t('loc_unknown')) : '—'}</span>
        </div>
      </div>

      <div className="w-full bg-surface-container-lowest rounded-3xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-container via-secondary to-primary-container opacity-80" />
        <div className="flex items-center gap-3.5">
          <div className="w-20 h-20 rounded-2xl bg-surface-container-low flex items-center justify-center p-1 shrink-0">
            <img alt="Tarsee" className="w-full h-full object-contain drop-shadow-md" src={tarsee} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon name="auto_awesome" fill className="text-[16px] text-primary-container" />
              <span className="font-label-sm text-label-sm text-primary tracking-wider uppercase font-extrabold">Tarsee</span>
            </div>
            <p className="font-title-md text-title-md font-bold leading-snug">“{t(q ? 'tarsee_' + q : 'tarsee_idle')}”</p>
          </div>
        </div>
      </div>

      <div className="w-full bg-surface-container-lowest rounded-3xl p-5 shadow-md flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container mb-3">
          <span className="w-2 h-2 rounded-full bg-primary-container" />
          <span className="font-label-md text-label-md uppercase tracking-wider font-extrabold">{t('status')}: {q ? `${t('q_' + q)} (${r.rsrp} dBm)` : t('no_scan')}</span>
        </div>
        <div className="relative w-56 h-56 flex items-center justify-center my-1">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#2d6197" /><stop offset="50%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <circle className="text-surface-container-high" cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeDasharray="1.5 4" strokeLinecap="round" strokeWidth="4" />
            <circle className="text-surface-container" cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="8" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="url(#g1)" strokeDasharray="219.9" strokeDashoffset={219.9 * (1 - pct)} strokeLinecap="round" strokeWidth="8" style={{ transition: 'stroke-dashoffset .8s' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest font-extrabold px-6">{t('rsrp_label')}</span>
            <div className="flex items-baseline gap-0.5 my-0.5">
              <span className="font-display-lg text-display-lg font-black tracking-tight leading-none">{r ? r.rsrp : '--'}</span>
              <span className="font-title-lg text-title-lg text-on-surface-variant font-bold">dBm</span>
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-3 mt-3">
          <Stat icon="schedule" label={t('latency')} value={lat ?? '--'} unit="ms" />
          <Stat icon="stacked_bar_chart" label={t('jitter')} value={jit ?? '--'} unit="ms" />
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-3">{t('est_note')}{r?.simulated ? ' ' + t('demo_note') : ''}</p>
      </div>

      <div className="w-full flex flex-col gap-2.5 pt-1">
        <button type="button" onClick={run} disabled={!!busy} className="w-full h-14 rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg font-black flex items-center justify-center gap-2 shadow-lg shadow-primary-container/30 active:scale-[0.98] transition-transform">
          <Icon name={busy ? 'refresh' : 'radar'} className={`text-[24px] ${busy ? 'animate-spin' : ''}`} />
          <span>{busy ? t('st_' + busy) : t('scan_btn')}</span>
        </button>
        <button type="button" disabled={!r} onClick={() => nav('/ambag')} className="w-full h-12 rounded-full bg-surface-container-high/60 text-secondary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 active:bg-surface-container-high disabled:opacity-50">
          <Icon name="cloud_upload" className="text-[20px]" /><span>{t('contribute_btn')}</span>
        </button>
      </div>

      <div className="w-full bg-surface-container-lowest rounded-3xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${live ? 'bg-emerald-500 animate-pulse' : 'bg-primary-container'}`} />
            <span className="font-title-lg text-title-lg font-extrabold">{t('speed_title')}</span>
          </div>
          <button type="button" onClick={() => setLive(!live)} className={`font-label-sm text-label-sm px-3 py-1 rounded-full font-bold ${live ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary-fixed text-on-secondary-fixed'}`}>{live ? t('live_on') : t('go_live')}</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Speed icon="download" label={t('download')} value={r?.down} max={300} color="text-secondary" bar="bg-secondary" />
          <Speed icon="upload" label={t('upload')} value={r?.up} max={100} color="text-primary" bar="bg-primary-container" />
        </div>
        <div className="px-3.5 py-2.5 rounded-xl bg-surface-container flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">{t('conn')}</span>
          <span className="font-label-md text-label-md font-extrabold uppercase">{r?.net || navigator.connection?.effectiveType || t('unknown')}</span>
        </div>
      </div>

      <div className="w-full bg-secondary-fixed/50 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <div className="w-11 h-11 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0"><Icon name="wb_sunny" className="text-[24px]" /></div>
        <div className="min-w-0">
          <span className="font-title-md text-title-md font-extrabold block truncate">{t('quest_title')} 🚗</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{today ? t('quest_done') : t('quest_sub')}</p>
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, label, value, unit }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container-low text-center">
      <div className="flex items-center gap-1 text-on-surface-variant mb-0.5"><Icon name={icon} className="text-[16px]" /><span className="font-label-md text-label-md">{label}</span></div>
      <div className="flex items-baseline gap-1"><span className="font-headline-sm text-headline-sm font-black">{value}</span><span className="font-label-sm text-label-sm text-on-surface-variant">{unit}</span></div>
    </div>
  )
}

function Speed({ icon, label, value, max, color, bar }) {
  return (
    <div className="p-3.5 rounded-2xl bg-surface-container-low flex flex-col gap-1.5">
      <div className={`flex items-center gap-1.5 ${color}`}><Icon name={icon} className="text-[18px]" /><span className="font-label-md text-label-md font-bold">{label}</span></div>
      <div className="flex items-baseline gap-1"><span className="font-headline-md text-headline-md font-extrabold">{value ?? '--'}</span><span className="font-body-sm text-body-sm text-on-surface-variant font-bold">Mbps</span></div>
      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mt-1"><div className={`h-full rounded-full ${bar}`} style={{ width: `${Math.min(100, ((value || 0) / max) * 100)}%` }} /></div>
    </div>
  )
}
