const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')

async function render() {
  const root = path.resolve(__dirname, '..')
  const invoicePath = path.join(root, 'evidence', 'example-invoice.json')
  const cssPath = path.join(root, 'src', 'index.css')
  const outDir = path.join(root, 'evidence', 'screenshots')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const invoice = JSON.parse(fs.readFileSync(invoicePath, 'utf8'))
  const css = fs.readFileSync(cssPath, 'utf8')

  function currency(v){return `$${v.toFixed(2)}`}
  const subtotal = invoice.items.reduce((s, it) => s + it.qty * it.price, 0)
  const tax = subtotal * (invoice.taxRate || 0)
  const total = subtotal + tax

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Factura ${invoice.number}</title><style>${css}</style></head><body><div class="invoice">`+
    `<header class="inv-header"><div class="issuer"><h3>TechStore S.A.</h3><div>Dirección: Calle Falsa 123</div><div>RUC: 123456789</div></div><div class="meta"><div><strong>Factura:</strong> ${invoice.number}</div><div><strong>Cliente:</strong> ${invoice.client}</div><div><strong>Fecha:</strong> ${invoice.date}</div></div></header>`+
    `<table class="items"><thead><tr><th>Descripción</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead><tbody>`+
    invoice.items.map(it => `<tr><td>${it.description}</td><td>${it.qty}</td><td>${currency(it.price)}</td><td>${currency(it.qty*it.price)}</td></tr>`).join('')+
    `</tbody></table><div class="totals"><div><span>Subtotal:</span><span>${currency(subtotal)}</span></div><div><span>Impuesto (${(invoice.taxRate*100).toFixed(0)}%):</span><span>${currency(tax)}</span></div><div class="total"><span>Total:</span><span>${currency(total)}</span></div></div></div></body></html>`

  const htmlPath = path.join(outDir, 'invoice-example.html')
  fs.writeFileSync(htmlPath, html, 'utf8')

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1000, height: 1400 } })
  await page.goto('file://' + htmlPath)
  await page.waitForTimeout(500)
  const pngPath = path.join(outDir, 'invoice-example.png')
  await page.screenshot({ path: pngPath, fullPage: true })
  await browser.close()
  console.log('Screenshot written to', pngPath)
}

render().catch(err => { console.error(err); process.exit(1) })
