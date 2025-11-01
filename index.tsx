import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeFirebase } from './services/firebase';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Initial loading state while Firebase connects
root.render(
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <p className="text-2xl font-semibold text-indigo-600">🐾 Paw-sitive Find</p>
      <p className="mt-2 text-gray-600">Initializing services, please wait...</p>
    </div>
  </div>
);

// Initialize Firebase and then render the main app
initializeFirebase().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch(error => {
  console.error("Firebase initialization failed:", error);
  root.render(
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
       <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-red-600">Application Error</h1>
        <p className="mt-2 text-gray-700">Could not connect to services. Please refresh the page and try again.</p>
        <p className="mt-4 text-xs text-gray-500">If the problem persists, please contact support.</p>
      </div>
    </div>
  );
});
