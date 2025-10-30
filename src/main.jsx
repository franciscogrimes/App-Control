import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './components/routes/route.jsx'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)

// Registra o service worker FORA do render
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('App pronto para funcionar offline!')
  },
  onUpdate: (registration) => {
    console.log('Nova versão disponível!')
    if (confirm('Nova versão disponível! Deseja atualizar?')) {
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }
})