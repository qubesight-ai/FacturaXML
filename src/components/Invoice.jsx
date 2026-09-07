import React from 'react'

function currency(v) {
  return `$${v.toFixed(2)}`
}

export default function Invoice({ invoice }) {
  const subtotal = invoice.items.reduce((s, it) => s + it.qty * it.price, 0)
  const tax = subtotal * (invoice.taxRate || 0)
  const total = subtotal + tax

  return (
    <div className="invoice">
      <header className="inv-header">
        <div className="issuer">
          <h3>TechStore S.A.</h3>
          <div>Dirección: Calle Falsa 123</div>
          <div>RUC: 123456789</div>
        </div>
        <div className="meta">
          <div><strong>Factura:</strong> {invoice.number}</div>
          <div><strong>Cliente:</strong> {invoice.client}</div>
          <div><strong>Fecha:</strong> {invoice.date}</div>
        </div>
      </header>

      <table className="items">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((it, i) => (
            <tr key={i}>
              <td>{it.description}</td>
              <td>{it.qty}</td>
              <td>{currency(it.price)}</td>
              <td>{currency(it.qty * it.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals">
        <div><span>Subtotal:</span><span>{currency(subtotal)}</span></div>
        <div><span>Impuesto ({(invoice.taxRate * 100).toFixed(0)}%):</span><span>{currency(tax)}</span></div>
        <div className="total"><span>Total:</span><span>{currency(total)}</span></div>
      </div>
    </div>
  )
}
