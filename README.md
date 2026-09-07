# Sistema de Manipulación de Facturas (React)

Proyecto frontend en React (Vite) que permite crear, listar y visualizar facturas.

Requisitos cumplidos:
- Formulario con `useState`, validación básica y items dinámicos.
- Listado de facturas con `.map()` y `key`, selección y manejo de estado vacío.
- Componente `Invoice` que recibe props y calcula subtotal/impuesto/total.
- Botón para cargar una factura de ejemplo (ver evidencia).

Cómo ejecutar:

1. Instalar dependencias

```bash
npm install
```

2. Levantar servidor de desarrollo

```bash
npm run dev
```

Abrir el navegador en la URL que indique Vite (por defecto http://localhost:5173).

Uso:
- Crear facturas desde el formulario (agregar/eliminar ítems).
- En la columna derecha se listan las facturas y se puede seleccionar una para ver su diseño.
- Para reproducir el ejemplo solicitado, usar el botón "Cargar factura de ejemplo".
 - Para reproducir el ejemplo solicitado, usar el botón "Cargar factura de ejemplo".

Evidencia

- Se incluye `evidence/example-invoice.json` con los datos de ejemplo solicitados.
- Para mostrar la factura de ejemplo en la app: ejecutar la app, pulsar "Cargar factura de ejemplo" y seleccionar la factura en el listado. Luego tomar una captura que muestre el diseño completo.


Exportar / Imprimir

- Desde la vista de la factura hay dos botones: `Descargar HTML` (genera un archivo .html con el diseño) y `Imprimir (PDF)` (abre la vista imprimible; usar "Guardar como PDF" en el diálogo de impresión).


Repositorio y entrega

- Repositorio en GitHub: https://github.com/qubesight-ai/FacturaXML
- ZIP entregable incluido en el repo: [FacturaXML-deliverable.zip](./FacturaXML-deliverable.zip)

Nota: también existe `../FacturaXML.zip` si se generó en la carpeta superior localmente.


