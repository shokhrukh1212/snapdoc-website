import { useEffect } from 'react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h2>
      <div className="space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </section>
  );
}

export function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: 'var(--accent-blue)' }}
          >
            Legal
          </p>
          <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px mb-12" style={{ background: 'var(--border-subtle)' }} />

        {/* Summary callout */}
        <div
          className="rounded-xl p-5 mb-10 text-sm leading-relaxed"
          style={{
            background: 'rgba(79,142,247,0.06)',
            border: '1px solid rgba(79,142,247,0.15)',
            color: 'var(--text-secondary)',
          }}
        >
          <strong style={{ color: 'var(--text-primary)' }}>Summary:</strong> Snapdoc helps users capture browser workflows and turn them into step-by-step guides. It only captures when you click Start. Your guide data stays local unless you explicitly export it or use AI captions. We do not sell your data.
        </div>

        <Section title="What Snapdoc captures">
          <p>Snapdoc only captures browser activity when you explicitly start a capture session. There is no background recording.</p>
          <p>When a capture session is active, Snapdoc stores:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>The clicked page URL and page title</li>
            <li>Element metadata (CSS selector, text content, position, tag name)</li>
            <li>Screenshots of the visible browser tab, cropped around the clicked element</li>
          </ul>
        </Section>

        <Section title="What stays local">
          <p>Guides, screenshots, project metadata, and settings are stored in your browser extension's local storage on your machine. Snapdoc does not have a server that receives or stores your guides.</p>
        </Section>

        <Section title="What leaves the browser">
          <p>The following data leaves your device only when you explicitly use specific features:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>AI captions:</strong> When you generate captions, Snapdoc sends step metadata (URL, element type, text) to your configured AI provider (e.g. Anthropic). Screenshots are not sent unless the AI provider you configure supports it.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Notion export:</strong> When you export a guide to Notion, Snapdoc sends guide text and screenshots to your connected Notion workspace via the Notion API.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>OAuth:</strong> When you connect Notion, Snapdoc uses Chrome's built-in identity API to complete the connection flow. No credentials are stored by Snapdoc.
            </li>
          </ul>
        </Section>

        <Section title="What Snapdoc does not do">
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Snapdoc does not capture anything until the user starts a capture.</li>
            <li>Snapdoc does not record in the background when a capture session is inactive.</li>
            <li>Snapdoc does not upload guide data unless the user explicitly uses AI captions or export features.</li>
            <li>Snapdoc does not sell, share, or analyze your data for advertising or analytics purposes.</li>
            <li>Snapdoc does not require an account or login to use.</li>
          </ul>
        </Section>

        <Section title="Permissions">
          <p>Snapdoc requests the following Chrome permissions, each with a specific purpose:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong style={{ color: 'var(--text-primary)' }}>activeTab, tabs, scripting:</strong> To capture the current workflow and run change checks by injecting a content script into the active tab.</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>sidePanel:</strong> To display the Snapdoc interface in Chrome's side panel.</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>storage, unlimitedStorage:</strong> To save projects, screenshots, and settings locally on your machine.</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>offscreen:</strong> To crop screenshots using an offscreen Canvas document.</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>identity:</strong> Used only for Notion OAuth authentication.</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>downloads:</strong> To allow you to export guides as a Markdown download.</li>
          </ul>
        </Section>

        <Section title="Contact">
          <p>
            For privacy questions or concerns about Snapdoc, please contact us. This contact information will be updated before the Chrome Web Store submission is finalized.
          </p>
        </Section>
      </div>
    </div>
  );
}
