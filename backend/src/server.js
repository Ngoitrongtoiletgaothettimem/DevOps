require('dotenv').config()

const express = require('express')
const cors = require('cors')

const { router: healthRouter } = require('./routes/health')
const { router: aboutRouter } = require('./routes/about')
const { router: tasksRouter } = require('./routes/tasks')
const { router: studentsRouter } = require('./students/router')
const { ensureStudentsSchema } = require('./students/schema')

const app = express()

const port = Number(process.env.PORT || 3000)

const corsOrigin = (process.env.CORS_ORIGIN || '').trim()
app.use(
  cors({
    origin: corsOrigin ? corsOrigin.split(',').map((s) => s.trim()) : true,
  }),
)

app.use(express.json())

app.use(healthRouter)
app.use(aboutRouter)
app.use(tasksRouter)
app.use(studentsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

async function start() {
  try {
    await ensureStudentsSchema()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[students] schema init failed:', err)
  }

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`[${process.env.APP_NAME || 'app'}] Backend listening on :${port}`)
  })
}

start()
