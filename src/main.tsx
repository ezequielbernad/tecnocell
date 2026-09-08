import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';

/**
 * En el build de un solo archivo (artifact / hosting estático sin reescritura
 * de rutas) se usa HashRouter, que no necesita configuración del servidor.
 */
const useHash = import.meta.env.VITE_HASH_ROUTER === '1';
const Router = useHash ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
