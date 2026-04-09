// src/index.js - Entry point (don't touch this file)
// This is like your AndroidManifest.xml - it tells React where to start
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
