import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { isDemoCatalog } from './config/site';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppFab } from './components/WhatsApp';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductPage } from './pages/Product';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';

/** Vuelve al inicio al cambiar de página; respeta los anclajes (#seccion). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function DemoBar() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('tc-demo-bar') === 'off';
    } catch {
      return false;
    }
  });

  if (!isDemoCatalog || dismissed) return null;

  return (
    <div className="demo-bar">
      <p>
        <span className="demo-bar__tag mono">Demo</span>
        Catálogo de demostración: los productos, precios y estados de stock son de ejemplo.
      </p>
      <button
        type="button"
        className="demo-bar__close"
        aria-label="Ocultar aviso"
        onClick={() => {
          setDismissed(true);
          try {
            sessionStorage.setItem('tc-demo-bar', 'off');
          } catch {
            /* almacenamiento no disponible: el aviso vuelve a mostrarse */
          }
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <DemoBar />
      <Header />
      <main id="contenido">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog scope="todo" />} />
          <Route path="/smartphones" element={<Catalog scope="smartphones" />} />
          <Route path="/accesorios" element={<Catalog scope="accesorios" />} />
          <Route path="/producto/:slug" element={<ProductPage />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
