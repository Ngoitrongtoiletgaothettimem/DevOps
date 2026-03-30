import { useEffect, useState } from 'react'

export default function StatsPage({ apiBaseUrl }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)

  async function load() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${apiBaseUrl}/api/students/stats`)
      if (!res.ok) throw new Error(`GET /api/students/stats failed (${res.status})`)
      const data = await res.json()
      setStats(data)
    } catch (e) {
      setStats(null)
      setError(e?.message || 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl])

  return (
    <section id="center">
      <div style={{ width: 'min(980px, 100%)' }}>
        <h1>Thống kê</h1>

        <div className="card" style={{ textAlign: 'left', marginBottom: 16 }}>
          <p>
            Backend: <code>{apiBaseUrl}</code>
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
            <button className="counter" type="button" onClick={load} disabled={loading}>
              Reload
            </button>
          </div>
          {loading ? <p style={{ marginTop: 12 }}>Loading...</p> : null}
          {error ? (
            <p className="fieldError" style={{ marginTop: 12 }}>
              {error}
            </p>
          ) : null}
        </div>

        {stats ? (
          <div className="statsGrid">
            <div className="card" style={{ textAlign: 'left' }}>
              <h2>Tổng số sinh viên</h2>
              <div className="statValue">{stats.total}</div>
            </div>
            <div className="card" style={{ textAlign: 'left' }}>
              <h2>Trạng thái</h2>
              <p>
                Active: <strong>{stats.active}</strong>
              </p>
              <p>
                Inactive: <strong>{stats.inactive}</strong>
              </p>
            </div>
            <div className="card" style={{ textAlign: 'left' }}>
              <h2>GPA trung bình</h2>
              <div className="statValue">{Number(stats.avgGpa || 0).toFixed(2)}</div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
