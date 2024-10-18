/* eslint-disable no-undef */
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'authen-6cf1b.firebaseapp.com',
  databaseURL: 'https://authen-6cf1b-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'authen-6cf1b',
  storageBucket: 'authen-6cf1b.appspot.com',
  messagingSenderId: '71921906796',
  appId: '1:71921906796:web:039a9bbb8c9458e4e65449',
  measurementId: 'G-7SK8Q8SLHD',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
// Customize background notification handling here
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
