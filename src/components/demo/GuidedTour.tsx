import { useState } from 'react';
import { DemoApp } from './DemoApp';

type Phase = 'intro' | 'capture' | 'change' | 'detect' | 'done';

interface StepConfig {
  phase: Phase;
  stepNum: number;
  totalSteps: number;
  title: string;
  description: string;
  action?: string;
  highlights?: {
    title?: boolean;
    taskId?: string | null;
    memberId?: string | null;
  };
  demoPhase: 'capture' | 'change' | 'detect';
  requiresChecks?: string[];
}

const STEPS: StepConfig[] = [
  {
    phase: 'capture',
    stepNum: 1,
    totalSteps: 7,
    title: 'Install Snapdoc',
    description:
      'First, install Snapdoc from the Chrome Web Store. It\'s free and takes 30 seconds.',
    action: 'Install Snapdoc →',
    demoPhase: 'capture',
  },
  {
    phase: 'capture',
    stepNum: 2,
    totalSteps: 7,
    title: 'Start capturing',
    description:
      'Open Snapdoc\'s side panel (click the extension icon), then click "Start Capture." Snapdoc will now record your clicks.',
    demoPhase: 'capture',
  },
  {
    phase: 'capture',
    stepNum: 3,
    totalSteps: 7,
    title: 'Click these 3 elements',
    description:
      'With Snapdoc capturing, click each highlighted element below in the demo. Snapdoc captures a step for each click.',
    highlights: { title: true, taskId: 't3', memberId: 'm2' },
    demoPhase: 'capture',
  },
  {
    phase: 'change',
    stepNum: 4,
    totalSteps: 7,
    title: 'Stop the capture',
    description:
      'Back in Snapdoc\'s side panel, click "Stop." Give your guide a name and save it. You now have a 3-step guide.',
    demoPhase: 'change',
  },
  {
    phase: 'change',
    stepNum: 5,
    totalSteps: 7,
    title: 'Simulate a UI update',
    description:
      'The UI just "changed." Make these 3 changes to the demo below — this represents a product update happening:',
    requiresChecks: ['Edit the project title', 'Drag a task card to a new column', 'Remove a team member'],
    demoPhase: 'change',
  },
  {
    phase: 'change',
    stepNum: 6,
    totalSteps: 7,
    title: 'Changes applied',
    description:
      'The demo now reflects an updated UI. Real users would re-screenshot everything manually. With Snapdoc, you don\'t have to.',
    demoPhase: 'change',
  },
  {
    phase: 'detect',
    stepNum: 7,
    totalSteps: 7,
    title: 'Check for changes',
    description:
      'Back in Snapdoc, open your saved guide and click "Check for Changes." Snapdoc revisits this page, finds each element, and flags what broke.',
    demoPhase: 'detect',
  },
];

function PhaseIndicator({ current }: { phase: Phase; current: Phase }) {
  const phases: { id: Phase; label: string }[] = [
    { id: 'capture', label: 'Capture' },
    { id: 'change', label: 'Change' },
    { id: 'detect', label: 'Detect' },
  ];

  const order = ['capture', 'change', 'detect'];
  const currentIdx = order.indexOf(current);

  return (
    <div className="flex items-center gap-1">
      {phases.map((p, i) => {
        const idx = order.indexOf(p.id);
        const isActive = p.id === current;
        const isDone = idx < currentIdx;
        return (
          <div key={p.id} className="flex items-center gap-1">
            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={{
                  background: isDone
                    ? 'rgba(16,185,129,0.2)'
                    : isActive
                    ? 'var(--gradient-primary)'
                    : 'rgba(255,255,255,0.06)',
                  border: isActive ? 'none' : '1px solid var(--border-subtle)',
                  color: isDone ? '#10b981' : isActive ? 'white' : 'var(--text-muted)',
                }}
              >
                {isDone ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                {p.label}
              </span>
            </div>
            {i < phases.length - 1 && (
              <div
                className="w-8 h-px mx-1"
                style={{ background: isDone ? '#10b981' : 'var(--border-subtle)' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CheckItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div
        className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all duration-300"
        style={{
          background: done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
          border: done ? '1px solid rgba(16,185,129,0.4)' : '1px solid var(--border-subtle)',
        }}
      >
        {done && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4l2 2L6.5 2" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <span
        className="text-xs transition-colors duration-300"
        style={{
          color: done ? 'var(--text-primary)' : 'var(--text-secondary)',
          textDecoration: done ? 'none' : 'none',
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function GuidedTour() {
  const [stepIdx, setStepIdx] = useState(0);
  const [titleChanged, setTitleChanged] = useState(false);
  const [taskMoved, setTaskMoved] = useState(false);
  const [memberRemoved, setMemberRemoved] = useState(false);

  const step = STEPS[stepIdx];
  const isLastStep = stepIdx === STEPS.length - 1;

  const changesDone = [titleChanged, taskMoved, memberRemoved];
  const allChangesDone = changesDone.every(Boolean);

  const canAdvance = () => {
    if (step.stepNum === 5) return allChangesDone;
    return true;
  };

  const handleNext = () => {
    if (!canAdvance()) return;
    if (isLastStep) {
      setStepIdx(prev => prev + 1); // show done state
    } else {
      setStepIdx(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setStepIdx(prev => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setStepIdx(0);
    setTitleChanged(false);
    setTaskMoved(false);
    setMemberRemoved(false);
  };

  // Done state
  if (stepIdx >= STEPS.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 gap-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14l5.5 5.5L22 8.5" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            You've seen the magic.
          </h3>
          <p className="text-base max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Snapdoc detected 3 real changes — text, position, and missing element — without you doing anything. That's what keeps your docs alive.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: 'var(--gradient-primary)' }}
          >
            Install Snapdoc — Free
          </a>
          <button
            onClick={handleReset}
            className="px-5 py-3 rounded-xl text-sm font-medium transition-colors duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const currentPhase: Phase = step.phase;

  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-8 items-start">
      {/* Left panel: wizard */}
      <div
        className="rounded-2xl p-6 sticky top-24"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        {/* Phase indicator */}
        <div className="mb-6">
          <PhaseIndicator phase={currentPhase} current={currentPhase} />
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="h-1 flex-1 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((step.stepNum) / 7) * 100}%`,
                background: 'var(--gradient-primary)',
              }}
            />
          </div>
          <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
            {step.stepNum}/{step.totalSteps}
          </span>
        </div>

        {/* Step title */}
        <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {step.title}
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          {step.description}
        </p>

        {/* Check items for step 5 */}
        {step.requiresChecks && (
          <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
            <CheckItem label="Edit the project title" done={titleChanged} />
            <CheckItem label="Drag a task card to a new column" done={taskMoved} />
            <CheckItem label="Remove a team member" done={memberRemoved} />
          </div>
        )}

        {/* Hint for step 3 */}
        {step.stepNum === 3 && (
          <div
            className="mb-4 p-3 rounded-xl text-xs"
            style={{
              background: 'rgba(79,142,247,0.08)',
              border: '1px solid rgba(79,142,247,0.15)',
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ color: 'var(--accent-blue)' }}>Tip:</span> The highlighted elements in the demo are the ones to click. Snapdoc will record each one.
          </div>
        )}

        {/* Detect result indicators for step 7 */}
        {step.stepNum === 7 && (
          <div className="mb-4 space-y-2">
            {[
              { label: 'Project title — Text changed', status: 'changed', color: '#f59e0b' },
              { label: 'Task card — Position shifted', status: 'changed', color: '#f59e0b' },
              { label: 'Team member — Element missing', status: 'missing', color: '#ef4444' },
            ].map(item => (
              <div
                key={item.label}
                className="flex items-center gap-2 p-2 rounded-lg text-xs"
                style={{
                  background: `${item.color}10`,
                  border: `1px solid ${item.color}25`,
                  color: 'var(--text-secondary)',
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-2 mt-2">
          {stepIdx > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Back
            </button>
          )}
          {step.action ? (
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center text-white transition-opacity duration-200 hover:opacity-90"
              style={{ background: 'var(--gradient-primary)' }}
              onClick={() => setTimeout(() => setStepIdx(s => s + 1), 800)}
            >
              {step.action}
            </a>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canAdvance()}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: canAdvance() ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.08)',
                color: canAdvance() ? 'white' : 'var(--text-muted)',
                cursor: canAdvance() ? 'pointer' : 'not-allowed',
              }}
            >
              {isLastStep ? 'See the results →' : 'Continue →'}
            </button>
          )}
        </div>

        {/* Skip note for step 1 */}
        {step.stepNum === 1 && (
          <button
            onClick={() => setStepIdx(1)}
            className="w-full mt-2 text-xs text-center transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            Already installed? Skip →
          </button>
        )}
      </div>

      {/* Right panel: demo app */}
      <div>
        <DemoApp
          phase={step.demoPhase}
          highlightElements={step.highlights}
          onTitleChanged={() => setTitleChanged(true)}
          onTaskMoved={() => setTaskMoved(true)}
          onMemberRemoved={() => setMemberRemoved(true)}
        />

        {/* Phase label */}
        <div className="mt-3 flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background:
                step.demoPhase === 'capture'
                  ? 'var(--accent-blue)'
                  : step.demoPhase === 'change'
                  ? '#f59e0b'
                  : '#10b981',
            }}
          />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {step.demoPhase === 'capture'
              ? 'Demo in capture mode — click the highlighted elements'
              : step.demoPhase === 'change'
              ? 'Demo in edit mode — make the changes listed on the left'
              : 'Demo shows the post-update state that Snapdoc analyzes'}
          </span>
        </div>
      </div>
    </div>
  );
}
