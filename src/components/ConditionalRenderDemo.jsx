import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ConditionalRenderDemo() {
  const [mostrar, setMostrar] = useState(false)

  return (
    <div className="demo-page">
      <header className="demo-header">
        <nav className="top-nav">
          <Link to="/">Facturas</Link>
          <Link to="/conditional-render">Renderizado condicional</Link>
        </nav>
        <h1>Renderizado condicional</h1>
      </header>

      <section className="demo-card">
        <button onClick={() => setMostrar(!mostrar)}>
          {mostrar ? 'Ocultar contenido' : 'Mostrar contenido'}
        </button>

        <div className="demo-content">
          {mostrar ? (
            <p className="demo-success">
              La variable <strong>mostrar</strong> está en <strong>true</strong> y por eso se renderiza este texto.
            </p>
          ) : (
            <p className="demo-muted">
              La variable <strong>mostrar</strong> está en <strong>false</strong>, así que todavía no se ve el contenido.
            </p>
          )}

          {mostrar && (
            <div className="demo-badge">
              Este bloque solo aparece cuando la condición es verdadera.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
