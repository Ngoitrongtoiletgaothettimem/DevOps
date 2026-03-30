const mysql = require('mysql2/promise')

function buildConnectionConfig() {
  const dbUrl = process.env.DB_URL
  if (dbUrl && dbUrl.trim()) {
    return dbUrl
  }

  const host = process.env.DB_HOST || 'localhost'
  const port = Number(process.env.DB_PORT || 3306)
  const user = process.env.DB_USER || 'root'
  const password = process.env.DB_PASSWORD || ''
  const database = process.env.DB_NAME || 'devops'

  return {
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }
}

const pool = mysql.createPool(buildConnectionConfig())

async function healthCheckDb() {
  const [rows] = await pool.query('SELECT 1 AS ok')
  return rows?.[0]?.ok === 1
}

module.exports = { pool, healthCheckDb }
