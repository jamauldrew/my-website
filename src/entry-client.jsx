// entry-client.jsx
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import initializePage from './script.js'

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

initializePage();
