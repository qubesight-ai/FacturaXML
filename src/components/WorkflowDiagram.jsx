import React from 'react'

const stateLabels = {
  inactivo: 'Inactivo',
  ejecutando: 'En ejecución',
  exito: 'Éxito',
  error: 'Error'
}

export default function WorkflowDiagram({ state, message }) {
  return (
    <section className={`workflow-panel workflow-${state}`} aria-labelledby="workflow-title">
      <div className="workflow-heading">
        <div>
          <span className="eyebrow">Automatización activa</span>
          <h2 id="workflow-title">Registro automático de facturas</h2>
        </div>
        <strong className="workflow-status">{stateLabels[state]}</strong>
      </div>
      <div className="workflow-track" aria-label="Diagrama del flujo de automatización">
        <div className="workflow-node start-node">Inicio</div>
        <span className="workflow-arrow" aria-hidden="true">→</span>
        <div className="workflow-node trigger-node">Trigger<br /><small>Enviar formulario</small></div>
        <span className="workflow-arrow" aria-hidden="true">→</span>
        <div className="workflow-node process-node">Proceso<br /><small>Validar + clasificar + guardar</small></div>
        <span className="workflow-arrow" aria-hidden="true">→</span>
        <div className="workflow-decision">¿API<br />responde?</div>
        <div className="workflow-branches">
          <div className="workflow-branch success-branch"><b>Sí</b> → Éxito: actualiza la lista</div>
          <div className="workflow-branch error-branch"><b>No</b> → Error: informa al usuario</div>
        </div>
      </div>
      <p className="workflow-message" role="status">{message}</p>
    </section>
  )
}