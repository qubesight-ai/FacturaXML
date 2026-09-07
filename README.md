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
