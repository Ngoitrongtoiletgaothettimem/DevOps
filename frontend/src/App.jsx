import './App.css'

import { useEffect, useMemo, useState } from 'react'

import AboutPage from './pages/AboutPage.jsx'
import HealthPage from './pages/HealthPage.jsx'
import StatsPage from './pages/StatsPage.jsx'
import StudentsPage from './students/StudentsPage.jsx'

function App() {
  const [path, setPath] = useState(window.location.pathname || '/')
  const apiBaseUrl = useMemo(() => {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  }, [])

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname || '/')
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function navigate(nextPath) {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
  }

  const page =
    path === '/about' ? (
      <AboutPage />
    ) : path === '/health' ? (
      <HealthPage apiBaseUrl={apiBaseUrl} />
    ) : path === '/stats' ? (
      <StatsPage apiBaseUrl={apiBaseUrl} />
    ) : (
      <StudentsPage apiBaseUrl={apiBaseUrl} />
    )

  return (
    <>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <strong>{import.meta.env.VITE_APP_NAME || 'DevOps Mini Project'}</strong>
        <nav style={{ display: 'flex', gap: 8 }}>
          <button
            className="counter"
            onClick={() => navigate('/')}
            aria-current={path === '/' ? 'page' : undefined}
          >
            Students
          </button>
          <button
            className="counter"
            onClick={() => navigate('/stats')}
            aria-current={path === '/stats' ? 'page' : undefined}
          >
            Stats
          </button>
          <button
            className="counter"
            onClick={() => navigate('/health')}
            aria-current={path === '/health' ? 'page' : undefined}
          >
            Health
          </button>
          <button
            className="counter"
            onClick={() => navigate('/about')}
            aria-current={path === '/about' ? 'page' : undefined}
          >
            About
          </button>
        </nav>
      </header>
      {page}
    </>
  )
}

export default App
