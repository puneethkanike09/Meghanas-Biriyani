/**
 * Firebase Cloud Messaging Service Worker
 * 
 * This service worker handles background push notifications when the app is not in focus.
 * It must be placed in the public directory to be accessible at the root path.
 */

// Import Firebase scripts using compat version for service workers
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
// Note: These values are public and safe to include in client-side code
firebase.initializeApp({
    apiKey: "AIzaSyC4DbWsh4FL5OcKO63YB8yIMgRE3vL9jaw",
    authDomain: "meghana-dev.firebaseapp.com",
    projectId: "meghana-dev",
    storageBucket: "meghana-dev.firebasestorage.app",
    messagingSenderId: "299471620750",
    appId: "1:299471620750:web:8f28c39ee974a09717d7df",
    measurementId: "G-0Z2CF26D34"
});

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    // Extract notification data
    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new notification from Meghana\'s Biriyani',
        icon: payload.notification?.icon || '/assets/navbar/images/logo.svg',
        badge: '/assets/navbar/images/logo.svg',
        tag: payload.data?.type || 'general',
        data: payload.data,
        // Additional options for better UX
        vibrate: [200, 100, 200],
        requireInteraction: false,
        actions: payload.data?.actions ? JSON.parse(payload.data.actions) : []
    };

    // Show the notification
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event);

    event.notification.close();

    // Handle different notification types
    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if there's already a window open
                for (const client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If no window is open, open a new one
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

