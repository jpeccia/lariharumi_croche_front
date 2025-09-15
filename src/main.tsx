import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Se houver um arquivo de estilos global
import './styles/animations.css';
import './styles/fonts.css';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastContainer 
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName="custom-toast"
      bodyClassName="custom-toast-body"
      progressClassName="custom-toast-progress"
    />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
