export function validateStudent(input) {
  const errors = {}
  const fullName = String(input.fullName || '').trim()
  const mssv = String(input.mssv || '').trim()
  const email = String(input.email || '').trim()
  const gpaRaw = String(input.gpa ?? '').trim()
  const status = input.status

  if (fullName.length < 2) errors.fullName = 'Vui lòng nhập họ tên (>= 2 ký tự).'
  if (!/^\d{6,}$/.test(mssv)) errors.mssv = 'MSSV chỉ gồm số và tối thiểu 6 chữ số.'
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Email không hợp lệ.'

  const gpa = Number(gpaRaw)
  if (!Number.isFinite(gpa)) errors.gpa = 'GPA phải là số.'
  else if (gpa < 0 || gpa > 4) errors.gpa = 'GPA phải trong khoảng 0 đến 4.'

  if (status !== 'active' && status !== 'inactive') errors.status = 'Trạng thái không hợp lệ.'

  return { ok: Object.keys(errors).length === 0, errors }
}
