# Workflow de automatización

El flujo se activa cuando el usuario envía el formulario de una factura. Después de una espera breve que representa el procesamiento automático, la aplicación registra la factura mediante `fetch`. La respuesta de la API determina el camino de éxito o error.

```mermaid
flowchart TD
    A([Inicio]) --> B[Trigger: enviar formulario]
    B --> C[Estado: ejecutando]
    C --> D[Validar y clasificar factura]
    D --> E[Esperar 700 ms con setTimeout]
    E --> F[POST /api/invoices]
    F --> G{¿La API responde OK?}
    G -- Sí --> H[Estado: éxito]
    H --> I[Actualizar lista y seleccionar factura]
    I --> J([Fin])
    G -- No --> K[Estado: error]
    K --> L[Mostrar mensaje y solicitar reintento]
    L --> J
```

La limpieza del efecto cancela el temporizador con `clearTimeout` si el componente se desmonta o cambia la factura pendiente antes de completar el proceso.