import { Link } from 'react-router-dom';
import { site, hasWhatsApp } from '../config/site';
import { useSeo } from '../hooks/useSeo';
import { ConsultaButton } from '../components/WhatsApp';

export function Contact() {
  useSeo({
    title: 'Contacto',
    description:
      'Consultá por WhatsApp por cualquier equipo del catálogo de Tecnocell: te respondemos con precio y disponibilidad.',
  });

  const { contact, openingHours, social } = site;
  const hasOtros = Boolean(contact.phone || contact.email || contact.address || openingHours.length || social.length);

  return (
    <div className="page">
      <header className="page__head">
        <p className="eyebrow mono">Contacto</p>
        <h1 className="page__title">Escribinos y te respondemos</h1>
        <p className="page__lead">
          La forma más rápida de consultar es por WhatsApp: si nos decís el modelo, la capacidad y
          el color, te confirmamos precio y disponibilidad en el mismo mensaje.
        </p>
      </header>

      <div className="contact-grid">
        <section className="contact-card contact-card--main" aria-labelledby="wa-title">
          <h2 id="wa-title" className="contact-card__title">
            WhatsApp
          </h2>
          <p className="contact-card__text">
            {hasWhatsApp
              ? 'Es nuestro canal principal de atención. Tocá el botón y se abre el chat con el mensaje ya escrito.'
              : 'Es nuestro canal principal de atención. El número todavía no está publicado en la web: al tocar el botón te mostramos el mensaje listo para copiar.'}
          </p>
          <ConsultaButton kind="general" size="lg">
            Abrir consulta
          </ConsultaButton>
        </section>

        <section className="contact-card" aria-labelledby="asesor-title">
          <h2 id="asesor-title" className="contact-card__title">
            No sabés cuál elegir
          </h2>
          <p className="contact-card__text">
            Contanos para qué vas a usar el teléfono y cuánto querés gastar. Te proponemos dos o
            tres opciones del catálogo con las diferencias explicadas.
          </p>
          <ConsultaButton kind="asesoramiento" tone="outline">
            Pedir una recomendación
          </ConsultaButton>
        </section>

        {hasOtros ? (
          <section className="contact-card" aria-labelledby="datos-title">
            <h2 id="datos-title" className="contact-card__title">
              Otros datos
            </h2>
            <dl className="contact-list">
              {contact.phone && (
                <div>
                  <dt className="mono">Teléfono</dt>
                  <dd>
                    <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
                  </dd>
                </div>
              )}
              {contact.email && (
                <div>
                  <dt className="mono">Email</dt>
                  <dd>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </dd>
                </div>
              )}
              {contact.address && (
                <div>
                  <dt className="mono">Dirección</dt>
                  <dd>
                    {contact.mapUrl ? (
                      <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer">
                        {contact.address}
                        {contact.city ? `, ${contact.city}` : ''}
                      </a>
                    ) : (
                      <>
                        {contact.address}
                        {contact.city ? `, ${contact.city}` : ''}
                      </>
                    )}
                  </dd>
                </div>
              )}
              {openingHours.length > 0 && (
                <div>
                  <dt className="mono">Horarios</dt>
                  <dd>
                    {openingHours.map((h) => (
                      <span key={h.days} className="contact-list__line">
                        {h.days}: {h.hours}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {social.length > 0 && (
                <div>
                  <dt className="mono">Redes</dt>
                  <dd>
                    {social.map((s) => (
                      <span key={s.href} className="contact-list__line">
                        <a href={s.href} target="_blank" rel="noopener noreferrer">
                          {s.label}
                        </a>
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </section>
        ) : (
          <section className="contact-card" aria-labelledby="pendiente-title">
            <h2 id="pendiente-title" className="contact-card__title">
              Dirección, horarios y redes
            </h2>
            <p className="contact-card__text">
              Todavía no publicamos estos datos. Los vamos a mostrar acá apenas estén confirmados,
              para no dar información que después cambie.
            </p>
            <Link className="btn btn--plain" to="/catalogo">
              Mientras tanto, mirá el catálogo
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
