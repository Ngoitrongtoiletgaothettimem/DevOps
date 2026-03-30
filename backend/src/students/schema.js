const { pool } = require('../db')

async function ensureStudentsSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      mssv VARCHAR(32) NOT NULL,
      email VARCHAR(255) NOT NULL,
      gpa DECIMAL(3,2) NOT NULL,
      status ENUM('active','inactive') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_students_mssv (mssv),
      UNIQUE KEY uq_students_email (email)
    );
  `)

  await pool.query(
    `INSERT IGNORE INTO students (full_name, mssv, email, gpa, status) VALUES
      ('Nguyen Van A', '20240001', 'a@student.devops.local', 3.20, 'active'),
      ('Tran Thi B',   '20240002', 'b@student.devops.local', 3.80, 'active'),
      ('Le Van C',     '20240003', 'c@student.devops.local', 2.50, 'inactive');`,
  )
}

module.exports = { ensureStudentsSchema }
