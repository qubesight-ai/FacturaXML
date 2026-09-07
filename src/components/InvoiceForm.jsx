import React, { useState } from 'react'

function emptyItem() {
  return { description: '', qty: 1, price: 0 }
}

export default function InvoiceForm({ onAddInvoice }) {
  const [number, setNumber] = useState('')
  const [client, setClient] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [taxRate, setTaxRate] = useState(0.12)
  const [items, setItems] = useState([emptyItem()])
  const [errors, setErrors] = useState({})

  function handleItemChange(index, field, value) {
    setItems(prev => prev.map((it, i) => i === index ? { ...it, [field]: value } : it))
  }

  function addItem() {
    setItems(prev => [...prev, emptyItem()])
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function validate() {
    const e = {}
    if (!number.trim()) e.number = 'Número requerido'
    if (!client.trim()) e.client = 'Cliente requerido'
    const validItems = items.filter(it => it.description.trim() && Number(it.qty) > 0 && Number(it.price) >= 0)
    if (validItems.length === 0) e.items = 'Agregar al menos un ítem válido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    const inv = {
      id: Date.now(),
      number,
      client,
      date,
      taxRate: Number(taxRate),
      items: items.map(it => ({ description: it.description, qty: Number(it.qty), price: Number(it.price) }))
    }
    onAddInvoice(inv)
    // reset
    setNumber('')
    setClient('')
    setDate(new Date().toISOString().slice(0, 10))
    setTaxRate(0.12)
    setItems([emptyItem()])
    setErrors({})
  }

  return (
    <form className="invoice-form" onSubmit={handleSubmit}>
      <h2>Crear Factura</h2>
      <div className="field-row">
        <label>Número</label>
        <input value={number} onChange={e => setNumber(e.target.value)} />
        {errors.number && <small className="error">{errors.number}</small>}
      </div>
      <div className="field-row">
        <label>Cliente</label>
        <input value={client} onChange={e => setClient(e.target.value)} />
        {errors.client && <small className="error">{errors.client}</small>}
      </div>
      <div className="field-row">
        <label>Fecha</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div className="field-row">
        <label>Impuesto (ej. IVA) %</label>
        <input type="number" step="0.01" value={taxRate} onChange={e => setTaxRate(e.target.value)} />
      </div>

      <h3>Ítems</h3>
      {items.map((it, idx) => (
        <div className="item-row" key={idx}>
          <input placeholder="Descripción" value={it.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} />
          <input type="number" min="0" placeholder="Cantidad" value={it.qty} onChange={e => handleItemChange(idx, 'qty', e.target.value)} />
          <input type="number" step="0.01" min="0" placeholder="Precio" value={it.price} onChange={e => handleItemChange(idx, 'price', e.target.value)} />
          <button type="button" className="remove" onClick={() => removeItem(idx)}>Eliminar</button>
        </div>
      ))}
      {errors.items && <small className="error">{errors.items}</small>}
      <div className="actions">
        <button type="button" onClick={addItem}>Agregar ítem</button>
        <button type="submit">Crear factura</button>
      </div>
    </form>
  )
}
