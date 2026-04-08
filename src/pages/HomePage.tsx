import { Link } from 'react-router-dom';
import { Hero } from '../components/hero/Hero';
import { ScrollMachine } from '../components/scroll-demo/ScrollMachine';
import { ValueProps } from '../components/value-props/ValueProps';
import { SocialProof } from '../components/social-proof/SocialProof';
import { SectionDivider } from '../components/layout/SectionDivider';
import { CtaButton } from '../components/hero/CtaButton';

export function HomePage() {
  return (
    <>
      <Hero />

      <SectionDivider />

      <ScrollMachine />

      <SectionDivider />

      <ValueProps />

      <SectionDivider />

      {/* Interactive demo CTA */}
      <section className="py-24 px-4">
        <div
          className="max-w-5xl mx-auto rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            position: 'relative',
          }}
        >
          {/* Decorative glow */}
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(79,142,247,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-60px',
              left: '-60px',
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div className="grid lg:grid-cols-[1fr_auto] items-center gap-0">
            {/* Left: text */}
            <div className="p-10 lg:p-12">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ color: 'var(--accent-blue)' }}
              >
                Interactive Demo
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                See Snapdoc in action —{' '}
                <span style={{ color: 'var(--accent-blue)' }}>try it yourself</span>
              </h2>
              <p className="text-sm leading-relaxed mb-6 max-w-md" style={{ color: 'var(--text-secondary)' }}>
                A 7-step guided tour on a live task board. Capture a workflow, make real UI changes, then watch Snapdoc find every diff automatically.
              </p>

              {/* Feature list */}
              <div className="flex flex-col gap-2 mb-8">
                {[
                  'Live drag-and-drop task board',
                  'Click fields to capture them',
                  'Real-time diff detection',
                ].map(feature => (
                  <div key={feature} className="flex items-center gap-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4l2 2L6.5 2" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <Link
                to="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-opacity duration-200 hover:opacity-90"
                style={{ backgroundImage: 'linear-gradient(135deg,#4f8ef7,#8b5cf6)' }}
              >
                Try Interactive Demo
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                No account needed · Opens in a full-page editor
              </p>
            </div>

            {/* Right: static demo preview */}
            <div
              className="hidden lg:block w-80 self-stretch relative overflow-hidden"
              style={{ borderLeft: '1px solid var(--border-subtle)' }}
            >
              <div style={{ background: 'var(--bg-surface)', height: '100%', minHeight: '340px' }}>
                {/* Fake browser chrome */}
                <div
                  className="flex items-center gap-2 px-3 h-9 shrink-0"
                  style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
                  </div>
                  <div
                    className="flex-1 h-5 rounded text-xs flex items-center px-2"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '9px' }}
                  >
                    snapdoc-demo.vercel.app
                  </div>
                  <div
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '9px' }}
                  >
                    <div className="w-1 h-1 rounded-full" style={{ background: '#ef4444' }} />
                    REC
                  </div>
                </div>

                {/* Fake task columns */}
                <div className="p-3 grid grid-cols-3 gap-2" style={{ marginTop: '4px' }}>
                  {['To Do', 'In Progress', 'Done'].map((col, ci) => (
                    <div key={col}>
                      <div className="text-xs font-semibold mb-1.5 px-0.5" style={{ color: 'var(--text-muted)', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {col}
                      </div>
                      <div className="rounded-lg p-1.5 space-y-1.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                        {ci === 0 && (
                          <>
                            <div className="rounded-lg p-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                              <div className="h-1.5 rounded mb-1.5" style={{ background: 'rgba(79,142,247,0.3)', width: '80%' }} />
                              <div className="h-1 rounded" style={{ background: 'rgba(79,142,247,0.18)', width: '35%' }} />
                            </div>
                            <div className="rounded-lg p-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                              <div className="h-1.5 rounded mb-1.5" style={{ background: 'rgba(139,92,246,0.3)', width: '70%' }} />
                              <div className="h-1 rounded" style={{ background: 'rgba(139,92,246,0.18)', width: '28%' }} />
                            </div>
                          </>
                        )}
                        {ci === 1 && (
                          <>
                            <div className="rounded-lg p-2" style={{ background: 'var(--bg-elevated)', border: '1.5px solid rgba(79,142,247,0.35)', boxShadow: '0 0 0 3px rgba(79,142,247,0.06)' }}>
                              <div className="h-1 rounded mb-1" style={{ background: 'rgba(16,185,129,0.4)', width: '45%' }} />
                              <div className="h-1.5 rounded mb-1" style={{ background: 'rgba(255,255,255,0.15)', width: '88%' }} />
                              <div className="h-1 rounded" style={{ background: 'rgba(245,158,11,0.3)', width: '55%' }} />
                            </div>
                            <div className="rounded-lg p-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                              <div className="h-1.5 rounded mb-1.5" style={{ background: 'rgba(245,158,11,0.3)', width: '75%' }} />
                              <div className="h-1 rounded" style={{ background: 'rgba(245,158,11,0.18)', width: '22%' }} />
                            </div>
                          </>
                        )}
                        {ci === 2 && (
                          <div className="rounded-lg p-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                            <div className="h-1.5 rounded mb-1.5" style={{ background: 'rgba(79,142,247,0.25)', width: '65%' }} />
                            <div className="h-1 rounded" style={{ background: 'rgba(79,142,247,0.15)', width: '30%' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fake guided tour panel hint */}
                <div className="mx-3 mt-2 rounded-xl p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundImage: 'linear-gradient(135deg,#4f8ef7,#8b5cf6)' }} />
                    <div className="h-1.5 rounded" style={{ background: 'rgba(255,255,255,0.2)', width: '60%' }} />
                  </div>
                  <div className="space-y-1 mb-2.5">
                    <div className="h-1 rounded" style={{ background: 'rgba(255,255,255,0.08)', width: '100%' }} />
                    <div className="h-1 rounded" style={{ background: 'rgba(255,255,255,0.08)', width: '85%' }} />
                  </div>
                  <div className="h-5 rounded-lg" style={{ backgroundImage: 'linear-gradient(135deg,rgba(79,142,247,0.4),rgba(139,92,246,0.4))' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <SocialProof />

      <SectionDivider />

      {/* Final CTA */}
      <section className="py-24 px-6 text-center max-w-3xl mx-auto">
        <div
          className="rounded-2xl p-12"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Stop redoing docs that didn't need to change.
          </h2>
          <p className="text-base mb-8 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Snapdoc is free, private by default, and installs in 30 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CtaButton href="https://chrome.google.com/webstore" external variant="primary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="white" strokeWidth="1.5" />
                <circle cx="8" cy="8" r="3" fill="white" />
              </svg>
              Install for Chrome — Free
            </CtaButton>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
              }}
            >
              Try the demo first
            </Link>
          </div>
          <p className="text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            Your guides stay on your machine. No account needed.
          </p>
        </div>
      </section>
    </>
  );
}
