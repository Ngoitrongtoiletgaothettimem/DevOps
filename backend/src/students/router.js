const express = require('express')

const { pool } = require('../db')
const { validateStudent } = require('./validateStudent')

const router = express.Router()

function toInt(value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) ? Math.trunc(n) : fallback
}

router.get('/api/students', async (req, res, next) => {
  try {
    const q = String(req.query?.q || '').trim()
    const page = Math.max(1, toInt(req.query?.page, 1))
    const pageSize = Math.min(50, Math.max(1, toInt(req.query?.pageSize, 5)))

    const where = q ? 'WHERE full_name LIKE ? OR mssv LIKE ? OR email LIKE ?' : ''
    const like = `%${q}%`
    const params = q ? [like, like, like] : []

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM students ${where}`,
      params,
    )
    const total = Number(countRows?.[0]?.total || 0)

    const offset = (page - 1) * pageSize
    const [rows] = await pool.query(
      `SELECT id, full_name AS fullName, mssv, email, gpa, status, created_at AS createdAt
       FROM students
       ${where}
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset],
    )

    res.json({ items: rows, total, page, pageSize })
  } catch (err) {
    next(err)
  }
})

router.get('/api/students/stats', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        COUNT(*) AS total,
        SUM(status = 'active') AS active,
        SUM(status = 'inactive') AS inactive,
        AVG(gpa) AS avgGpa
      FROM students`,
    )

    const r = rows?.[0] || {}
    res.json({
      total: Number(r.total || 0),
      active: Number(r.active || 0),
      inactive: Number(r.inactive || 0),
      avgGpa: r.avgGpa === null || typeof r.avgGpa === 'undefined' ? 0 : Number(r.avgGpa),
    })
  } catch (err) {
    next(err)
  }
})

router.get('/api/students/:id', async (req, res, next) => {
  try {
    const id = toInt(req.params.id, NaN)
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'invalid id' })
    }

    const [rows] = await pool.query(
      'SELECT id, full_name AS fullName, mssv, email, gpa, status, created_at AS createdAt FROM students WHERE id = ?',
      [id],
    )

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'not found' })
    }

    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

router.post('/api/students', async (req, res, next) => {
  try {
    const v = validateStudent(req.body)
    if (!v.ok) {
      return res.status(400).json({ message: 'validation failed', errors: v.errors })
    }

    const fullName = String(req.body.fullName).trim()
    const mssv = String(req.body.mssv).trim()
    const email = String(req.body.email).trim()
    const gpa = Number(req.body.gpa)
    const status = req.body.status

    const [result] = await pool.execute(
      'INSERT INTO students (full_name, mssv, email, gpa, status) VALUES (?, ?, ?, ?, ?)',
      [fullName, mssv, email, gpa, status],
    )

    const [rows] = await pool.query(
      'SELECT id, full_name AS fullName, mssv, email, gpa, status, created_at AS createdAt FROM students WHERE id = ?',
      [result.insertId],
    )

    res.status(201).json(rows[0])
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'duplicate mssv or email' })
    }
    next(err)
  }
})

router.put('/api/students/:id', async (req, res, next) => {
  try {
    const id = toInt(req.params.id, NaN)
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'invalid id' })
    }

    const v = validateStudent(req.body)
    if (!v.ok) {
      return res.status(400).json({ message: 'validation failed', errors: v.errors })
    }

    const fullName = String(req.body.fullName).trim()
    const mssv = String(req.body.mssv).trim()
    const email = String(req.body.email).trim()
    const gpa = Number(req.body.gpa)
    const status = req.body.status

    const [result] = await pool.execute(
      'UPDATE students SET full_name = ?, mssv = ?, email = ?, gpa = ?, status = ? WHERE id = ?',
      [fullName, mssv, email, gpa, status, id],
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'not found' })
    }

    const [rows] = await pool.query(
      'SELECT id, full_name AS fullName, mssv, email, gpa, status, created_at AS createdAt FROM students WHERE id = ?',
      [id],
    )

    res.json(rows[0])
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'duplicate mssv or email' })
    }
    next(err)
  }
})

router.delete('/api/students/:id', async (req, res, next) => {
  try {
    const id = toInt(req.params.id, NaN)
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'invalid id' })
    }

    const [result] = await pool.execute('DELETE FROM students WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'not found' })
    }

    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

module.exports = { router }
