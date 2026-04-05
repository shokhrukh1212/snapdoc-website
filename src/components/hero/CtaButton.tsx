import { type ReactNode, useRef } from 'react';

interface CtaButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  external?: boolean;
}

export function CtaButton({ href, children, variant = 'primary', external = false }: CtaButtonProps) {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseDown = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = 'scale(0.97)';
  };

  if (variant === 'primary') {
    return (
      <a
        ref={btnRef}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onMouseDown={handleMouseDown}
        onMouseUp={() => { if (btnRef.current) btnRef.current.style.transform = 'translateY(-2px)'; }}
        className="relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group"
        style={{
          background: 'var(--gradient-primary)',
          color: 'white',
          boxShadow: '0 0 0 0 rgba(79,142,247,0)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(79,142,247,0.4), 0 0 60px rgba(139,92,246,0.2)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 rgba(79,142,247,0)';
          (e.currentTarget as HTMLElement).style.transform = '';
        }}
      >
        {/* Glow layer */}
        <span
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background: 'var(--gradient-primary)',
            filter: 'blur(12px)',
            transform: 'scale(1.1)',
            transition: 'opacity 0.3s ease',
            zIndex: -1,
          }}
          aria-hidden
        />
        {children}
      </a>
    );
  }

  return (
    <a
      ref={btnRef}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseDown={handleMouseDown}
      onMouseUp={() => { if (btnRef.current) btnRef.current.style.transform = ''; }}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.05)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-default)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'rgba(255,255,255,0.08)';
        el.style.borderColor = 'var(--border-bright)';
        el.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'rgba(255,255,255,0.05)';
        el.style.borderColor = 'var(--border-default)';
        el.style.transform = '';
      }}
    >
      {children}
    </a>
  );
}
