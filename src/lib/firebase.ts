import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

let authInstance: Auth | null = null;

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Firebase configuration is missing. Please set VITE_FIREBASE_API_KEY and other variables in your environment.');
    }

    const firebaseConfig = {
      apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };

    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(app);
  }
  
  return authInstance;
}
