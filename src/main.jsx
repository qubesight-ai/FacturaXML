import React from 'react'
import { createRoot } from 'react-dom/client'
import Routing from './routing'
import './index.css'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>
)
