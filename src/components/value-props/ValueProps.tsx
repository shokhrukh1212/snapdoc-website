import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GlassCard } from './GlassCard';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="10" cy="10" r="3" fill="currentColor" fillOpacity="0.3" />
      </svg>
    ),
    title: 'Auto-capture every step',
    description:
      'Click Start, then work normally. Snapdoc captures each meaningful action — clicks, inputs, navigation — with a focused screenshot auto-cropped around what you touched.',
    accent: '#4f8ef7',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 10h5m2 0h5M10 4v5m0 2v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 6l8 8M14 6L6 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
      </svg>
    ),
    title: 'Detect what actually changed',
    description:
      'After a UI update, run "Check for Changes." Snapdoc revisits each URL, finds every element by selector, and flags steps where text moved, positions shifted, or elements disappeared.',
    accent: '#8b5cf6',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M5 10l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      </svg>
    ),
    title: 'Update only what broke',
    description:
      'Re-capture only the changed steps. Everything else stays intact. Your guide stays current without redoing the entire workflow from scratch.',
    accent: '#10b981',
  },
];

export function ValueProps() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll('[data-reveal]') ?? [];
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: 'var(--accent-blue)' }}
          data-reveal
        >
          Why Snapdoc
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold mb-4"
          style={{ color: 'var(--text-primary)' }}
          data-reveal
        >
          Documentation that keeps up with your product
        </h2>
        <p
          className="text-base max-w-xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
          data-reveal
        >
          Other tools capture screenshots. Snapdoc captures workflows — and knows when they're outdated.
        </p>
      </div>

      <div ref={containerRef} className="grid sm:grid-cols-3 gap-5">
        {CARDS.map(card => (
          <GlassCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
