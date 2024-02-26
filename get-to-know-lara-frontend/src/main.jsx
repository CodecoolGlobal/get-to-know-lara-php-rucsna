import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Pages/Layout';
import Router from './router';
import { ContextProvider } from './contexts/ContextProvider';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <BrowserRouter>
        <Layout />
        <Router />
      </BrowserRouter>
    </ContextProvider>
  </React.StrictMode>,
)
