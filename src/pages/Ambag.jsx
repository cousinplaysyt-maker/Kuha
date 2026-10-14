import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import tarsee from '../assets/tarsee.svg'
import { useApp } from '../lib/store.jsx'
import { CARRIERS } from '../lib/data.js'
import RewardsCard from '../components/RewardsCard.jsx'
import Celebration from '../components/Celebration.jsx'
import { quality, ago } from '../lib/measure.js'

const ENVS = [['indoor', '🏢'], ['transit', '🚗'], ['outdoor', '🌳'], ['weather', '🌧️']]
const card = 'rounded-lg bg-surface-container-lowest p-space-md shadow-sm'

export default function Ambag() {
  const { t, last, set, addReading, carrier, mine } = useApp()
  const nav = useNavigate()
  const [car, setCar] = useState(carrier)
  const [env, setEnv] = useState('outdoor')
  const [done, setDone] = useState(false)
  const [cele, setCele] = useState(null)
  const n = mine.length

  const submit = () => {
    addReading({ ...last, id: 'r' + Date.now(), carrier: car, env })
    set({ last: null })
    setDone(true)
    setCele(n + 1)
  }

  return (
    <div className="flex flex-col w-full px-margin pb-space-xl space-y-space-md">
      {cele && <Celebration n={cele} onClose={() => setCele(null)} onTrophies={() => nav('/rewards')} />}
      <section className="relative overflow-hidden rounded-lg bg-surface-container-low p-space-md shadow-sm">
        <div className="flex items-start gap-space-md">
          <div className="w-20 h-20 rounded-full bg-surface-container-lowest p-1.5 shadow-md shrink-0"><img alt="Tarsee" className="w-full h-full object-contain" src={tarsee} /></div>
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-secondary mb-1.5"><Icon name="handshake" className="text-[14px]" /><span className="font-label-sm text-label-sm uppercase">{t('civic')}</span></div>
            <h2 className="font-headline-sm text-headline-sm leading-tight">{t('thanks_title')}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{t('thanks_sub')}</p>
          </div>
        </div>
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-secondary via-primary-container to-secondary opacity-60" />
      </section>

      {done ? (
        <section className={`${card} text-center space-y-3`}>
          <div className="text-[40px]">🎉</div>
          <p className="font-title-md text-title-md font-bold">{t('sub_success')}</p>
          <button type="button" onClick={() => nav('/mapa')} className="w-full h-12 rounded-full bg-primary-container text-on-primary-container font-label-lg font-extrabold flex items-center justify-center gap-2"><Icon name="map" />{t('see_map')}</button>
        </section>
      ) : !last ? (
        <section className={`${card} text-center space-y-3`}>
          <Icon name="radar" className="text-secondary text-[36px]" />
          <h3 className="font-title-lg text-title-lg font-bold">{t('nothing_title')}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t('nothing_sub')}</p>
          <button type="button" onClick={() => nav('/')} className="w-full h-12 rounded-full bg-primary-container text-on-primary-container font-label-lg font-extrabold">{t('go_scan')}</button>
        </section>
      ) : (
        <>
          <section className={`${card} space-y-space-sm`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Icon name="bar_chart" className="text-secondary text-[22px]" /><h3 className="font-title-lg text-title-lg font-bold">{t('data_title')}</h3></div>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">{ago(last.ts, t)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-DEFAULT bg-surface-container-low">
              <div><span className="font-title-md text-title-md font-bold block">{last.tech} • {last.latency} ms</span><span className="font-label-sm text-label-sm text-on-surface-variant">{last.located ? (last.place ? t('near', { p: last.place }) : `${last.lat.toFixed(3)}, ${last.lng.toFixed(3)}`) : t('loc_unknown')}</span></div>
              <div className="flex items-center gap-1 text-secondary font-label-lg font-bold"><Icon name="signal_cellular_alt" className="text-[18px]" />{last.rsrp} dBm <span className="text-on-surface-variant font-normal">({t('q_' + quality(last.rsrp))})</span></div>
            </div>
            <div className="grid grid-cols-2 gap-space-sm">
              {[['arrow_downward', 'text-secondary', 'download', last.down], ['arrow_upward', 'text-primary', 'upload', last.up]].map(([i, c, k, v]) => (
                <div key={k} className="p-3 rounded-DEFAULT bg-surface-container-low">
                  <div className={`flex items-center gap-1.5 ${c}`}><Icon name={i} className="text-[18px]" /><span className="font-label-sm text-label-sm uppercase font-bold">{t(k)}</span></div>
                  <div className="mt-2"><span className="font-headline-lg-mobile text-headline-lg-mobile font-black">{v}</span><span className="font-label-sm text-label-sm text-on-surface-variant ml-1 font-bold">Mbps</span></div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <label className="font-title-md text-title-md font-bold px-1 block">{t('carrier_q')}</label>
            <div className="grid grid-cols-3 gap-space-sm">
              {CARRIERS.map((c) => <button key={c} type="button" onClick={() => setCar(c)} className={`py-3 rounded-DEFAULT font-label-lg font-bold shadow-sm ${car === c ? 'bg-secondary text-on-secondary' : 'bg-surface-container-lowest'}`}>{c}</button>)}
            </div>
            <label className="font-title-md text-title-md font-bold px-1 block pt-2">{t('env_q')} <span className="font-normal text-on-surface-variant text-label-sm">{t('optional')}</span></label>
            <div className="grid grid-cols-2 gap-space-sm">
              {ENVS.map(([id, e]) => {
                const on = env === id
                return (
                  <button key={id} type="button" onClick={() => setEnv(id)} className={`flex items-center gap-2.5 p-3 rounded-DEFAULT text-left shadow-sm transition-all ${on ? 'bg-secondary-fixed' : 'bg-surface-container-lowest'}`}>
                    <span className="text-[24px]">{e}</span>
                    <div className="min-w-0"><span className="font-label-lg text-label-lg font-bold block truncate">{t('env_' + id)}</span><span className="font-label-sm text-label-sm text-on-surface-variant block truncate">{t('env_' + id + '_s')}</span></div>
                  </button>
                )
              })}
            </div>
          </section>

          <button type="button" onClick={submit} className="w-full h-14 rounded-full bg-primary-container text-on-primary-container font-title-lg text-title-lg font-extrabold shadow-lg flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all">
            <Icon name="send" fill className="text-[24px]" /><span>{t('submit_btn')}</span>
          </button>
        </>
      )}

      <section className={card}>
        <div className="flex items-start gap-space-sm">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0 text-on-secondary-fixed"><Icon name="verified_user" className="text-[22px]" /></div>
          <div><h3 className="font-title-lg text-title-lg font-bold">{t('priv_title')}</h3><p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">{t('priv_text')}</p></div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 bg-surface-container-low rounded-DEFAULT p-2.5">
          {[['block', 'text-error', 'p_anon'], ['grid_view', 'text-secondary', 'p_grid'], ['public', 'text-primary', 'p_open']].map(([i, c, k]) => (
            <div key={k} className="flex flex-col items-center text-center"><Icon name={i} className={`text-[20px] ${c}`} /><span className="font-label-md text-label-md font-bold">{t(k)}</span><span className="font-label-sm text-label-sm text-on-surface-variant">{t(k + '_s')}</span></div>
          ))}
        </div>
      </section>

      <RewardsCard />
    </div>
  )
}
