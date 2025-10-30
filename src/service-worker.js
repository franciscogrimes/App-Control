// public/sw.js
const CACHE_NAME = 'ju-control-v1.0.0'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
]

// Instalação
self.addEventListener('install', (event) => {
  console.log('Service Worker instalando...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto')
        return cache.addAll(urlsToCache)
      })
  )
})

// Ativação
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna resposta
        if (response) {
          return response
        }

        // Clona a requisição
        const fetchRequest = event.request.clone()

        return fetch(fetchRequest).then((response) => {
          // Checa se é válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clona a resposta
          const responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        })
      })
  )
})