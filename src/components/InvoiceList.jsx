import React from 'react'

export default function InvoiceList({ invoices, onSelect, selectedId }) {
  return (
    <div className="invoice-list">
      <h2>Listado de Facturas</h2>
      {invoices.length === 0 ? (
        <p>No hay facturas registradas.</p>
      ) : (
        <ul>
          {invoices.map(inv => {
            const subtotal = inv.items.reduce((s, it) => s + it.qty * it.price, 0)
            const tax = subtotal * (inv.taxRate || 0)
            const total = subtotal + tax
            return (
              <li key={inv.id} className={inv.id === selectedId ? 'selected' : ''} onClick={() => onSelect(inv.id)}>
                <div><strong>{inv.number}</strong></div>
                <div>{inv.client}</div>
                <div>{inv.date}</div>
                <div>Total: ${total.toFixed(2)}</div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
