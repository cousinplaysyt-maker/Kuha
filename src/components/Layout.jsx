import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'
import logo from '../assets/logo.svg'
import { useApp } from '../lib/store.jsx'

const TABS = [
  { to: '/', key: 'nav_kuha', icon: 'radar' },
  { to: '/mapa', key: 'nav_map', icon: 'map' },
  { to: '/ambag', key: 'nav_ambag', icon: 'volunteer_activism' },
]
const TITLES = { '/': 'nav_kuha', '/mapa': 'nav_map', '/ambag': 'nav_ambag', '/account': 'title_account', '/settings': 'title_settings', '/rewards': 'rewards' }

export default function Layout() {
  const { pathname } = useLocation()
  const { t, carrier, last, user } = useApp()
  return (
    <div className="bg-surface text-on-surface flex flex-col min-h-screen selection:bg-secondary-container">
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_12px_rgba(11,28,48,0.06)]">
        <div className="h-16 px-margin max-w-md mx-auto flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm min-w-0">
            <img alt="Kuha logo" className="h-8 w-8 shrink-0" src={logo} />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-title-lg text-title-lg tracking-tight leading-none">Kuha</span>
                <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed px-1.5 py-0.5 rounded-full">PH</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">{t(TITLES[pathname] || 'nav_kuha')}</span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <span className="font-label-sm text-label-sm">{carrier}{last ? ' ' + last.tech : ''}</span>
            </div>
            <Link to="/settings" title={t('title_settings')} className="w-11 h-11 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
              <Icon name="tune" className="text-[22px]" />
            </Link>
            <Link to="/account" title={t('title_account')} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-on-primary font-label-lg">
              {user ? user.name.charAt(0).toUpperCase() : <Icon name="person" className="text-[18px]" />}
            </Link>
          </div>
        </div>
        <div className="h-[2px] w-full bg-gradient-to-r from-secondary via-primary-container to-secondary opacity-70" />
      </header>

      <main className="flex-1 flex flex-col relative w-full max-w-md mx-auto pt-16 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] bg-surface">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-2px_16px_rgba(11,28,48,0.06)]">
        <div className="h-20 px-gutter max-w-md mx-auto flex items-center justify-around">
          {TABS.map((x) => (
            <NavLink key={x.to} to={x.to} end className={({ isActive }) => `flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 gap-1 transition-all ${isActive ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}>
              {({ isActive }) => (
                <>
                  <div className={`w-14 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-primary-container text-on-primary-container' : ''}`}>
                    <Icon name={x.icon} className="text-[24px]" />
                  </div>
                  <span className="font-label-sm text-label-sm">{t(x.key)}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
