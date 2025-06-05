import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';  // Tailwind should be imported here first
//import './App.css';    // Your custom styles come after

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
