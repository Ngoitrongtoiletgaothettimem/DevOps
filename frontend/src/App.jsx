import './App.css'

import { useEffect, useMemo, useState } from 'react'

function AboutPage() {
  return (
    <section id="center">
      <div>
        <h1>About</h1>
        <p>
          Họ tên sinh viên: <strong>Nguyễn Ngọc Gia Hào</strong>
        </p>
        <p>
          Mã số sinh viên: <strong>2251220064</strong>
        </p>
        <p>
          Lớp: <strong>22ct2</strong>
        </p>
        <p style={{ marginTop: 16 }}>
          Hãy sửa thông tin của bạn trong <code>frontend/src/App.jsx</code>.
        </p>
      </div>
    </section>
  )
}

function TasksPage({ apiBaseUrl }) {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${apiBaseUrl}/api/tasks`)
      if (!res.ok) throw new Error(`GET /api/tasks failed (${res.status})`)
      const data = await res.json()
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch (e) {
      setError(e?.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl])

  async function createTask(e) {
    e.preventDefault()
    const nextTitle = title.trim()
    if (!nextTitle) return

    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${apiBaseUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: nextTitle }),
      })
      if (!res.ok) throw new Error(`POST /api/tasks failed (${res.status})`)
      setTitle('')
      await load()
    } catch (e2) {
      setError(e2?.message || 'Failed to create task')
      setLoading(false)
    }
  }

  async function toggleDone(task) {
    setError('')
    const res = await fetch(`${apiBaseUrl}/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDone: !task.isDone }),
    })
    if (!res.ok) {
      setError(`PUT /api/tasks/${task.id} failed (${res.status})`)
      return
    }
    await load()
  }

  return (
    <section id="center">
      <div style={{ width: 'min(720px, 100%)' }}>
        <h1>Tasks</h1>
        <p style={{ marginBottom: 16 }}>
          Backend: <code>{apiBaseUrl}</code>
        </p>

        <form onSubmit={createTask} style={{ display: 'flex', gap: 8 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập task..."
            style={{ flex: 1, padding: '8px 10px', borderRadius: 6 }}
          />
          <button className="counter" type="submit" disabled={loading}>
            Add
          </button>
        </form>

        {error ? (
          <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>
        ) : null}

        {loading ? <p style={{ marginTop: 12 }}>Loading...</p> : null}

        <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
          {items.map((t) => (
            <li
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '10px 12px',
                border: '1px solid var(--border)',
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  textDecoration: t.isDone ? 'line-through' : 'none',
                }}
              >
                {t.title}
              </span>
              <button className="counter" onClick={() => toggleDone(t)}>
                {t.isDone ? 'Undone' : 'Done'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

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

  const page = path === '/about' ? <AboutPage /> : <TasksPage apiBaseUrl={apiBaseUrl} />

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
            Tasks
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
