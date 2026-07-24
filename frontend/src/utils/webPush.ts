import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';

export async function registerServiceWorkerAndSubscribe() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker is not supported');
    return null;
  }

  try {
    // Register the FCM service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('Firebase Service Worker registered with scope:', registration.scope);

    // Wait for the Service Worker to be ready
    await navigator.serviceWorker.ready;

    if (!messaging) {
      console.warn('Firebase Messaging not initialized.');
      return null;
    }

    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      console.warn('VITE_VAPID_PUBLIC_KEY is not defined in environment variables. Web push notifications disabled.');
      return null;
    }

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: vapidPublicKey,
      serviceWorkerRegistration: registration
    });

    if (token) {
      console.log('FCM Token retrieved successfully.', token);
      // Return just the token string instead of the Web Push object
      return token; 
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (error) {
    console.error('Service Worker registration or FCM subscription failed:', error);
    return null;
  }
}
