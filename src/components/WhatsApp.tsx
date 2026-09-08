import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { hasWhatsApp } from '../config/site';
import { buildMessage, whatsappUrl } from '../lib/whatsapp';
import type { ConsultaKind } from '../lib/whatsapp';
import type { Product, Variant } from '../data/catalog';

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.8a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.89 9.89m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41" />
    </svg>
  );
}

interface ConsultaProps {
  kind: ConsultaKind;
  product?: Product;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  /** Estilo del botón. */
  tone?: 'primary' | 'outline' | 'plain';
  size?: 'md' | 'lg';
}

/**
 * Botón de consulta. Si hay un número de WhatsApp configurado abre el chat con
 * el mensaje ya escrito. Si todavía no lo hay, abre un panel con el mensaje
 * listo para copiar en vez de un enlace que no lleva a ningún lado.
 */
export function ConsultaButton({
  kind,
  product,
  variant,
  children,
  className = '',
  tone = 'primary',
  size = 'md',
}: ConsultaProps) {
  const [open, setOpen] = useState(false);
  const message = buildMessage(kind, product, variant);
  const href = whatsappUrl(message);
  const classes = `btn btn--${tone} ${size === 'lg' ? 'btn--lg' : ''} ${className}`.trim();

  if (href) {
    return (
      <a className={classes} href={href} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon size={size === 'lg' ? 20 : 18} />
        <span>{children}</span>
      </a>
    );
  }

  return (
    <>
      <button type="button" className={classes} onClick={() => setOpen(true)}>
        <WhatsAppIcon size={size === 'lg' ? 20 : 18} />
        <span>{children}</span>
      </button>
      {open && <MessageDialog message={message} onClose={() => setOpen(false)} />}
    </>
  );
}

/** Panel con el mensaje listo, cuando el número todavía no está cargado. */
function MessageDialog({ message, onClose }: { message: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }, [message]);

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wa-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog__head">
          <h2 id="wa-dialog-title" className="dialog__title">
            Tu consulta está lista
          </h2>
          <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="dialog__lead">
          Todavía no cargamos el número de WhatsApp del local, así que no podemos abrir el chat
          automáticamente. Copiá este mensaje y enviánoslo:
        </p>
        <p className="dialog__message">{message}</p>
        <div className="dialog__actions">
          <button type="button" className="btn btn--primary" onClick={copy}>
            {copied ? 'Mensaje copiado' : 'Copiar mensaje'}
          </button>
          <button type="button" className="btn btn--plain" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <p className="dialog__note">
          <span className="mono">Para el equipo:</span> cargá el número en{' '}
          <span className="mono">src/config/site.ts</span> → <span className="mono">whatsapp.number</span>{' '}
          y este panel se reemplaza por el enlace directo al chat.
        </p>
      </div>
    </div>
  );
}

/** Botón flotante de consulta. Se corre hacia arriba en la ficha de producto. */
export function WhatsAppFab() {
  const { pathname } = useLocation();
  const offset = pathname.startsWith('/producto/');
  return (
    <div className={`fab ${offset ? 'fab--offset' : ''}`}>
      <ConsultaButton kind="general" tone="plain" className="fab__btn">
        <span className="fab__label">Consultar</span>
      </ConsultaButton>
    </div>
  );
}

export { hasWhatsApp };
