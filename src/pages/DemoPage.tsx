import { Link } from 'react-router-dom';
import { GuidedTour } from '../components/demo/GuidedTour';

export function DemoPage() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      {/* Page header */}
      <div className="pt-24 pb-8 px-6 lg:px-10">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to home
          </Link>
        </div>

        <div className="text-center">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: 'var(--accent-blue)' }}
          >
            Interactive Demo
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Try it yourself, right here
          </h1>
          <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Follow the 7-step guide. Install Snapdoc, capture a workflow on this demo app, change the UI, then watch the diff engine find every change automatically.
          </p>
        </div>
      </div>

      {/* Full-width demo — no max-width constraint */}
      <div className="px-6 lg:px-10 pb-16">
        <GuidedTour />
      </div>

      {/* Bottom CTA */}
      <div
        className="px-6 py-10 text-center"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Ready to use Snapdoc on your own workflows?
        </p>
        <a
          href="https://chrome.google.com/webstore"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-opacity duration-200 hover:opacity-90"
          style={{ backgroundImage: 'linear-gradient(135deg,#4f8ef7,#8b5cf6)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="white" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="3" fill="white" />
          </svg>
          Install Snapdoc — Free
        </a>
        <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          Free · Private by default · Installs in 30 seconds
        </p>
      </div>
    </div>
  );
}
