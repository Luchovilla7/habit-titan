
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registro de Service Worker para PWA (solo en producción)
// Fix: Using type assertion for import.meta to handle environment check without TypeScript errors
if ('serviceWorker' in navigator && (import.meta as any).env?.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('TITAN SW registrado con éxito:', registration.scope);
    }).catch(err => {
      console.log('TITAN SW fallo en registro:', err);
    });
  });
}
