import Pixel, { BADGE_LAYERS, TARSEE_LAYERS } from '../components/Pixel.jsx'
import { useApp } from '../lib/store.jsx'
import { BADGES, levelOf } from '../lib/data.js'

export default function Rewards() {
  const { t, mine } = useApp()
  const n = mine.length
  return (
    <div className="px-margin space-y-space-md pb-6">
      <section className="pixel-box p-space-md flex items-center gap-4" style={{ background: 'linear-gradient(135deg,#f59e0b,#92c1fe)' }}>
        <div className="bg-white border-4 border-[#0b1c30] shrink-0 anim-hop"><Pixel layers={TARSEE_LAYERS} size={84} /></div>
        <div className="min-w-0 flex-1">
          <div className="font-pixel text-[10px] text-[#0b1c30]">{t('trophy_room')}</div>
          <div className="font-pixel text-[16px] text-white mt-2" style={{ textShadow: '2px 2px 0 #0b1c30' }}>LV {levelOf(n)}</div>
          <div className="h-4 border-[3px] border-[#0b1c30] bg-white mt-2"><div className="h-full" style={{ width: `${((n % 5) / 5) * 100}%`, background: 'repeating-linear-gradient(90deg,#10b981 0 8px,#34d399 8px 16px)' }} /></div>
          <div className="font-label-md text-label-md text-[#0b1c30] font-bold mt-1">{t('xp_next', { a: n % 5 })} • {n * 50} {t('pts')}</div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        {BADGES.map((b) => {
          const on = n >= b.need
          return (
            <div key={b.key} className="pixel-box p-3 text-center" style={{ background: on ? b.bg : '#e5e7eb' }}>
              <div className="bg-white/60 border-2 border-[#0b1c30] flex justify-center"><Pixel layers={BADGE_LAYERS[b.key]} size={104} gray={!on} /></div>
              <div className="font-pixel text-[9px] mt-3 text-[#0b1c30]">{t(b.key)}</div>
              <div className="font-label-md text-label-md text-on-surface-variant mt-1">{t('readings_needed', { n: b.need })}</div>
              <div className={`font-pixel text-[8px] mt-2 ${on ? 'text-emerald-700' : 'text-on-surface-variant'}`}>{on ? '★ ' + t('unlocked_label') : t('locked_more', { n: b.need - n })}</div>
            </div>
          )
        })}
      </section>
      <p className="text-center font-pixel text-[8px] text-on-surface-variant">{t('level_up_info')}</p>
    </div>
  )
}
