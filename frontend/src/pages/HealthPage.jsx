import { useEffect, useState } from 'react'

export default function HealthPage({ apiBaseUrl }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [payload, setPayload] = useState(null)
  const [checkedAt, setCheckedAt] = useState('')

  async function check() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${apiBaseUrl}/health`)
      if (!res.ok) throw new Error(`GET /health failed (${res.status})`)
      const data = await res.json()
      setPayload(data)
      setCheckedAt(new Date().toLocaleString())
    } catch (e) {
      setPayload(null)
      setError(e?.message || 'Health check failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    check()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl])

  return (
    <section id="center">
      <div style={{ width: 'min(760px, 100%)' }}>
        <h1>Health Check</h1>
        <div className="card" style={{ textAlign: 'left' }}>
          <p>
            Backend: <code>{apiBaseUrl}</code>
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
            <button className="counter" type="button" onClick={check} disabled={loading}>
              Check now
            </button>
            {checkedAt ? <span className="muted">Last checked: {checkedAt}</span> : null}
          </div>

          {loading ? <p style={{ marginTop: 12 }}>Loading...</p> : null}
          {error ? (
            <p className="fieldError" style={{ marginTop: 12 }}>
              {error}
            </p>
          ) : null}
          {payload ? (
            <div style={{ marginTop: 12 }}>
              <p>
                Response: <code>{JSON.stringify(payload)}</code>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
