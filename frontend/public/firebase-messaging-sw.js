importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDZr5k6EkYp4QFa9oyMaODwcwrxRtrw1vE",
  authDomain: "infin8clubb.firebaseapp.com",
  projectId: "infin8clubb",
  storageBucket: "infin8clubb.firebasestorage.app",
  messagingSenderId: "785329960059",
  appId: "1:785329960059:web:2b0639eecf9618dc891ede",
  measurementId: "G-REDR3P7TVV"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  let title = 'INFIN8 Access';
  let options = {
    body: 'You have a new notification.',
    icon: '/pwa-192x192.png',
    data: { url: '/' }
  };

  if (payload.notification) {
    title = payload.notification.title || title;
    options.body = payload.notification.body || options.body;
  }
  
  if (payload.data && payload.data.url) {
    options.data.url = payload.data.url;
  } else if (payload.fcmOptions && payload.fcmOptions.link) {
    options.data.url = payload.fcmOptions.link;
  }

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
