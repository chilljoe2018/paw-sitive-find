import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export let app: FirebaseApp;
export let auth: Auth;
export let db: Firestore;
export let storage: FirebaseStorage;
export const googleProvider = new GoogleAuthProvider();

/**
 * Initializes the Firebase app. It first tries to fetch the configuration
 * from the endpoint provided by Firebase App Hosting. If that fails (e.g., in a
 * local development environment), it falls back to using environment variables.
 * This must be called at the application's entry point before any Firebase services are used.
 */
export const initializeFirebase = async () => {
  let firebaseConfig;

  try {
    // This URL is auto-provisioned by Firebase App Hosting.
    const response = await fetch('/__/firebase/init.json');
    if (response.ok) {
      firebaseConfig = await response.json();
    }
  } catch (error) {
    console.warn('Could not fetch Firebase config from hosting URL. This is expected in local development. Falling back to environment variables.');
  }

  // If the fetch failed, use environment variables as a fallback.
  // This is useful for local development.
  if (!firebaseConfig) {
    firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };
  }
  
  // If no valid config is found either way, the app can't start.
  if (!firebaseConfig?.apiKey) {
    console.error("Firebase configuration is missing or invalid. Make sure you have set up your environment variables for local development, or that the app is deployed to Firebase App Hosting.");
    throw new Error("Firebase configuration not found.");
  }

  // Initialize Firebase with the determined config
  app = initializeApp(firebaseConfig);

  // Initialize and export other Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
};
