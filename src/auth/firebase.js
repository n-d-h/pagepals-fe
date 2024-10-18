// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging, onMessage } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';
import { toastNotification } from '../const/notificationHelpers';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const setupNotifications = async () => {
  try {
    // Handle foreground notifications
    onMessage(messaging, (payload) => {
      toastNotification({
        title: payload.notification.title,
        description: payload.notification.body,
        status: 'info',
      });
      // Handle the notification or update your UI
    });
  } catch (error) {
    console.error('Error setting up notifications:', error);
  }
};
export { messaging, setupNotifications };

export const storage = getStorage(firebaseApp);
export const AUTH = getAuth(firebaseApp);
