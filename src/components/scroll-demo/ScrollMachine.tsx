import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Each step: the element ref id, card copy, and where on the fake page the element lives
const STEPS = [
  {
    targetId: 'fake-dropdown',
    label: 'Step 1 captured',
    element: 'Audience dropdown',
    caption: 'Selected "All new users" as the guide audience',
    tag: 'click',
    tagColor: '#4f8ef7',
  },
  {
    targetId: 'fake-send-btn',
    label: 'Step 2 captured',
    element: '"Send test" button',
    caption: 'Clicked "Send test email" to preview the guide delivery',
    tag: 'click',
    tagColor: '#4f8ef7',
  },
  {
    targetId: 'fake-publish-btn',
    label: 'Step 3 captured',
    element: '"Publish Guide" button',
    caption: 'Clicked "Publish Guide" — guide is now live for users',
    tag: 'click',
    tagColor: '#10b981',
  },
];

function StepCard({ step, index }: { step: (typeof STEPS)[0]; index: number }) {
  return (
    <div
      className="step-card w-full rounded-xl overflow-hidden mb-3"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        opacity: 0,
        transform: 'translateY(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: step.tagColor }} />
        <span className="text-xs font-medium" style={{ color: step.tagColor }}>
          {step.label}
        </span>
        <span className="ml-auto text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
          #{index + 1}
        </span>
      </div>
      <div className="p-3 flex items-start gap-3">
        {/* Fake screenshot thumbnail */}
        <div
          className="w-12 h-10 rounded-md shrink-0 overflow-hidden"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="w-full h-2" style={{ background: 'var(--bg-base)' }} />
          <div className="p-1 space-y-1">
            <div className="h-1.5 rounded" style={{ background: 'rgba(79,142,247,0.3)', width: '80%' }} />
            <div className="h-1.5 rounded" style={{ background: 'rgba(255,255,255,0.08)', width: '60%' }} />
            <div className="h-1.5 rounded" style={{ background: 'rgba(79,142,247,0.5)', width: '40%' }} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {step.element}
          </div>
          <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {step.caption}
          </div>
          <div
            className="mt-2 inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded"
            style={{
              background: `${step.tagColor}15`,
              color: step.tagColor,
              border: `1px solid ${step.tagColor}25`,
            }}
          >
            {step.tag}
          </div>
        </div>
      </div>
    </div>
  );
}

// The fake page rendered inside the browser mockup
function FakePage({
  dropdownRef,
  sendBtnRef,
  publishBtnRef,
  highlightId,
}: {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  sendBtnRef: React.RefObject<HTMLDivElement | null>;
  publishBtnRef: React.RefObject<HTMLDivElement | null>;
  highlightId: string | null;
}) {
  const isHighlighted = (id: string) => highlightId === id;

  return (
    <div className="h-full flex flex-col p-5 gap-4" style={{ color: 'var(--text-primary)' }}>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">User Onboarding Guide</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            3 steps · Last edited 2 min ago
          </div>
        </div>
        {/* Publish button — Step 3 target */}
        <div
          id="fake-publish-btn"
          ref={publishBtnRef}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
          style={{
            background: isHighlighted('fake-publish-btn')
              ? 'rgba(16,185,129,0.3)'
              : 'rgba(16,185,129,0.15)',
            border: isHighlighted('fake-publish-btn')
              ? '1.5px solid rgba(16,185,129,0.7)'
              : '1px solid rgba(16,185,129,0.3)',
            color: '#10b981',
            boxShadow: isHighlighted('fake-publish-btn')
              ? '0 0 12px rgba(16,185,129,0.3)'
              : 'none',
            cursor: 'pointer',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v6M2 5l3-3 3 3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Publish Guide
        </div>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: 'var(--border-subtle)' }} />

      {/* Step 1 row — Audience dropdown */}
      <div
        className="rounded-xl p-3.5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2 mb-2.5">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
            style={{ background: 'rgba(79,142,247,0.15)', color: 'var(--accent-blue)' }}
          >
            1
          </div>
          <span className="text-xs font-medium">Welcome email</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Send to:</span>
          {/* Dropdown — Step 1 target */}
          <div
            id="fake-dropdown"
            ref={dropdownRef}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs flex-1"
            style={{
              background: isHighlighted('fake-dropdown')
                ? 'rgba(79,142,247,0.15)'
                : 'rgba(255,255,255,0.05)',
              border: isHighlighted('fake-dropdown')
                ? '1.5px solid rgba(79,142,247,0.6)'
                : '1px solid var(--border-subtle)',
              color: isHighlighted('fake-dropdown')
                ? 'var(--accent-blue)'
                : 'var(--text-secondary)',
              boxShadow: isHighlighted('fake-dropdown')
                ? '0 0 10px rgba(79,142,247,0.25)'
                : 'none',
              cursor: 'pointer',
              maxWidth: '180px',
            }}
          >
            <span className="flex-1">All new users</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.5 }}>
              <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Step 2 row — Send test email */}
      <div
        className="rounded-xl p-3.5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2 mb-2.5">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
            style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}
          >
            2
          </div>
          <span className="text-xs font-medium">Setup call invite</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Preview:</span>
          {/* Send test button — Step 2 target */}
          <div
            id="fake-send-btn"
            ref={sendBtnRef}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: isHighlighted('fake-send-btn')
                ? 'rgba(139,92,246,0.2)'
                : 'rgba(139,92,246,0.1)',
              border: isHighlighted('fake-send-btn')
                ? '1.5px solid rgba(139,92,246,0.6)'
                : '1px solid rgba(139,92,246,0.25)',
              color: '#a78bfa',
              boxShadow: isHighlighted('fake-send-btn')
                ? '0 0 10px rgba(139,92,246,0.25)'
                : 'none',
              cursor: 'pointer',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 5h7M5 2l3 3-3 3" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Send test email
          </div>
        </div>
      </div>

      {/* Step 3 row — resources (passive, not a click target) */}
      <div
        className="rounded-xl p-3.5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}
          >
            3
          </div>
          <span className="text-xs font-medium">Resource links</span>
        </div>
        <div className="flex gap-2">
          {['Docs', 'Video', 'Checklist'].map(t => (
            <div
              key={t}
              className="text-xs px-2 py-1 rounded"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScrollMachine() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const browserRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const clickRingRef = useRef<HTMLDivElement>(null);

  // Refs to the actual target elements in the fake page
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sendBtnRef = useRef<HTMLDivElement>(null);
  const publishBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.step-card') ?? [];

      // Helper: get cursor position (as % of content area) for a target element
      const getCursorPos = (targetEl: HTMLElement | null) => {
        const content = contentAreaRef.current;
        if (!targetEl || !content) return { x: '50%', y: '50%' };
        const cRect = content.getBoundingClientRect();
        const tRect = targetEl.getBoundingClientRect();
        const x = ((tRect.left + tRect.width / 2 - cRect.left) / cRect.width) * 100;
        const y = ((tRect.top + tRect.height / 2 - cRect.top) / cRect.height) * 100;
        return { x: `${x}%`, y: `${y}%` };
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=280%',
          scrub: 1.2,
          pin: stickyRef.current,
          anticipatePin: 1,
        },
        onUpdate() {
          // Keep highlight state in sync during scrub
        },
      });

      // Phase 0: browser fades in
      tl.fromTo(
        browserRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }
      );

      // Position cursor at element 1 before it's visible (so it starts there)
      tl.call(() => {
        const pos = getCursorPos(dropdownRef.current);
        if (cursorRef.current) {
          gsap.set(cursorRef.current, { left: pos.x, top: pos.y });
        }
      });

      const ring = clickRingRef.current;

      const doClick = (card: Element) => {
        tl.to(cursorRef.current, { scale: 0.75, duration: 0.04, ease: 'power2.in' });
        tl.to(ring, { opacity: 1, scale: 1, duration: 0.01 }, '<');
        tl.to(ring, { scale: 2.2, opacity: 0, duration: 0.12, ease: 'power2.out' });
        tl.to(cursorRef.current, { scale: 1, duration: 0.05, ease: 'power2.out' }, '<');
        tl.to(card, { opacity: 1, y: 0, duration: 0.1 }, '<');
      };

      // Phase 1: cursor already at dropdown → click → card 1
      doClick(cards[0]);

      // Phase 2: cursor moves to send button → click → card 2
      tl.to(cursorRef.current, {
        left: () => getCursorPos(sendBtnRef.current).x,
        top: () => getCursorPos(sendBtnRef.current).y,
        duration: 0.18,
        ease: 'power2.inOut',
      });
      doClick(cards[1]);

      // Phase 3: cursor moves to Publish button → click → card 3
      tl.to(cursorRef.current, {
        left: () => getCursorPos(publishBtnRef.current).x,
        top: () => getCursorPos(publishBtnRef.current).y,
        duration: 0.18,
        ease: 'power2.inOut',
      });
      doClick(cards[2]);

      // Phase 4: completion label
      tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.1 }, '+=0.05');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ height: '380vh' }}>
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        {/* Heading */}
        <div className="text-center mb-8 z-10">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: 'var(--accent-blue)' }}
          >
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Click. Capture. Done.
          </h2>
          <p className="text-base mt-2 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Scroll to see Snapdoc record each click as a documented step.
          </p>
        </div>

        {/* Main demo area */}
        <div className="relative w-full max-w-5xl mx-auto flex items-start gap-6">
          {/* Browser mockup */}
          <div
            ref={browserRef}
            className="relative flex-1 rounded-2xl overflow-hidden opacity-0"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              aspectRatio: '4/3',
            }}
          >
            {/* Browser chrome bar */}
            <div
              className="flex items-center gap-2 px-4 h-10 shrink-0"
              style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-subtle)' }}
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
                  app.myproduct.io/onboarding-guide
                </span>
              </div>
              {/* Snapdoc recording indicator */}
              <div
                className="flex items-center gap-1.5 px-2 py-1 rounded"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#ef4444', animation: 'recPulse 1.2s ease-in-out infinite' }}
                />
                <span className="text-xs font-medium" style={{ color: '#ef4444' }}>REC</span>
              </div>
            </div>

            {/* Content area — cursor is positioned relative to this */}
            <div
              ref={contentAreaRef}
              className="relative"
              style={{ height: 'calc(100% - 40px)' }}
            >
              <FakePage
                dropdownRef={dropdownRef}
                sendBtnRef={sendBtnRef}
                publishBtnRef={publishBtnRef}
                highlightId={null}
              />

              {/* Cursor + click ring together so the ring always follows the cursor */}
              <div
                ref={cursorRef}
                className="absolute pointer-events-none z-30"
                style={{
                  top: '25%',
                  left: '60%',
                  width: 0,
                  height: 0,
                }}
              >
                {/* Click ring — centered on cursor tip */}
                <div
                  ref={clickRingRef}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 36,
                    height: 36,
                    top: -18,
                    left: -18,
                    transform: 'scale(0)',
                    transformOrigin: 'center',
                    background: 'rgba(79,142,247,0.2)',
                    border: '1.5px solid rgba(79,142,247,0.55)',
                    opacity: 0,
                  }}
                />
                {/* Cursor SVG */}
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  style={{
                    position: 'absolute',
                    top: -4,
                    left: -4,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
                  }}
                >
                  <path
                    d="M4 2.5L19 11.5L12.5 13.5L10 21L4 2.5Z"
                    fill="white"
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Step cards panel */}
          <div ref={cardsRef} className="w-64 shrink-0 flex flex-col pt-1">
            <div className="text-xs font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-blue)' }} />
              Snapdoc side panel
            </div>
            {STEPS.map((step, i) => (
              <StepCard key={i} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* Completion badge */}
        <div
          ref={labelRef}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium opacity-0"
          style={{
            transform: 'translateY(12px)',
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.25)',
            color: '#4ade80',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="#4ade80" strokeWidth="1.5" />
            <path d="M4.5 7l2 2 3-3" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          3 steps captured — guide is ready to export
        </div>
      </div>

      <style>{`
        @keyframes recPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </section>
  );
}
