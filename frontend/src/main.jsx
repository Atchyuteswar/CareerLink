import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'sonner' // Optional: for nice notifications
import { AuthProvider } from './context/AuthContext.jsx' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> 
      <App />
      <Toaster />
    </AuthProvider>
  </React.StrictMode>,
)