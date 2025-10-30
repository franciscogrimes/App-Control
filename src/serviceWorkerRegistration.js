// Este código é baseado no template PWA do Create React App

export function register(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/sw.js' // Vite não usa process.env.PUBLIC_URL

      registerValidSW(swUrl, config)
    })
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker registrado com sucesso:', registration)

      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        if (installingWorker == null) {
          return
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Novo conteúdo disponível
              console.log('Novo conteúdo disponível! Por favor, recarregue.')

              if (config && config.onUpdate) {
                config.onUpdate(registration)
              }
            } else {
              // Conteúdo cacheado para uso offline
              console.log('Conteúdo cacheado para uso offline.')

              if (config && config.onSuccess) {
                config.onSuccess(registration)
              }
            }
          }
        }
      }
    })
    .catch((error) => {
      console.error('Erro ao registrar Service Worker:', error)
    })
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error(error.message)
      })
  }
}