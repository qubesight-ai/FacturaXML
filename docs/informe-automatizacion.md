# Informe: automatización del registro de facturas

## Qué automatiza

La aplicación automatiza el registro de una factura empresarial. El usuario solo completa y envía el formulario; desde ese momento React coordina la validación de los datos, la clasificación automática por tipo de ítems, el envío a la API y la actualización del dashboard. Esto representa un flujo real de recepción y registro de documentos sin que el usuario tenga que ejecutar cada paso manualmente.

## Disparador y workflow

El disparador es el evento `submit` del componente reutilizable `InvoiceForm`. El formulario valida número, cliente, cantidad, precio e ítems. Si los datos son válidos, crea el objeto de factura y lo entrega a `App` mediante la prop `onAddInvoice`.

El flujo tiene estos estados:

- **Inactivo:** no hay una factura pendiente.
- **En ejecución:** existe una factura pendiente y se está procesando.
- **Éxito:** la API respondió correctamente y la factura aparece en el listado.
- **Error:** la API no respondió correctamente; la interfaz informa el problema para que el usuario pueda reintentar.

El diagrama completo está en [workflow.md](./workflow.md) y también se muestra visualmente en el dashboard.

## Implementación técnica

En `App.jsx`, `useState` mantiene la lista de facturas, la factura pendiente y el estado de la automatización. Cuando `addInvoice` recibe una factura, cambia el estado a `ejecutando` y guarda la tarea pendiente.

Un `useEffect` observa esa tarea. Crea un `setTimeout` de 700 milisegundos para representar una operación asíncrona basada en tiempo y después ejecuta un `fetch` `POST` contra `/api/invoices`. Si la respuesta es correcta, agrega la factura recibida al estado local y marca el flujo como `exito`. Si ocurre un error, marca el flujo como `error` y muestra un mensaje.

El efecto devuelve `() => clearTimeout(timerId)`. Así se evita que un temporizador pendiente intente actualizar el estado después de desmontar el componente. La aplicación también usa otro `useEffect` para cargar las facturas iniciales desde la API.

La interfaz está dividida en componentes: `InvoiceForm` captura y valida datos, `InvoiceList` muestra las facturas, `Invoice` presenta el detalle y `WorkflowDiagram` representa el estado y las decisiones de la automatización.

## Pruebas realizadas

1. Ejecutar `npm install` y después `npm run dev`.
2. Crear una factura válida y verificar la transición `En ejecución` → `Éxito`.
3. Confirmar que la factura se agrega al listado y queda seleccionada.
4. Detener la API, enviar otra factura y verificar el estado `Error`.
5. Ejecutar `npm run build` para comprobar que el proyecto compila en producción.