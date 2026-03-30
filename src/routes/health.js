const express = require('express')

const router = express.Router()

// Requirement: Endpoint /health returns exactly {"status":"ok"}
router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

module.exports = { router }
