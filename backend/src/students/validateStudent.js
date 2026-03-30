function validateStudent(input) {
  const errors = {}
  const fullName = String(input?.fullName || '').trim()
  const mssv = String(input?.mssv || '').trim()
  const email = String(input?.email || '').trim()
  const status = input?.status

  const gpa = Number(input?.gpa)

  if (fullName.length < 2) errors.fullName = 'fullName must be at least 2 chars'
  if (!/^\d{6,}$/.test(mssv)) errors.mssv = 'mssv must be digits with length >= 6'
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'email is invalid'

  if (!Number.isFinite(gpa)) errors.gpa = 'gpa must be a number'
  else if (gpa < 0 || gpa > 4) errors.gpa = 'gpa must be between 0 and 4'

  if (status !== 'active' && status !== 'inactive') errors.status = 'status must be active|inactive'

  return { ok: Object.keys(errors).length === 0, errors }
}

module.exports = { validateStudent }
