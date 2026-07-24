import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDZr5k6EkYp4QFa9oyMaODwcwrxRtrw1vE",
  authDomain: "infin8clubb.firebaseapp.com",
  projectId: "infin8clubb",
  storageBucket: "infin8clubb.firebasestorage.app",
  messagingSenderId: "785329960059",
  appId: "1:785329960059:web:2b0639eecf9618dc891ede",
  measurementId: "G-REDR3P7TVV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export let analytics: ReturnType<typeof getAnalytics> | null = null;
export let messaging: ReturnType<typeof getMessaging> | null = null;

if (typeof window !== 'undefined') {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn("Firebase Analytics is not supported in this environment:", err);
  });

  isMessagingSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
      import('firebase/messaging').then(({ onMessage }) => {
        onMessage(messaging!, (payload) => {
          console.log('[Foreground Notification]', payload);
          // Show a local notification using the browser API if in foreground
          if (Notification.permission === 'granted' && payload.notification) {
             const title = payload.notification.title || 'INFIN8 Access';
             const options = {
               body: payload.notification.body,
               icon: '/pwa-192x192.png'
             };
             new Notification(title, options);
          }
        });
      });
    }
  }).catch((err) => {
    console.warn("Firebase Messaging is not supported in this environment:", err);
  });
}
