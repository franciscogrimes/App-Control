// src/components/ServiceWorkerUpdate.jsx
import { useSWRegistration } from '../hooks/useSWRegistration'

export function ServiceWorkerUpdate() {
  const { updateAvailable, updateSW } = useSWRegistration()

  if (!updateAvailable) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#800020',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      zIndex: 10000
    }}>
      <p>Nova versão disponível!</p>
      <button onClick={updateSW}>
        Atualizar Agora
      </button>
    </div>
  )
}