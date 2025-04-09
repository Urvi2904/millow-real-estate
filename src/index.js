/**
 *This file is part of the React App that interacts with the Ethereum blockchain and a smart contract for real estate transactions.
 *This file is the entry point of the React application.
 *It initializes the app, sets up the root element, and renders the main App component.
 */
// Import libraries and styles
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

reportWebVitals();
