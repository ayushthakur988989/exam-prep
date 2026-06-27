import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "../node_modules/bootstrap/dist/css/bootstrap.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js"
import axios from 'axios';

// Dynamically redirect requests to local server when running on localhost
axios.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('https://exam-prep-1v8x.onrender.com')) {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      config.url = config.url.replace('https://exam-prep-1v8x.onrender.com', 'http://localhost:5000');
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

