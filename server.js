const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3001
const DATA_FILE = path.join(__dirname, 'db.json')

app.use(cors())
app.use(express.json())

function readDb() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8')
  return JSON.parse(raw)
}

function writeDb(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

app.get('/api/invoices', (req, res) => {
  const db = readDb()
  res.json(db.invoices || [])
})

app.post('/api/invoices', (req, res) => {
  const db = readDb()
  const invoice = req.body

  if (!invoice || !invoice.number || !invoice.client || !Array.isArray(invoice.items) || invoice.items.length === 0) {
    return res.status(400).json({ message: 'Factura inválida' })
  }

  const nextInvoice = {
    ...invoice,
    id: invoice.id || Date.now()
  }

  db.invoices = [...(db.invoices || []), nextInvoice]
  writeDb(db)
  res.status(201).json(nextInvoice)
})

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`)
})
