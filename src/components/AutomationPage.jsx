import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import WorkflowDiagram from './WorkflowDiagram'

const initialMessage = 'Pulsa el botón para iniciar el registro automático de una factura.'

export default function AutomationPage() {
  const [automationState, setAutomationState] = useState('inactivo')
  const [automationMessage, setAutomationMessage] = useState(initialMessage)
  const [pendingRun, setPendingRun] = useState(null)
  const [simulateError, setSimulateError] = useState(false)

  useEffect(() => {
    if (!pendingRun) return undefined

    const timerId = setTimeout(() => {
      if (pendingRun.simulateError) {
        setAutomationState('error')
        setAutomationMessage('La API simuló un error. Corrige el problema y ejecuta el flujo nuevamente.')
      } else {
        setAutomationState('exito')
        setAutomationMessage('Factura validada, clasificada y registrada correctamente.')
      }
      setPendingRun(null)
    }, 1200)

    return () => clearTimeout(timerId)
  }, [pendingRun])

  function runAutomation() {
    if (automationState === 'ejecutando') return
    setAutomationState('ejecutando')
    setAutomationMessage('Procesando: validando datos, clasificando la factura y conectando con la API...')
    setPendingRun({ simulateError })
  }

  return (
    <div className="automation-page">
      <header className="topbar">
        <div className="brand">📄 Barry Facturas</div>
        <nav className="main-nav" aria-label="Navegación principal">
          <NavLink to="/" end className="nav-btn nav-primary"><span aria-hidden="true">📊</span> Dashboard</NavLink>
          <NavLink to="/automation" className="nav-btn nav-flow"><span aria-hidden="true">⚡</span> Automatización</NavLink>
          <NavLink to="/conditional-render" className="nav-btn"><span aria-hidden="true">⚙️</span> Renderizado condicional</NavLink>
        </nav>
      </header>

      <main className="automation-content">
        <div className="automation-intro">
          <span className="eyebrow dark-eyebrow">Laboratorio de React</span>
          <h1>Automatización de registro de facturas</h1>
          <p>Esta página demuestra un flujo que recibe un evento, procesa una tarea asíncrona y decide si termina en éxito o error.</p>
        </div>

        <WorkflowDiagram state={automationState} message={automationMessage} />

        <section className="automation-controls" aria-labelledby="controls-title">
          <div>
            <span className="eyebrow dark-eyebrow">Disparador manual</span>
            <h2 id="controls-title">Probar la automatización</h2>
            <p>El botón representa el envío de una factura al sistema. El procesamiento se ejecuta automáticamente durante 1,2 segundos.</p>
          </div>
          <label className="error-toggle">
            <input type="checkbox" checked={simulateError} onChange={event => setSimulateError(event.target.checked)} disabled={automationState === 'ejecutando'} />
            Simular respuesta de error
          </label>
          <button className="run-automation" onClick={runAutomation} disabled={automationState === 'ejecutando'}>
            {automationState === 'ejecutando' ? 'Procesando...' : 'Ejecutar automatización'}
          </button>
        </section>

        <section className="instructions-panel" aria-labelledby="instructions-title">
          <div>
            <span className="eyebrow dark-eyebrow">Guía rápida</span>
            <h2 id="instructions-title">Instrucciones de uso</h2>
          </div>
          <ol>
            <li>Abre <strong>Automatización</strong> desde el menú superior.</li>
            <li>Observa el diagrama y pulsa <strong>Ejecutar automatización</strong>.</li>
            <li>Comprueba la transición de <strong>Inactivo</strong> a <strong>En ejecución</strong> y después a <strong>Éxito</strong>.</li>
            <li>Activa <strong>Simular respuesta de error</strong> para comprobar la ruta alternativa.</li>
            <li>Regresa a <strong>Dashboard</strong> para crear y registrar facturas reales mediante el mismo flujo.</li>
          </ol>
        </section>
      </main>
    </div>
  )
}