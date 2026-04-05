import { useState, useRef } from 'react';
import { DemoTaskBoard } from './DemoTaskBoard';
import { DemoTeamSection } from './DemoTeamSection';

interface DemoAppProps {
  phase: 'capture' | 'change' | 'detect';
  highlightElements?: {
    title?: boolean;
    taskId?: string | null;
    memberId?: string | null;
  };
  onTitleChanged?: () => void;
  onTaskMoved?: () => void;
  onMemberRemoved?: () => void;
}

export function DemoApp({
  phase,
  highlightElements = {},
  onTitleChanged,
  onTaskMoved,
  onMemberRemoved,
}: DemoAppProps) {
  const [title] = useState('Q2 Marketing Campaign');
  const [titleChanged, setTitleChanged] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const editMode = phase === 'change';

  const handleTitleInput = () => {
    if (!titleChanged && titleRef.current) {
      const newText = titleRef.current.innerText.trim();
      if (newText !== 'Q2 Marketing Campaign') {
        setTitleChanged(true);
        onTitleChanged?.();
      }
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}
    >
      {/* App header bar */}
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
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          snapdoc-demo.vercel.app/taskflow
        </div>
      </div>

      {/* App layout */}
      <div className="flex" style={{ minHeight: '520px' }}>
        {/* Sidebar */}
        <div
          className="w-48 shrink-0 p-4 flex flex-col gap-1"
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
        <div className="flex-1 p-6 overflow-auto">
          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              {/* Editable title */}
              <h2
                ref={titleRef}
                data-testid="project-title"
                contentEditable={editMode}
                suppressContentEditableWarning
                onInput={handleTitleInput}
                className="text-lg font-bold mb-1 rounded-md transition-all duration-200"
                style={{
                  color: 'var(--text-primary)',
                  outline: 'none',
                  border: highlightElements.title
                    ? '2px dashed rgba(79,142,247,0.5)'
                    : editMode && !titleChanged
                    ? '1px dashed rgba(255,255,255,0.15)'
                    : '1px solid transparent',
                  padding: editMode ? '2px 8px' : '2px 0',
                  cursor: editMode ? 'text' : 'default',
                  background: highlightElements.title
                    ? 'rgba(79,142,247,0.05)'
                    : editMode
                    ? 'rgba(255,255,255,0.03)'
                    : 'transparent',
                  boxShadow: highlightElements.title ? '0 0 0 3px rgba(79,142,247,0.15)' : 'none',
                  minWidth: '200px',
                  display: 'inline-block',
                }}
                title={editMode ? 'Click to edit project title' : undefined}
              >
                {title}
              </h2>
              {editMode && !titleChanged && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Click the title above to edit it
                </p>
              )}
              {titleChanged && (
                <p className="text-xs" style={{ color: '#10b981' }}>
                  ✓ Title changed
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(16,185,129,0.1)',
                  color: '#10b981',
                  border: '1px solid rgba(16,185,129,0.2)',
                }}
              >
                Active
              </span>
            </div>
          </div>

          {/* Task board */}
          <div className="mb-6">
            <DemoTaskBoard
              highlightTaskId={highlightElements.taskId}
              onTaskMoved={() => onTaskMoved?.()}
            />
          </div>

          {/* Team section */}
          <div
            className="rounded-xl p-4"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}
          >
            <DemoTeamSection
              highlightMemberId={highlightElements.memberId}
              onMemberRemoved={() => onMemberRemoved?.()}
              editMode={editMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
