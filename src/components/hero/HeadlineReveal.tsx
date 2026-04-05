import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface HeadlineRevealProps {
  lines: string[];
  className?: string;
  gradient?: boolean;
}

export function HeadlineReveal({ lines, className = '', gradient = false }: HeadlineRevealProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.word-inner');

    gsap.fromTo(
      words,
      { y: '105%', opacity: 0.2 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.06,
        delay: 0.15,
      }
    );
  }, []);

  return (
    <h1 ref={containerRef} className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(' ').map((word, wi) => (
            <span
              key={wi}
              className="inline-block overflow-hidden"
              style={{ verticalAlign: 'bottom' }}
            >
              <span
                className={`word-inner inline-block${gradient && li === lines.length - 1 ? ' gradient-text' : ''}`}
              >
                {word}
              </span>
              {wi < line.split(' ').length - 1 && (
                <span className="word-inner inline-block">&nbsp;</span>
              )}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
