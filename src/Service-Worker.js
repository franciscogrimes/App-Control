// src/Service-Worker.js
self.addEventListener('install', () => {
  console.log('Service Worker instalado com sucesso!');
});

self.addEventListener('activate', () => {
  console.log('Service Worker ativo!');
});
