import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    label: 'Step 1 captured',
    element: 'Save button',
    caption: 'Click "Save Changes" to apply your settings',
    icon: '💾',
    highlight: { top: '62%', left: '68%', width: '22%', height: '9%' },
  },
  {
    label: 'Step 2 captured',
    element: 'Dropdown menu',
    caption: 'Select your preferred export format from the dropdown',
    icon: '📋',
    highlight: { top: '38%', left: '18%', width: '30%', height: '8%' },
  },
  {
    label: 'Step 3 captured',
    element: 'Confirm dialog',
    caption: 'Click "Confirm" to finalize and publish the guide',
    icon: '✅',
    highlight: { top: '50%', left: '35%', width: '30%', height: '10%' },
  },
];

function StepCapture({ step, index }: { step: (typeof STEPS)[0]; index: number }) {
  return (
    <div
      className="step-card absolute right-0 top-0 w-72 rounded-xl overflow-hidden"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        opacity: 0,
        transform: 'translateY(16px)',
        marginTop: `${index * 80}px`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
      data-index={index}
    >
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="w-2 h-2 rounded-full" style={{ background: '#4f8ef7' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--accent-blue)' }}>
          {step.label}
        </span>
        <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
          #{index + 1}
        </span>
      </div>
      <div className="p-3 flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-base"
          style={{ background: 'rgba(79,142,247,0.1)' }}
        >
          {step.icon}
        </div>
        <div>
          <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            {step.element}
          </div>
          <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {step.caption}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScrollMachine() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const browserRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsContainerRef.current?.querySelectorAll('.step-card') ?? [];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: 1.2,
          pin: stickyRef.current,
          anticipatePin: 1,
        },
      });

      // Phase 0: Browser appears
      tl.fromTo(browserRef.current, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.15 });

      // Phase 1: Step 1 — cursor moves to highlight[0], click, card appears
      tl.to(cursorRef.current, {
        top: `${55 + 6}%`,
        left: `${65 + 12}%`,
        duration: 0.15,
        ease: 'power2.inOut',
      });
      tl.to(cursorRef.current, { scale: 0.85, duration: 0.03 });
      tl.to(cursorRef.current, { scale: 1, duration: 0.03 });
      tl.to(cards[0], { opacity: 1, y: 0, duration: 0.12 }, '<');

      // Phase 2: Step 2
      tl.to(cursorRef.current, {
        top: `${35 + 5}%`,
        left: `${15 + 18}%`,
        duration: 0.15,
        ease: 'power2.inOut',
      });
      tl.to(cursorRef.current, { scale: 0.85, duration: 0.03 });
      tl.to(cursorRef.current, { scale: 1, duration: 0.03 });
      tl.to(cards[1], { opacity: 1, y: 0, duration: 0.12 }, '<');

      // Phase 3: Step 3
      tl.to(cursorRef.current, {
        top: `${47 + 6}%`,
        left: `${32 + 18}%`,
        duration: 0.15,
        ease: 'power2.inOut',
      });
      tl.to(cursorRef.current, { scale: 0.85, duration: 0.03 });
      tl.to(cursorRef.current, { scale: 1, duration: 0.03 });
      tl.to(cards[2], { opacity: 1, y: 0, duration: 0.12 }, '<');

      // Phase 4: label appears — "3 steps captured, guide ready"
      tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.12 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '350vh' }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        {/* Section heading */}
        <div className="text-center mb-10 z-10">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--accent-blue)' }}>
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Click. Capture. Done.
          </h2>
          <p className="text-base mt-3 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Scroll to watch Snapdoc capture your workflow in real time.
          </p>
        </div>

        {/* Main demo area */}
        <div className="relative w-full max-w-5xl mx-auto flex items-center gap-6">
          {/* Browser mockup */}
          <div
            ref={browserRef}
            className="relative flex-1 rounded-xl overflow-hidden opacity-0"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              aspectRatio: '16/10',
            }}
          >
            {/* Browser chrome */}
            <div
              className="flex items-center gap-2 px-4 h-10"
              style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
              </div>
              <div
                className="flex-1 mx-4 h-6 rounded-md flex items-center px-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)' }}
              >
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  app.taskflow.io/settings
                </span>
              </div>
            </div>

            {/* Fake page content */}
            <div className="relative p-6" style={{ height: 'calc(100% - 40px)' }}>
              {/* Sidebar */}
              <div className="absolute left-0 top-0 bottom-0 w-1/5 p-4" style={{ borderRight: '1px solid var(--border-subtle)' }}>
                {['Dashboard', 'Projects', 'Settings', 'Team', 'Export'].map((item, i) => (
                  <div
                    key={item}
                    className="h-7 rounded-md mb-1 px-3 flex items-center"
                    style={{
                      background: i === 2 ? 'rgba(79,142,247,0.15)' : 'transparent',
                      color: i === 2 ? 'var(--accent-blue)' : 'var(--text-muted)',
                      fontSize: '11px',
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="ml-[22%] h-full">
                <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Export Settings
                </div>
                {/* Fake form fields */}
                <div className="space-y-2 mb-4">
                  {[0, 1].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-4 rounded flex-1" style={{ background: 'rgba(255,255,255,0.05)', maxWidth: '40%' }} />
                      <div className="h-7 rounded flex-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }} />
                    </div>
                  ))}
                </div>
                {/* Dropdown highlight area */}
                <div
                  className="h-8 rounded-md flex items-center px-3 mb-4"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-subtle)',
                    width: '55%',
                  }}
                >
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Select format ▾</span>
                </div>
                {/* Divider */}
                <div className="h-px my-4" style={{ background: 'var(--border-subtle)' }} />
                {/* Confirm modal stub */}
                <div
                  className="rounded-lg p-3 mb-4"
                  style={{
                    background: 'rgba(79,142,247,0.06)',
                    border: '1px solid rgba(79,142,247,0.15)',
                    width: '65%',
                    marginLeft: '17%',
                  }}
                >
                  <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Confirm export?
                  </div>
                  <div className="flex gap-2 justify-end">
                    <div className="h-6 w-12 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
                    <div className="h-6 w-16 rounded" style={{ background: 'rgba(79,142,247,0.3)' }} />
                  </div>
                </div>
                {/* Save button */}
                <div className="flex justify-end">
                  <div
                    className="h-8 w-28 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(79,142,247,0.2)', border: '1px solid rgba(79,142,247,0.3)' }}
                  >
                    <span className="text-xs font-medium" style={{ color: 'var(--accent-blue)' }}>
                      Save Changes
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated cursor */}
              <div
                ref={cursorRef}
                className="absolute pointer-events-none z-20"
                style={{
                  top: '30%',
                  left: '30%',
                  width: '20px',
                  height: '20px',
                  transform: 'translate(-50%, -50%)',
                  transition: 'none',
                }}
              >
                <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
                  <path
                    d="M3 2l14 8-7 1.5L8 19 3 2z"
                    fill="white"
                    stroke="rgba(0,0,0,0.5)"
                    strokeWidth="1"
                  />
                </svg>
                {/* Click ripple */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'rgba(79,142,247,0.3)',
                    animation: 'cursorPulse 2s ease-in-out infinite',
                    transform: 'scale(0)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Step cards panel */}
          <div
            ref={cardsContainerRef}
            className="relative w-72 shrink-0"
            style={{ height: '320px' }}
          >
            {STEPS.map((step, i) => (
              <StepCapture key={i} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* Completion label */}
        <div
          ref={labelRef}
          className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium opacity-0"
          style={{
            transform: 'translateY(16px)',
            background: 'rgba(40,200,80,0.1)',
            border: '1px solid rgba(40,200,80,0.25)',
            color: '#4ade80',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="#4ade80" strokeWidth="1.5" />
            <path d="M4.5 7l2 2 3-3" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          3 steps captured — guide is ready
        </div>
      </div>

      <style>{`
        @keyframes cursorPulse {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
