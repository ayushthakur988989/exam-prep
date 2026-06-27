import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "../node_modules/bootstrap/dist/css/bootstrap.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js"
import axios from 'axios';

// Dynamically redirect requests to the correct backend API URL
const BASE_URL = import.meta.env.VITE_API_URL || 'https://exam-prep-1v8x.onrender.com';
axios.interceptors.request.use((config) => {
  if (config.url && config.url.includes('exam-prep-1v8x.onrender.com')) {
    config.url = config.url.replace('https://exam-prep-1v8x.onrender.com', BASE_URL);
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

