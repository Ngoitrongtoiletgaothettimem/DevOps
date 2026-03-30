const express = require('express')

const { pool } = require('../db')

const router = express.Router()

router.get('/api/tasks', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, is_done AS isDone, created_at AS createdAt FROM tasks ORDER BY id DESC',
    )
    res.json({ items: rows })
  } catch (err) {
    next(err)
  }
})

router.post('/api/tasks', async (req, res, next) => {
  try {
    const title = (req.body?.title || '').toString().trim()
    if (!title) {
      return res.status(400).json({ message: 'title is required' })
    }

    const [result] = await pool.execute(
      'INSERT INTO tasks (title, is_done) VALUES (?, 0)',
      [title],
    )

    const [rows] = await pool.query(
      'SELECT id, title, is_done AS isDone, created_at AS createdAt FROM tasks WHERE id = ?',
      [result.insertId],
    )

    res.status(201).json(rows[0])
  } catch (err) {
    next(err)
  }
})

router.put('/api/tasks/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'invalid id' })
    }

    const isDone = Boolean(req.body?.isDone)

    const [result] = await pool.execute(
      'UPDATE tasks SET is_done = ? WHERE id = ?',
      [isDone ? 1 : 0, id],
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'not found' })
    }

    const [rows] = await pool.query(
      'SELECT id, title, is_done AS isDone, created_at AS createdAt FROM tasks WHERE id = ?',
      [id],
    )

    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

module.exports = { router }
