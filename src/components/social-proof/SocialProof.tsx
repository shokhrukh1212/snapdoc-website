import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const QUOTES = [
  {
    quote: 'The software\'s UI keeps evolving and lots of images need to be upgraded.',
    context: 'PM describing the ongoing documentation cycle',
    pain: 'UI changes invalidate existing docs',
  },
  {
    quote: 'The feature that actually matters most is how easy it is to update the guide when your product changes. Most tools make you re-record the whole damn thing.',
    context: 'User identifying the most critical missing feature',
    pain: 'Update workflow is the dealbreaker',
  },
  {
    quote: 'Managing and finding/updating older images is beginning to take a toll.',
    context: 'PM at a small company with hundreds of UI screenshots',
    pain: 'Image maintenance is exhausting',
  },
  {
    quote: 'I\'ve definitely let go of my initial desire to include lots of useful images in customer docs. They take a lot of maintenance and awareness.',
    context: '12-year TW veteran describing learned avoidance',
    pain: 'Writers abandon screenshots due to maintenance burden',
  },
  {
    quote: 'The biggest bottleneck lately has been: record → edit → captions → share. Editing eats more time than creating.',
    context: 'User describing the tutorial creation pipeline',
    pain: 'Post-recording editing is the primary time sink',
  },
  {
    quote: 'I expect most of us do it manually, unfortunately.',
    context: 'Technical writer acknowledging the lack of automation',
    pain: 'The industry standard is manual labor',
  },
];

function QuoteCard({ quote, context, pain }: (typeof QUOTES)[0] & { index: number }) {
  return (
    <div
      data-reveal
      className="rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
    >
      {/* Reddit badge */}
      <div className="flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="10" fill="#ff4500" fillOpacity="0.8" />
          <path d="M16.5 10a1.5 1.5 0 01-1.5 1.5c-.4 0-.75-.15-1-.4A7 7 0 0110 12.5a7 7 0 01-4-.4c-.25.25-.6.4-1 .4A1.5 1.5 0 013.5 10c0-.65.4-1.2 1-1.4a3 3 0 010-.6c0-2.2 2.5-4 5.5-4s5.5 1.8 5.5 4a3 3 0 010 .6c.6.2 1 .75 1 1.4z" fill="white" />
        </svg>
        <span className="text-xs font-medium" style={{ color: '#ff4500', opacity: 0.8 }}>
          r/technicalwriting
        </span>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded"
          style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}
        >
          {pain}
        </span>
      </div>

      {/* Quote */}
      <blockquote className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        "{quote}"
      </blockquote>

      {/* Context */}
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        — {context}
      </p>
    </div>
  );
}

export function SocialProof() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll('[data-reveal]') ?? [];
      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: 'var(--accent-blue)' }}
        >
          The problem is real
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          What documentation teams actually say
        </h2>
        <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
          From r/technicalwriting and r/ProductivityCafe — validated pain, not invented personas.
        </p>
      </div>

      <div ref={containerRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUOTES.map((q, i) => (
          <QuoteCard key={i} {...q} index={i} />
        ))}
      </div>
    </section>
  );
}
