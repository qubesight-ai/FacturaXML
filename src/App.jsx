import React, { useState } from 'react'
import InvoiceForm from './components/InvoiceForm'
import InvoiceList from './components/InvoiceList'
import Invoice from './components/Invoice'

export default function App() {
  const [invoices, setInvoices] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  function addInvoice(inv) {
    setInvoices(prev => [...prev, inv])
    setSelectedId(inv.id)
  }

  function selectInvoice(id) {
    setSelectedId(id)
  }

  function addExampleInvoice() {
    const example = {
      id: Date.now(),
      number: 'F-001',
      client: 'Juan Pérez',
      date: new Date().toISOString().slice(0, 10),
      taxRate: 0.12,
      items: [
        { description: 'Teclado', qty: 2, price: 25 },
        { description: 'Monitor', qty: 1, price: 180 },
        { description: 'Mouse', qty: 3, price: 12 }
      ]
    }
    // calculated fields are derived in the Invoice view
    addInvoice(example)
  }

  const selectedInvoice = invoices.find(i => i.id === selectedId) || null

  return (
    <div className="app-container">
      <header>
        <h1>Sistema de Manipulación de Facturas</h1>
      </header>
      <main>
        <section className="left">
          <InvoiceForm onAddInvoice={addInvoice} />
          <button className="example-btn" onClick={addExampleInvoice}>Cargar factura de ejemplo</button>
        </section>
        <section className="right">
          <InvoiceList invoices={invoices} onSelect={selectInvoice} selectedId={selectedId} />
          <div className="viewer">
            {selectedInvoice ? (
              <Invoice invoice={selectedInvoice} />
            ) : (
              <p>No hay factura seleccionada.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
