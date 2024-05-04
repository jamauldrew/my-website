// entry-client.jsx
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// Separate chunk in the production build
// import Worker from './script.js?worker'

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Worker();
