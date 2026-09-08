import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { ConsultaButton } from '../components/WhatsApp';

export function NotFound() {
  useSeo({
    title: 'Página no encontrada',
    description: 'La página que buscabas no existe. Volvé al catálogo de Tecnocell.',
  });

  return (
    <div className="page page--center">
      <p className="eyebrow mono">Error 404</p>
      <h1 className="page__title">No encontramos esta página</h1>
      <p className="page__lead">
        Puede que el producto ya no esté en el catálogo o que el enlace esté mal escrito.
      </p>
      <div className="empty__actions">
        <Link className="btn btn--primary" to="/catalogo">
          Ver el catálogo
        </Link>
        <ConsultaButton kind="general" tone="outline">
          Consultar por WhatsApp
        </ConsultaButton>
      </div>
    </div>
  );
}
