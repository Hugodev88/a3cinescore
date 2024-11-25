// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // Importando o AuthProvider
import './index.css'

ReactDOM.render(
  <AuthProvider>  {/* Certifique-se de envolver o App com o AuthProvider */}
    <App />
  </AuthProvider>,
  document.getElementById('root')
);
