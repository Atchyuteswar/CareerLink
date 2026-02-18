import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'sonner' // Keep this if you have it
import { ThemeProvider } from "./components/shared/theme-provider.jsx" // <--- Import this
import { AuthProvider } from './context/AuthContext.jsx' // Keep your context

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> {/* <--- Wrap here */}
        <App />
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
)