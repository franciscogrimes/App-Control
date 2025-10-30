import { useEffect, useState } from 'react'

export function useSWRegistration() {
  const [swRegistration, setSwRegistration] = useState(null)
  const [updateAvailable] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        setSwRegistration(registration)
        
        // Verifica se há atualizações
        registration.update()
      })

      // Escuta atualizações
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    }
  }, [])

  const updateSW = () => {
    if (swRegistration) {
      swRegistration.waiting?.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  return { swRegistration, updateAvailable, updateSW }
}