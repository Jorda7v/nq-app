// Service worker for NQ Trading Assistant.
// Must be served from the same origin as index.html, at the root (or wherever
// you register it from) so its push scope covers the whole app.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { title: 'NQ Trading Assistant', body: 'You have a new update.', tag: 'general' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (err) {
    // payload wasn't JSON — fall back to defaults above
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      tag: data.tag,
      icon: 'icon.png',
      badge: 'icon.png',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('/');
    })
  );
});
