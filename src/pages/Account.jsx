import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Pixel, { BADGE_LAYERS } from '../components/Pixel.jsx'
import { useApp } from '../lib/store.jsx'
import { BADGES, levelOf } from '../lib/data.js'
import { ago } from '../lib/measure.js'

const card = 'rounded-lg bg-surface-container-lowest p-space-md shadow-sm'
const input = 'w-full h-12 px-4 rounded-DEFAULT bg-surface-container-low outline-none focus:ring-2 focus:ring-secondary'

export default function Account() {
  const { t, user, login, logout, mine } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const n = mine.length
  const ok = name.trim() && /.+@.+/.test(email)

  if (!user) {
    return (
      <div className="px-margin space-y-space-md">
        <section className={`${card} space-y-3`}>
          <h2 className="font-headline-sm text-headline-sm">{t('login_title')}</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t('login_sub')}</p>
          <input className={input} placeholder={t('name')} value={name} onChange={(e) => setName(e.target.value)} />
          <input className={input} placeholder={t('email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="button" disabled={!ok} onClick={() => login(name.trim(), email.trim())} className="w-full h-12 rounded-full bg-primary-container text-on-primary-container font-label-lg font-extrabold disabled:opacity-50">{t('create_btn')}</button>
        </section>
        <Link to="/settings" className="flex items-center justify-center gap-2 text-secondary font-label-lg font-bold py-2"><Icon name="tune" />{t('open_settings')}</Link>
      </div>
    )
  }

  return (
    <div className="px-margin space-y-space-md">
      <section className={`${card} flex items-center gap-4`}>
        <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md text-headline-md">{user.name.charAt(0).toUpperCase()}</div>
        <div className="min-w-0"><h2 className="font-headline-sm text-headline-sm truncate">{user.name}</h2><p className="font-body-sm text-body-sm text-on-surface-variant truncate">{user.email}</p></div>
      </section>
      <section className="grid grid-cols-3 gap-2">
        {[[t('readings'), n], [t('points'), n * 50], [t('lvl'), levelOf(n)]].map(([k, v]) => (
          <div key={k} className="p-3 rounded-DEFAULT bg-surface-container-lowest shadow-sm text-center"><div className="font-headline-sm text-headline-sm font-extrabold text-secondary">{v}</div><div className="font-label-sm text-label-sm text-on-surface-variant">{k}</div></div>
        ))}
      </section>
      <section className={`${card} space-y-2`}>
        <h3 className="font-title-md text-title-md font-bold">{t('badge_col')}</h3>
        <div className="grid grid-cols-6 gap-1">{BADGES.map((b) => <Pixel key={b.key} layers={BADGE_LAYERS[b.key]} size={48} gray={n < b.need} />)}</div>
        <Link to="/rewards" className="block text-center text-secondary font-label-lg font-bold pt-1">{t('view_all')}</Link>
      </section>
      <section className={`${card} space-y-2`}>
        <h3 className="font-title-md text-title-md font-bold">{t('my_readings')}</h3>
        {n === 0 && <p className="font-body-sm text-body-sm text-on-surface-variant">{t('none_yet')}</p>}
        {[...mine].reverse().slice(0, 5).map((r) => (
          <div key={r.id} className="flex justify-between p-2.5 rounded-DEFAULT bg-surface-container-low font-body-sm text-body-sm">
            <span className="font-bold">{r.carrier} {r.tech}</span><span>{r.rsrp} dBm • {r.down} Mbps</span><span className="text-on-surface-variant">{ago(r.ts, t)}</span>
          </div>
        ))}
      </section>
      <Link to="/settings" className="flex items-center justify-center gap-2 text-secondary font-label-lg font-bold py-1"><Icon name="tune" />{t('open_settings')}</Link>
      <button type="button" onClick={logout} className="w-full h-12 rounded-full bg-surface-container-high text-on-surface font-label-lg font-bold flex items-center justify-center gap-2"><Icon name="logout" />{t('signout')}</button>
    </div>
  )
}
