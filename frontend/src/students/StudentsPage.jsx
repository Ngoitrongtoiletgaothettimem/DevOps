import { useEffect, useMemo, useState } from 'react'

import Modal from '../shared/Modal.jsx'
import { validateStudent } from './validateStudent.js'

const PAGE_SIZE = 5

export default function StudentsPage({ apiBaseUrl }) {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    mssv: '',
    email: '',
    gpa: '0',
    status: 'active',
  })
  const [formErrors, setFormErrors] = useState({})

  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [editErrors, setEditErrors] = useState({})

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(pageCount, Math.max(1, page))

  const queryString = useMemo(() => {
    const sp = new URLSearchParams()
    if (query.trim()) sp.set('q', query.trim())
    sp.set('page', String(currentPage))
    sp.set('pageSize', String(PAGE_SIZE))
    return sp.toString()
  }, [query, currentPage])

  async function load() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${apiBaseUrl}/api/students?${queryString}`)
      if (!res.ok) throw new Error(`GET /api/students failed (${res.status})`)
      const data = await res.json()
      setItems(Array.isArray(data.items) ? data.items : [])
      setTotal(Number.isFinite(Number(data.total)) ? Number(data.total) : 0)
      setPage(Number.isFinite(Number(data.page)) ? Number(data.page) : currentPage)
    } catch (e) {
      setItems([])
      setTotal(0)
      setError(e?.message || 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl, queryString])

  async function createStudent(e) {
    e.preventDefault()
    const v = validateStudent(form)
    if (!v.ok) {
      setFormErrors(v.errors)
      return
    }

    setFormErrors({})
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${apiBaseUrl}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          mssv: form.mssv.trim(),
          email: form.email.trim(),
          gpa: Number(form.gpa),
          status: form.status,
        }),
      })
      if (!res.ok) throw new Error(`POST /api/students failed (${res.status})`)
      setForm({ fullName: '', mssv: '', email: '', gpa: '0', status: 'active' })
      setPage(1)
      await load()
    } catch (e2) {
      setError(e2?.message || 'Failed to create student')
      setLoading(false)
    }
  }

  function startEdit(student) {
    setEditing(student)
    setEditErrors({})
    setEditForm({
      fullName: student.fullName,
      mssv: student.mssv,
      email: student.email,
      gpa: String(student.gpa),
      status: student.status,
    })
  }

  async function saveEdit(e) {
    e.preventDefault()
    if (!editing || !editForm) return

    const v = validateStudent(editForm)
    if (!v.ok) {
      setEditErrors(v.errors)
      return
    }

    setEditErrors({})
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${apiBaseUrl}/api/students/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: editForm.fullName.trim(),
          mssv: editForm.mssv.trim(),
          email: editForm.email.trim(),
          gpa: Number(editForm.gpa),
          status: editForm.status,
        }),
      })
      if (!res.ok) throw new Error(`PUT /api/students/${editing.id} failed (${res.status})`)
      setEditing(null)
      setEditForm(null)
      await load()
    } catch (e2) {
      setError(e2?.message || 'Failed to update student')
      setLoading(false)
    }
  }

  async function deleteStudent(student) {
    const ok = window.confirm(`Xóa sinh viên "${student.fullName}"?`)
    if (!ok) return

    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${apiBaseUrl}/api/students/${student.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`DELETE /api/students/${student.id} failed (${res.status})`)
      await load()
    } catch (e) {
      setError(e?.message || 'Failed to delete student')
      setLoading(false)
    }
  }

  return (
    <section id="center">
      <div style={{ width: 'min(980px, 100%)' }}>
        <h1>Quản lý sinh viên</h1>

        <div className="grid2">
          <div className="card" style={{ textAlign: 'left' }}>
            <h2>Thêm sinh viên</h2>
            <form onSubmit={createStudent} className="formGrid">
              <label className="field">
                <span>Họ tên</span>
                <input
                  className="input"
                  value={form.fullName}
                  onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                  placeholder="Nguyễn Văn A"
                />
                {formErrors.fullName ? <div className="fieldError">{formErrors.fullName}</div> : null}
              </label>

              <label className="field">
                <span>MSSV</span>
                <input
                  className="input"
                  value={form.mssv}
                  onChange={(e) => setForm((p) => ({ ...p, mssv: e.target.value }))}
                  placeholder="2251220064"
                />
                {formErrors.mssv ? <div className="fieldError">{formErrors.mssv}</div> : null}
              </label>

              <label className="field">
                <span>Email</span>
                <input
                  className="input"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="sv@example.com"
                />
                {formErrors.email ? <div className="fieldError">{formErrors.email}</div> : null}
              </label>

              <label className="field">
                <span>GPA</span>
                <input
                  className="input"
                  value={form.gpa}
                  onChange={(e) => setForm((p) => ({ ...p, gpa: e.target.value }))}
                  inputMode="decimal"
                  placeholder="0 - 4"
                />
                {formErrors.gpa ? <div className="fieldError">{formErrors.gpa}</div> : null}
              </label>

              <label className="field">
                <span>Trạng thái</span>
                <select
                  className="input"
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {formErrors.status ? <div className="fieldError">{formErrors.status}</div> : null}
              </label>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="counter" type="submit" disabled={loading}>
                  Thêm
                </button>
                <span className="muted">Validation đầy đủ các trường</span>
              </div>
            </form>
          </div>

          <div className="card" style={{ textAlign: 'left' }}>
            <h2>Danh sách sinh viên</h2>
            <div className="toolbar">
              <input
                className="input"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                placeholder="Tìm theo tên, MSSV hoặc email..."
              />
              <div className="pill">{total}</div>
            </div>

            {error ? (
              <p className="fieldError" style={{ marginTop: 12 }}>
                {error}
              </p>
            ) : null}
            {loading ? <p style={{ marginTop: 12 }}>Loading...</p> : null}

            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>MSSV</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>GPA</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: 'right' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="muted" style={{ padding: 12 }}>
                        Không có sinh viên.
                      </td>
                    </tr>
                  ) : null}

                  {items.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <code>{s.mssv}</code>
                      </td>
                      <td>{s.fullName}</td>
                      <td>{s.email}</td>
                      <td>{Number(s.gpa || 0).toFixed(2)}</td>
                      <td>
                        <span className="pill">{s.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 8 }}>
                          <button className="counter" type="button" onClick={() => startEdit(s)}>
                            Sửa
                          </button>
                          <button className="counter" type="button" onClick={() => deleteStudent(s)}>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                className="counter"
                type="button"
                onClick={() => setPage((p) => Math.max(1, Math.min(pageCount, p - 1)))}
                disabled={loading}
              >
                Prev
              </button>
              <div className="muted">
                Page {currentPage} / {pageCount}
              </div>
              <button
                className="counter"
                type="button"
                onClick={() => setPage((p) => Math.max(1, Math.min(pageCount, p + 1)))}
                disabled={loading}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {editing && editForm ? (
          <Modal title="Cập nhật sinh viên" onClose={() => (setEditing(null), setEditForm(null))}>
            <form onSubmit={saveEdit} className="formGrid" style={{ textAlign: 'left' }}>
              <label className="field">
                <span>Họ tên</span>
                <input
                  className="input"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))}
                />
                {editErrors.fullName ? <div className="fieldError">{editErrors.fullName}</div> : null}
              </label>

              <label className="field">
                <span>MSSV</span>
                <input
                  className="input"
                  value={editForm.mssv}
                  onChange={(e) => setEditForm((p) => ({ ...p, mssv: e.target.value }))}
                />
                {editErrors.mssv ? <div className="fieldError">{editErrors.mssv}</div> : null}
              </label>

              <label className="field">
                <span>Email</span>
                <input
                  className="input"
                  value={editForm.email}
                  onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                />
                {editErrors.email ? <div className="fieldError">{editErrors.email}</div> : null}
              </label>

              <label className="field">
                <span>GPA</span>
                <input
                  className="input"
                  value={editForm.gpa}
                  onChange={(e) => setEditForm((p) => ({ ...p, gpa: e.target.value }))}
                  inputMode="decimal"
                />
                {editErrors.gpa ? <div className="fieldError">{editErrors.gpa}</div> : null}
              </label>

              <label className="field">
                <span>Trạng thái</span>
                <select
                  className="input"
                  value={editForm.status}
                  onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {editErrors.status ? <div className="fieldError">{editErrors.status}</div> : null}
              </label>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="counter" type="submit" disabled={loading}>
                  Lưu
                </button>
                <button
                  className="counter"
                  type="button"
                  onClick={() => (setEditing(null), setEditForm(null))}
                  disabled={loading}
                >
                  Hủy
                </button>
              </div>
            </form>
          </Modal>
        ) : null}
      </div>
    </section>
  )
}
