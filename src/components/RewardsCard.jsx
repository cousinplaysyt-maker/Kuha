import { Link } from 'react-router-dom'
import Pixel, { BADGE_LAYERS } from './Pixel.jsx'
import { useApp } from '../lib/store.jsx'
import { BADGES, levelOf } from '../lib/data.js'

export default function RewardsCard() {
  const { t, mine } = useApp()
  const n = mine.length
  const next = BADGES.find((b) => n < b.need)
  return (
    <section className="pixel-box p-space-md space-y-3" style={{ background: 'linear-gradient(135deg,#fff3c4,#d2e4ff)' }}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-pixel text-[11px] text-[#0b1c30]">🏆 {t('rewards')}</h3>
        <span className="pixel-btn px-2 py-1 bg-white font-pixel text-[8px]">{t('level', { n: levelOf(n) })}</span>
      </div>
      <div>
        <div className="flex justify-between font-label-md text-label-md mb-1.5"><span className="font-bold">{next ? t('next_badge', { n: next.need - n, b: t(next.key) }) : t('all_badges')}</span><span className="font-extrabold text-secondary ml-2">{n}{next ? `/${next.need}` : ''}</span></div>
        <div className="h-5 border-[3px] border-[#0b1c30] bg-white"><div className="h-full" style={{ width: `${next ? (n / next.need) * 100 : 100}%`, background: 'repeating-linear-gradient(90deg,#f59e0b 0 8px,#fbbf24 8px 16px)' }} /></div>
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {BADGES.map((b) => <div key={b.key} className="border-2 border-[#0b1c30] flex justify-center" style={{ background: n >= b.need ? b.bg : '#e5e7eb' }}><Pixel layers={BADGE_LAYERS[b.key]} size={44} gray={n < b.need} /></div>)}
      </div>
      <Link to="/rewards" className="pixel-btn block text-center py-2.5 bg-primary-container font-pixel text-[9px] text-[#0b1c30]">{t('view_all')} ▶</Link>
    </section>
  )
}
