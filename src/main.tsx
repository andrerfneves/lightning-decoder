import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import '@fontsource/geist-mono/300.css'
import '@fontsource/geist-mono/400.css'
import '@fontsource/geist-mono/500.css'
import '@fontsource/geist-mono/600.css'
import '@fontsource/geist-mono/700.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="lightning-decoder-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
