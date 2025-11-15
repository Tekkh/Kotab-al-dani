import React from 'react'
import ReactDOM from 'react-dom/client'
// 1. استيراد "الموجّه" (Router)
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. تغليف التطبيق بالكامل */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)