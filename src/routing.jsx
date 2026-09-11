import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import ConditionalRenderDemo from './components/ConditionalRenderDemo'
import AutomationPage from './components/AutomationPage'

export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/automation" element={<AutomationPage />} />
        <Route path="/conditional-render" element={<ConditionalRenderDemo />} />
      </Routes>
    </BrowserRouter>
  )
}
