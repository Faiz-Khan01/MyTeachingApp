import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// 1. Keep your CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. ADD THIS LINE (This fixes the dropdown and search mobile menu)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);