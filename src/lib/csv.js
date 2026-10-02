// Plain CSV helpers (no dependencies). Kept free of React/DOM so they're easy to test.

// Spreadsheet apps run cells starting with these characters as formulas, so
// text that begins with one is prefixed with an apostrophe to keep it as text.
const FORMULA_START = /^[=+\-@\t\r]/

export function csvCell(value) {
  if (value === null || value === undefined) return ''
  let text = String(value)
  if (typeof value === 'string' && FORMULA_START.test(text)) text = `'${text}`
  if (/[",\r\n]/.test(text)) text = `"${text.replace(/"/g, '""')}"`
  return text
}

export function toCsv(rows) {
  return rows.map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n'
}

// Column order is what the customer sees in Excel/Sheets. There is deliberately
// no phone column: we don't research or verify phone numbers.
const HEADER = [
  'Company',
  'Country',
  'City',
  'Website',
  'Decision maker',
  'Title',
  'Decision maker verified',
  'Contact email',
  'Lead score',
  'Email subject',
  'Email body',
]

export function leadsToCsv(leads) {
  const rows = leads.map((l) => [
    l.company_name,
    l.country,
    l.city,
    l.website,
    l.decision_maker_name,
    l.decision_maker_title,
    l.decision_maker_verified ? 'Yes' : 'No',
    l.contact_email,
    l.lead_score,
    l.email_subject,
    l.email_body,
  ])
  return toCsv([HEADER, ...rows])
}

export function csvFilename(companyName, date = new Date()) {
  const slug = (companyName || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return `leads-${slug || 'export'}-${date.toISOString().slice(0, 10)}.csv`
}

// Triggers a browser download. The leading BOM makes Excel read accents correctly.
export function downloadCsv(filename, csvText) {
  const blob = new Blob(['﻿', csvText], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
