import { DemoTaskBoard } from './DemoTaskBoard';
import { DemoTeamSection } from './DemoTeamSection';

interface DemoAppProps {
  phase: 'capture' | 'change' | 'detect';
  capturedIds: Set<string>;
  onCapture: (id: string) => void;
  onTitleChange: () => void;
  onTaskMoved: () => void;
  onAssigneeRemove: () => void;
}

export function DemoApp({
  phase,
  capturedIds,
  onCapture,
  onTitleChange,
  onTaskMoved,
  onAssigneeRemove,
}: DemoAppProps) {
  const captureMode = phase === 'capture';

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}
    >
      {/* Browser chrome */}
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
          className="flex-1 mx-4 h-6 rounded-md flex items-center px-3 text-xs"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          snapdoc-demo.vercel.app/taskflow
        </div>
        {captureMode && (
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#ef4444', animation: 'recPulse 1.2s ease-in-out infinite' }}
            />
            REC
            <style>{`@keyframes recPulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
          </div>
        )}
      </div>

      {/* App layout */}
      <div className="flex" style={{ minHeight: '480px' }}>
        {/* Sidebar */}
        <div
          className="w-40 shrink-0 p-4 flex flex-col gap-1"
          style={{ borderRight: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.15)' }}
        >
          <div className="text-xs font-semibold mb-2 px-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            WORKSPACE
          </div>
          {['Overview', 'Projects', 'Tasks', 'Team', 'Settings'].map((item, i) => (
            <button
              key={item}
              className="text-left px-3 py-1.5 rounded-lg text-xs transition-colors duration-150"
              style={{
                background: i === 2 ? 'rgba(79,142,247,0.12)' : 'transparent',
                color: i === 2 ? 'var(--accent-blue)' : 'var(--text-secondary)',
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-5 overflow-auto">
          {/* Page title */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Q2 Marketing Campaign
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {captureMode ? 'Capture the task state below' : phase === 'change' ? 'Edit the focused task' : '3 changes detected'}
              </p>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              Active
            </span>
          </div>

          {/* Task board */}
          <DemoTaskBoard
            phase={phase}
            focusedTaskId="t3"
            capturedIds={capturedIds}
            onCapture={onCapture}
            onTitleChange={onTitleChange}
            onTaskMoved={onTaskMoved}
            onAssigneeRemove={onAssigneeRemove}
          />

          {/* Team section — purely decorative in capture/detect, functional in change */}
          <div
            className="rounded-xl p-4 mt-4"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}
          >
            <DemoTeamSection phase={phase} />
          </div>
        </div>
      </div>
    </div>
  );
}
