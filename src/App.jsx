import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import './App.css'

function App() {
  return (
    <>
      <OfflineIndicator />
      <RouterProvider router={router} />
      <PWAInstallPrompt />
    </>
  );
}

export default App
