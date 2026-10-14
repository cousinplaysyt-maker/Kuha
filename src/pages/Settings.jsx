import { useState } from 'react'
import { useApp } from '../lib/store.jsx'
import { CARRIERS } from '../lib/data.js'

const card = 'rounded-lg bg-surface-container-lowest p-space-md shadow-sm space-y-3'
const seg = (on) => `flex-1 py-2.5 rounded-full font-label-lg font-bold transition-all ${on ? 'bg-secondary text-on-secondary shadow-sm' : 'text-on-surface-variant'}`

export default function Settings() {
  const { t, lang, carrier, fuzz, liveMs, set, clearMine } = useApp()
  const [cleared, setCleared] = useState(false)
  return (
    <div className="px-margin space-y-space-md">
      <section className={card}>
        <h3 className="font-title-md text-title-md font-bold">{t('language')}</h3>
        <div className="flex p-1 rounded-full bg-surface-container-high">
          <button type="button" className={seg(lang === 'en')} onClick={() => set({ lang: 'en' })}>{t('lang_en')}</button>
          <button type="button" className={seg(lang === 'tl')} onClick={() => set({ lang: 'tl' })}>{t('lang_tl')}</button>
        </div>
      </section>
      <section className={card}>
        <h3 className="font-title-md text-title-md font-bold">{t('default_carrier')}</h3>
        <div className="flex p-1 rounded-full bg-surface-container-high">
          {CARRIERS.map((c) => <button key={c} type="button" className={seg(carrier === c)} onClick={() => set({ carrier: c })}>{c}</button>)}
        </div>
      </section>
      <section className={card}>
        <div className="flex items-center justify-between gap-3">
          <div><h3 className="font-title-md text-title-md font-bold">{t('fuzz')}</h3><p className="font-body-sm text-body-sm text-on-surface-variant">{t('fuzz_sub')}</p></div>
          <button type="button" onClick={() => set({ fuzz: !fuzz })} className={`w-12 h-7 rounded-full p-0.5 shrink-0 transition-colors ${fuzz ? 'bg-secondary' : 'bg-outline-variant'}`}>
            <span className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${fuzz ? 'translate-x-5' : ''}`} />
          </button>
        </div>
      </section>
      <section className={card}>
        <h3 className="font-title-md text-title-md font-bold">{t('live_int')}</h3>
        <div className="flex p-1 rounded-full bg-surface-container-high">
          {[3000, 5000, 10000].map((ms) => <button key={ms} type="button" className={seg(liveMs === ms)} onClick={() => set({ liveMs: ms })}>{t('sec', { n: ms / 1000 })}</button>)}
        </div>
      </section>
      <section className={card}>
        <h3 className="font-title-md text-title-md font-bold">{t('data')}</h3>
        <button type="button" onClick={() => { clearMine(); setCleared(true) }} className="w-full h-12 rounded-full bg-error-container text-on-error-container font-label-lg font-bold">{cleared ? t('cleared') : t('clear')}</button>
      </section>
      <p className="text-center font-body-sm text-body-sm text-on-surface-variant pb-4">{t('about')}</p>
    </div>
  )
}
