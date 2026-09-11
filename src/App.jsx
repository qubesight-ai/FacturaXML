import React, { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import InvoiceForm from './components/InvoiceForm'
import InvoiceList from './components/InvoiceList'
import Invoice from './components/Invoice'

const API_URL = 'http://localhost:3001/api/invoices'

function detectInvoiceCategory(items = []) {
  const text = (items || []).map(item => `${item.description || ''} ${item.category || ''}`).join(' ').toLowerCase()

  if (/(servicio|soporte|consult|desarrollo|mantenimiento|hosting|software|licencia|analisis)/i.test(text)) {
    return 'Servicios'
  }

  if (/(producto|equipo|monitor|teclado|mouse|laptop|impresora|cable|hardware|tablet)/i.test(text)) {
    return 'Productos'
  }

  if (/(alquiler|gasto|internet|agua|luz|transporte|publicidad|marketing|mobiliario)/i.test(text)) {
    return 'Gastos'
  }

  return 'General'
}

export default function App() {
  const [invoices, setInvoices] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [pendingInvoice, setPendingInvoice] = useState(null)
  const [automationState, setAutomationState] = useState('inactivo')
  const [automationMessage, setAutomationMessage] = useState('Esperando una factura para iniciar el flujo.')

  async function fetchInvoices() {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setInvoices(data)
      if (data.length > 0) {
        setSelectedId(data[0].id)
      }
    } catch (error) {
      console.error('Error loading invoices:', error)
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  useEffect(() => {
    if (!pendingInvoice) return undefined

    const timerId = setTimeout(async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pendingInvoice)
        })

        if (!response.ok) throw new Error('No se pudo registrar la factura')

        const saved = await response.json()
        setInvoices(prev => [...prev, saved])
        setSelectedId(saved.id)
        setAutomationState('exito')
        setAutomationMessage(`Factura ${saved.number} clasificada y registrada correctamente.`)
        setPendingInvoice(null)
      } catch (error) {
        console.error('Error in invoice automation:', error)
        setAutomationState('error')
        setAutomationMessage('No fue posible registrar la factura. Revisa que la API esté disponible e inténtalo de nuevo.')
        setPendingInvoice(null)
      }
    }, 700)

    return () => clearTimeout(timerId)
  }, [pendingInvoice])

  function addInvoice(inv) {
    setAutomationState('ejecutando')
    setAutomationMessage(`Procesando ${inv.number}: validando, clasificando y registrando...`)
    setPendingInvoice(inv)
  }

  function selectInvoice(id) {
    setSelectedId(id)
  }

  async function addExampleInvoice() {
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

    await addInvoice(example)
  }

  const categoryOptions = useMemo(() => {
    const categories = ['Todas', ...new Set(invoices.map(inv => inv.category || detectInvoiceCategory(inv.items)))]
    return categories
  }, [invoices])

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return invoices.filter(inv => {
      const category = inv.category || detectInvoiceCategory(inv.items)
      const matchesSearch = !normalizedSearch || (inv.client || '').toLowerCase().includes(normalizedSearch)
      const matchesCategory = selectedCategory === 'Todas' || category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [invoices, searchTerm, selectedCategory])

  const summary = useMemo(() => {
    const totalFacturas = filteredInvoices.length
    const totalFacturado = filteredInvoices.reduce((sum, inv) => {
      const subtotal = (inv.items || []).reduce((acc, item) => acc + Number(item.qty || 0) * Number(item.price || 0), 0)
      const tax = subtotal * (Number(inv.taxRate || 0))
      return sum + subtotal + tax
    }, 0)

    const promedio = totalFacturas ? totalFacturado / totalFacturas : 0
    const categoriaMasAlta = categoryOptions
      .filter(cat => cat !== 'Todas')
      .map(cat => ({
        name: cat,
        total: filteredInvoices.filter(inv => (inv.category || detectInvoiceCategory(inv.items)) === cat).length
      }))
      .sort((a, b) => b.total - a.total)[0]

    return {
      totalFacturas,
      totalFacturado,
      promedio,
      categoriaMasAlta: categoriaMasAlta ? categoriaMasAlta.name : 'Sin datos'
    }
  }, [filteredInvoices, categoryOptions])

  const selectedInvoice = filteredInvoices.find(i => i.id === selectedId) || invoices.find(i => i.id === selectedId) || null

  return (
    <div className="app-container">
      <header className="topbar">
        <div className="brand">📄 Barry Facturas</div>
        <nav className="main-nav" aria-label="Navegación principal">
          <NavLink to="/" end className="nav-btn nav-primary">
            <span aria-hidden="true">📊</span> Dashboard
          </NavLink>
          <NavLink to="/" className="nav-btn nav-flow">
            <span aria-hidden="true">⚡</span> Iniciar flujo empresarial
          </NavLink>
          <NavLink to="/conditional-render" className="nav-btn">
            <span aria-hidden="true">⚙️</span> Renderizado condicional
          </NavLink>
        </nav>
      </header>

      <header>
        <h1>Sistema de Manipulación de Facturas</h1>
      </header>

      <section className="dashboard-panel">
        <div className="dashboard-tools">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente"
            aria-label="Buscar por cliente"
          />
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} aria-label="Filtrar por categoría">
            {categoryOptions.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Facturas</span>
            <strong>{summary.totalFacturas}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total facturado</span>
            <strong>{summary.totalFacturado.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Promedio</span>
            <strong>{summary.promedio.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Categoría dominante</span>
            <strong>{summary.categoriaMasAlta}</strong>
          </div>
        </div>
      </section>

      <main>
        <section className="left">
          <InvoiceForm onAddInvoice={addInvoice} />
          <button className="example-btn" onClick={addExampleInvoice}>Cargar factura de ejemplo</button>
        </section>
        <section className="right">
          <InvoiceList invoices={filteredInvoices} onSelect={selectInvoice} selectedId={selectedId} />
          <div className="viewer">
            {loading ? (
              <p>Cargando facturas...</p>
            ) : selectedInvoice ? (
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
