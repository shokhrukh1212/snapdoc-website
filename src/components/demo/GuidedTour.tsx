import { useState, useEffect } from 'react';
import { DemoApp } from './DemoApp';
import { WIZARD_KEY, clearDemoStorage } from './demoStorage';

type Phase = 'capture' | 'change' | 'detect';

interface StepConfig {
  stepNum: number;
  phase: Phase;
  title: string;
  description: string;
  action?: string;
  demoPhase: 'capture' | 'change' | 'detect';
}

const STEPS: StepConfig[] = [
  {
    stepNum: 1,
    phase: 'capture',
    title: 'Install Snapdoc',
    description: "Install Snapdoc from the Chrome Web Store. It's free and takes 30 seconds.",
    action: 'Install Snapdoc →',
    demoPhase: 'capture',
  },
  {
    stepNum: 2,
    phase: 'capture',
    title: 'Start capturing',
    description: 'Open Snapdoc\'s side panel, then click "Start Capture." Snapdoc will now record every click you make.',
    demoPhase: 'capture',
  },
  {
    stepNum: 3,
    phase: 'capture',
    title: 'Capture this task\'s state',
    description: 'With Snapdoc capturing, click the task title, its status badge, and the assignee in the highlighted card below.',
    demoPhase: 'capture',
  },
  {
    stepNum: 4,
    phase: 'change',
    title: 'Stop & save the guide',
    description: 'Back in Snapdoc\'s side panel, click "Stop." Name the guide and save it. You now have a 3-step guide documenting this task\'s state.',
    demoPhase: 'change',
  },
  {
    stepNum: 5,
    phase: 'change',
    title: 'Simulate a sprint update',
    description: 'The sprint ended and things changed. Make these 3 updates to the task below — this is what a real UI update looks like.',
    demoPhase: 'change',
  },
  {
    stepNum: 6,
    phase: 'detect',
    title: 'Run "Check for Changes"',
    description: 'Open your saved guide in Snapdoc and click "Check for Changes." Snapdoc visits this page and compares every captured element.',
    demoPhase: 'detect',
  },
  {
    stepNum: 7,
    phase: 'detect',
    title: 'Snapdoc found 3 changes',
    description: 'Without you doing anything, Snapdoc detected every change — text, position, and missing element. Only the broken steps need updating.',
    demoPhase: 'detect',
  },
];

const TOTAL_STEPS = STEPS.length;

interface PersistedWizardState {
  stepIdx: number;
  capturedIds: string[];
  titleChanged: boolean;
  taskMoved: boolean;
  assigneeRemoved: boolean;
}

function loadWizardState(): PersistedWizardState | null {
  try {
    const raw = localStorage.getItem(WIZARD_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedWizardState;
  } catch {
    return null;
  }
}

function saveWizardState(state: PersistedWizardState) {
  try {
    localStorage.setItem(WIZARD_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable
  }
}

function PhaseTrack({ phase }: { phase: Phase }) {
  const phases: { id: Phase; label: string; num: number }[] = [
    { id: 'capture', label: 'Capture', num: 1 },
    { id: 'change', label: 'Change', num: 2 },
    { id: 'detect', label: 'Detect', num: 3 },
  ];
  const order: Phase[] = ['capture', 'change', 'detect'];
  const currentIdx = order.indexOf(phase);

  return (
    <div className="flex items-center gap-1">
      {phases.map((p, i) => {
        const done = i < currentIdx;
        const active = p.id === phase;
        return (
          <div key={p.id} className="flex items-center gap-1">
            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: done ? 'rgba(16,185,129,0.2)' : active ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.06)',
                  border: active ? 'none' : '1px solid var(--border-subtle)',
                  color: done ? '#10b981' : active ? 'white' : 'var(--text-muted)',
                  backgroundImage: active ? 'linear-gradient(135deg,#4f8ef7,#8b5cf6)' : undefined,
                  transition: 'all 0.3s',
                }}
              >
                {done ? (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5l2.5 2.5L7.5 2" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ) : p.num}
              </div>
              <span className="text-xs font-medium" style={{ color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {p.label}
              </span>
            </div>
            {i < phases.length - 1 && (
              <div className="w-5 h-px mx-1" style={{ background: done ? '#10b981' : 'var(--border-subtle)', transition: 'background 0.4s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProgressItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-300 whitespace-nowrap"
      style={{
        background: done ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.03)',
        border: done ? '1px solid rgba(16,185,129,0.2)' : '1px solid var(--border-subtle)',
        color: done ? '#10b981' : 'var(--text-secondary)',
      }}
    >
      <div
        className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 transition-all duration-300"
        style={{
          background: done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
          border: done ? '1px solid rgba(16,185,129,0.35)' : '1px solid var(--border-subtle)',
        }}
      >
        {done && (
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4l2 2L6.5 2" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>
      {label}
    </div>
  );
}

function DiffResult({ label, type }: { label: string; type: 'changed' | 'missing' }) {
  const color = type === 'missing' ? '#ef4444' : '#f59e0b';
  const badge = type === 'missing' ? 'Missing' : 'Changed';
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap"
      style={{ background: `${color}0a`, border: `1px solid ${color}25` }}
    >
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className="px-1.5 py-0.5 rounded text-xs font-semibold" style={{ background: `${color}18`, color }}>
        {badge}
      </span>
    </div>
  );
}

export function GuidedTour() {
  const [stepIdx, setStepIdx] = useState<number>(() => loadWizardState()?.stepIdx ?? 0);
  const [capturedIds, setCapturedIds] = useState<Set<string>>(() => new Set(loadWizardState()?.capturedIds ?? []));
  const [titleChanged, setTitleChanged] = useState<boolean>(() => loadWizardState()?.titleChanged ?? false);
  const [taskMoved, setTaskMoved] = useState<boolean>(() => loadWizardState()?.taskMoved ?? false);
  const [assigneeRemoved, setAssigneeRemoved] = useState<boolean>(() => loadWizardState()?.assigneeRemoved ?? false);
  const [boardKey, setBoardKey] = useState(0);

  useEffect(() => {
    saveWizardState({
      stepIdx,
      capturedIds: [...capturedIds],
      titleChanged,
      taskMoved,
      assigneeRemoved,
    });
  }, [stepIdx, capturedIds, titleChanged, taskMoved, assigneeRemoved]);

  const step = STEPS[stepIdx] ?? STEPS[STEPS.length - 1];
  const isLastStep = stepIdx === STEPS.length - 1;

  const allCaptured = capturedIds.has('task-title') && capturedIds.has('task-status') && capturedIds.has('task-assignee');
  const allChanged = titleChanged && taskMoved && assigneeRemoved;

  const canAdvance = () => {
    if (step.stepNum === 3) return allCaptured;
    if (step.stepNum === 5) return allChanged;
    return true;
  };

  const handleCapture = (id: string) => setCapturedIds(prev => new Set([...prev, id]));
  const handleNext = () => {
    if (!canAdvance()) return;
    if (isLastStep) setStepIdx(TOTAL_STEPS);
    else setStepIdx(i => i + 1);
  };
  const handleBack = () => setStepIdx(i => Math.max(i - 1, 0));
  const handleReset = () => {
    clearDemoStorage();
    setStepIdx(0);
    setCapturedIds(new Set());
    setTitleChanged(false);
    setTaskMoved(false);
    setAssigneeRemoved(false);
    setBoardKey(k => k + 1);
  };

  // Done state
  if (stepIdx >= TOTAL_STEPS) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 gap-6">
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
            Snapdoc found 3 real changes — text, position, and missing element — without you lifting a finger. That's what keeps your docs alive.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
            style={{ backgroundImage: 'linear-gradient(135deg,#4f8ef7,#8b5cf6)' }}
          >
            Install Snapdoc — Free
          </a>
          <button
            onClick={handleReset}
            className="px-5 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Sticky horizontal wizard bar ── */}
      <div
        className="sticky top-16 z-20 rounded-2xl"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
      >
        <div className="flex items-start gap-0">

          {/* Left column: phase track + progress bar */}
          <div className="shrink-0 flex flex-col justify-between gap-3 p-5" style={{ minWidth: '200px' }}>
            <PhaseTrack phase={step.phase} />
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(step.stepNum / TOTAL_STEPS) * 100}%`,
                    backgroundImage: 'linear-gradient(90deg,#4f8ef7,#8b5cf6)',
                  }}
                />
              </div>
              <span className="text-xs shrink-0 tabular-nums" style={{ color: 'var(--text-muted)' }}>
                {step.stepNum}/{TOTAL_STEPS}
              </span>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="self-stretch w-px shrink-0" style={{ background: 'var(--border-subtle)' }} />

          {/* Center column: step title + description + step-specific content */}
          <div className="flex-1 min-w-0 p-5">
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              {step.title}
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', maxWidth: '560px' }}>
              {step.description}
            </p>

            {/* Step 3: capture checklist */}
            {step.stepNum === 3 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <ProgressItem label="Task title" done={capturedIds.has('task-title')} />
                <ProgressItem label="Status badge" done={capturedIds.has('task-status')} />
                <ProgressItem label="Assignee" done={capturedIds.has('task-assignee')} />
                <span className="text-xs" style={{ color: allCaptured ? '#10b981' : 'var(--text-muted)' }}>
                  {allCaptured ? '✓ All captured — click Continue' : `${capturedIds.size}/3 — click each field below`}
                </span>
              </div>
            )}

            {/* Step 5: change checklist */}
            {step.stepNum === 5 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <ProgressItem label="Edit title" done={titleChanged} />
                <ProgressItem label="Drag card" done={taskMoved} />
                <ProgressItem label="Remove assignee" done={assigneeRemoved} />
                <span className="text-xs" style={{ color: allChanged ? '#10b981' : 'var(--text-muted)' }}>
                  {allChanged
                    ? '✓ All done — click Continue'
                    : `${[titleChanged, taskMoved, assigneeRemoved].filter(Boolean).length}/3 done`}
                </span>
              </div>
            )}

            {/* Steps 6–7: diff results */}
            {(step.stepNum === 6 || step.stepNum === 7) && (
              <div className="mt-3 flex flex-wrap gap-2">
                <DiffResult label="Task title" type="changed" />
                <DiffResult label="Status badge" type="changed" />
                <DiffResult label="Assignee" type="missing" />
              </div>
            )}
          </div>

          {/* Vertical divider */}
          <div className="self-stretch w-px shrink-0" style={{ background: 'var(--border-subtle)' }} />

          {/* Right column: nav buttons + reset/skip */}
          <div className="shrink-0 flex flex-col justify-between gap-2 p-5" style={{ minWidth: '200px' }}>
            {/* Primary nav */}
            <div className="flex gap-2">
              {stepIdx > 0 && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150"
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
                  className="flex-1 py-2 rounded-xl text-sm font-semibold text-center text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundImage: 'linear-gradient(135deg,#4f8ef7,#8b5cf6)' }}
                  onClick={() => setTimeout(() => setStepIdx(i => i + 1), 600)}
                >
                  {step.action}
                </a>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canAdvance()}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                  style={{
                    backgroundImage: canAdvance() ? 'linear-gradient(135deg,#4f8ef7,#8b5cf6)' : undefined,
                    background: canAdvance() ? undefined : 'rgba(255,255,255,0.07)',
                    color: canAdvance() ? 'white' : 'var(--text-muted)',
                    cursor: canAdvance() ? 'pointer' : 'not-allowed',
                  }}
                >
                  {isLastStep ? 'See the summary →' : 'Continue →'}
                </button>
              )}
            </div>

            {/* Secondary: skip + reset */}
            <div className="flex items-center justify-between">
              {step.stepNum === 1 ? (
                <button
                  onClick={() => setStepIdx(1)}
                  className="text-xs transition-colors duration-150"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  Already installed? Skip →
                </button>
              ) : (
                <span />
              )}
              <button
                onClick={handleReset}
                className="text-xs transition-colors duration-150 ml-auto"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                Reset
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Full-width demo app ── */}
      <DemoApp
        key={boardKey}
        phase={step.demoPhase}
        capturedIds={capturedIds}
        onCapture={handleCapture}
        onTitleChange={() => setTitleChanged(true)}
        onTaskMoved={() => setTaskMoved(true)}
        onAssigneeRemove={() => setAssigneeRemoved(true)}
      />

    </div>
  );
}
