import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Kuha from './pages/Kuha.jsx'
import Mapa from './pages/Mapa.jsx'
import Ambag from './pages/Ambag.jsx'
import Account from './pages/Account.jsx'
import Settings from './pages/Settings.jsx'
import Rewards from './pages/Rewards.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Kuha />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/ambag" element={<Ambag />} />
        <Route path="/account" element={<Account />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/rewards" element={<Rewards />} />
      </Route>
    </Routes>
  )
}
