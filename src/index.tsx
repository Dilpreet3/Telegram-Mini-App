import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WebApp } from '@twa-dev/sdk';

// Initialize Telegram Web App
WebApp.ready();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
