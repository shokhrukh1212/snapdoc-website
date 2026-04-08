import { Hero } from '../components/hero/Hero';
import { ScrollMachine } from '../components/scroll-demo/ScrollMachine';
import { ValueProps } from '../components/value-props/ValueProps';
import { GuidedTour } from '../components/demo/GuidedTour';
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

      {/* Guided demo section */}
      <section id="demo" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: 'var(--accent-blue)' }}
          >
            Interactive Demo
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Try it yourself, right here
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Follow the 7-step guide. Install Snapdoc, capture a workflow on this demo app, change the UI, then watch the diff engine find every change automatically.
          </p>
        </div>
        <GuidedTour />
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
            <CtaButton href="#demo" variant="secondary">
              Try the demo first
            </CtaButton>
          </div>
          <p className="text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            Your guides stay on your machine. No account needed.
          </p>
        </div>
      </section>
    </>
  );
}
