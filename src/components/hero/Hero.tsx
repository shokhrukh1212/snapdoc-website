import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { GradientOrb } from './GradientOrb';
import { HeadlineReveal } from './HeadlineReveal';
import { CtaButton } from './CtaButton';

export function Hero() {
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 });
    tl.fromTo(badgeRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    tl.fromTo(subRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.6);
    tl.fromTo(ctaRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.75);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 dot-grid overflow-hidden">
      <GradientOrb />

      {/* Radial fade over dot grid so center is darker */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, var(--bg-base) 100%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium opacity-0"
          style={{
            background: 'rgba(79,142,247,0.1)',
            border: '1px solid rgba(79,142,247,0.25)',
            color: 'var(--accent-blue)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--accent-blue)', boxShadow: '0 0 6px var(--accent-blue)' }}
          />
          Now available for Chrome
        </div>

        {/* Headline */}
        <HeadlineReveal
          lines={['Stop re-doing your', 'docs when the UI changes']}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
          gradient
        />

        {/* Sub */}
        <p
          ref={subRef}
          className="text-lg sm:text-xl max-w-2xl leading-relaxed opacity-0"
          style={{ color: 'var(--text-secondary)' }}
        >
          Snapdoc captures your browser workflow as a step-by-step guide, then detects when the UI changes — so you update only what broke, not everything.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4 opacity-0">
          <CtaButton href="https://chrome.google.com/webstore" external variant="primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="white" strokeWidth="1.5" />
              <circle cx="8" cy="8" r="3" fill="white" />
            </svg>
            Install for Chrome — Free
          </CtaButton>
          <CtaButton href="/demo" variant="secondary" routerLink>
            See live demo
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </CtaButton>
        </div>

        {/* Trust note */}
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Free to use · Data stays local · No signup required
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: 'var(--text-muted)' }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div
          className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div
            className="w-1 h-2 rounded-full"
            style={{
              background: 'var(--text-muted)',
              animation: 'scrollDot 2s ease-in-out infinite',
            }}
          />
        </div>
        <style>{`
          @keyframes scrollDot {
            0%, 100% { transform: translateY(0); opacity: 1; }
            80% { transform: translateY(10px); opacity: 0; }
          }
        `}</style>
      </div>
    </section>
  );
}
