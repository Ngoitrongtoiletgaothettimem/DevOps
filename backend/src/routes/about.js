const express = require('express')

const router = express.Router()

router.get('/about', (req, res) => {
  res.json({
    app: {
      name: process.env.APP_NAME || 'devops-project',
      version: process.env.APP_VERSION || '0.1.0',
    },
    student: {
      fullName: process.env.STUDENT_FULL_NAME || 'Nguyễn Ngọc Gia Hào',
      mssv: process.env.STUDENT_MSSV || '2251220064',
      className: process.env.STUDENT_CLASS || '22ct2',
    },
  })
})

module.exports = { router }
