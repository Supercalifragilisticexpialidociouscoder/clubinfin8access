import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useDeviceNotifications() {
  const { user, apiCall } = useAuth();
  const seenNotificationIds = useRef<Set<string>>(new Set());
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (!user) {
      seenNotificationIds.current.clear();
      initialLoadDone.current = false;
      return;
    }

    // Ask for permission if not yet granted or denied
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkNotifications = async () => {
      // Only poll if we have permission to show notifications
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      try {
        const res = await apiCall('/api/notifications?unread=true');
        if (res.ok) {
          const data = await res.json();
          const notifications = data.notifications || [];
          
          notifications.forEach((notif: any) => {
            if (!seenNotificationIds.current.has(notif.id)) {
              seenNotificationIds.current.add(notif.id);
              
              // Prevent spamming native notifications on first load
              if (initialLoadDone.current) {
                new Notification(notif.title || 'Infin8 Access', {
                  body: notif.message,
                });
              }
            }
          });
          
          initialLoadDone.current = true;
        }
      } catch (error) {
        // silent fail for polling
      }
    };

    // Initial check
    checkNotifications();

    // Poll every 15 seconds
    const interval = setInterval(checkNotifications, 15000);

    return () => clearInterval(interval);
  }, [user, apiCall]);
}
