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
      <div className="invoice-actions" style={{display:'flex',gap:8,justifyContent:'flex-end',marginBottom:8}}>
        <button onClick={() => {
          const html = document.getElementById('invoice-html')?.outerHTML || document.querySelector('.invoice')?.outerHTML
          const blob = new Blob([`<html><head><meta charset="utf-8"><title>Factura-${invoice.number}</title></head><body>${html}</body></html>`], { type: 'text/html' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `Factura-${invoice.number}.html`
          document.body.appendChild(a)
          a.click()
          a.remove()
          URL.revokeObjectURL(url)
        }}>Descargar HTML</button>
        <button onClick={() => {
          const content = document.querySelector('.invoice')?.outerHTML
          const w = window.open('', '_blank')
          if (!w) return
          w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Factura ${invoice.number}</title><style>body{font-family:Arial, Helvetica, sans-serif;padding:20px}</style></head><body>${content}</body></html>`)
          w.document.close()
          w.focus()
          setTimeout(() => w.print(), 300)
        }}>Imprimir (PDF)</button>
      </div>
      <header className="inv-header">
        <div className="issuer">
          <h3>TechStore S.A.</h3>
          <div>Dirección: Calle Falsa 123</div>
          <div>RUC: 123456789</div>
        </div>
        <div className="meta">
          <div><strong>Factura:</strong> {invoice.number}</div>
          <div><strong>Cliente:</strong> {invoice.client}</div>
          <div><strong>Fecha:</strong> {new Date(invoice.date).toLocaleDateString()}</div>
        </div>
      </header>

      <table className="items" id="invoice-html">
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
