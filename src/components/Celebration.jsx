import { createPortal } from 'react-dom'
import Pixel, { BADGE_LAYERS, TARSEE_LAYERS } from './Pixel.jsx'
import { useApp } from '../lib/store.jsx'
import { BADGES } from '../lib/data.js'

const COLORS = ['#f59e0b', '#2d6197', '#ef4444', '#10b981', '#ff9388', '#92c1fe']

export default function Celebration({ n, onClose, onTrophies }) {
  const { t } = useApp()
  const badge = BADGES.find((b) => b.need === n)
  const next = BADGES.find((b) => n < b.need)
  const kind = n === 1 ? 'first' : badge ? 'badge' : n % 5 === 0 ? 'five' : 'reg'
  const msg = kind === 'first' ? t('cele_first_msg', { b: t(badge.key) })
    : kind === 'badge' ? t('cele_badge_msg', { b: t(badge.key), n })
    : kind === 'five' ? t('cele_five_msg', { n })
    : next ? t('cele_reg_msg', { n: next.need - n }) : t('cele_legend')

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-[#0b1c30]/70">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', top: 0, left: `${(i * 37) % 100}%`, width: 8 + (i % 3) * 4, height: 8 + (i % 3) * 4, background: COLORS[i % 6], animation: `fall ${2 + (i % 5) * 0.4}s linear ${(i % 7) * 0.2}s infinite` }} />
        ))}
      </div>
      <div className="pixel-box anim-pop relative w-full max-w-sm bg-[#fff7e0] p-5 pt-7 text-center">
        <div className="absolute inset-x-0 top-0 h-3" style={{ background: 'repeating-linear-gradient(90deg,#f59e0b 0 16px,#2d6197 16px 32px,#ef4444 32px 48px)' }} />
        <div className="inline-block anim-hop"><Pixel layers={badge ? BADGE_LAYERS[badge.key] : TARSEE_LAYERS} size={168} /></div>
        <div className="pixel-box bg-white p-3 mt-3 text-left" style={{ boxShadow: '4px 4px 0 #0b1c30' }}>
          <div className="font-pixel text-[12px] text-[#0b1c30]">{t('cele_' + kind + '_title')}</div>
          <p className="font-body-md text-body-md text-on-surface mt-2">{msg}</p>
        </div>
        <div className="font-pixel text-[10px] text-primary mt-3">{t('plus_pts')}</div>
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={onClose} className="pixel-btn flex-1 py-3 bg-primary-container font-pixel text-[10px] text-[#0b1c30]">{t('cele_btn')}</button>
          <button type="button" onClick={() => { onClose(); onTrophies() }} className="pixel-btn flex-1 py-3 bg-secondary-fixed font-pixel text-[10px] text-[#0b1c30]">{t('cele_trophies')}</button>
        </div>
      </div>
    </div>,
    document.body
  )
}
