import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TASKS_KEY as TASKS_STORAGE_KEY, TASKS_EXTRA_KEY as EXTRA_KEY } from './demoStorage';

export interface Task {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  priority: 'high' | 'medium' | 'low';
  column: string;
}

const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#6b7280' };

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Update onboarding screenshots', tag: 'Docs', tagColor: '#4f8ef7', priority: 'high', column: 'todo' },
  { id: 't2', title: 'Review API endpoint changes', tag: 'Dev', tagColor: '#8b5cf6', priority: 'medium', column: 'todo' },
  { id: 't3', title: 'Publish Q2 release notes', tag: 'Content', tagColor: '#10b981', priority: 'high', column: 'in-progress' },
  { id: 't4', title: 'Check diff on settings page', tag: 'QA', tagColor: '#f59e0b', priority: 'medium', column: 'in-progress' },
  { id: 't5', title: 'Archive v1 documentation', tag: 'Docs', tagColor: '#4f8ef7', priority: 'low', column: 'done' },
];

const COLUMNS = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

const STATUS_LABELS: Record<string, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
};
const STATUS_COLORS: Record<string, string> = {
  'todo': '#6b7280',
  'in-progress': '#f59e0b',
  'done': '#10b981',
};

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return INITIAL_TASKS;
    const parsed = JSON.parse(raw) as Task[];
    // Validate basic shape to protect against stale data
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_TASKS;
    return parsed;
  } catch {
    return INITIAL_TASKS;
  }
}

function loadExtra(): { assigneeRemoved: boolean } {
  try {
    const raw = localStorage.getItem(EXTRA_KEY);
    if (!raw) return { assigneeRemoved: false };
    return JSON.parse(raw) as { assigneeRemoved: boolean };
  } catch {
    return { assigneeRemoved: false };
  }
}

interface ExpandedTaskCardProps {
  task: Task;
  phase: 'capture' | 'change' | 'detect';
  capturedIds: Set<string>;
  titleChanged: boolean;
  assigneeRemoved: boolean;
  onCapture: (id: string) => void;
  onTitleChange: () => void;
  onTitleTextChange: (newTitle: string) => void;
  onAssigneeRemove: () => void;
}

// Helper: field-level border/background depending on capture state
function fieldStyle(
  captured: boolean,
  captureMode: boolean,
  editMode: boolean,
  extra: React.CSSProperties = {}
): React.CSSProperties {
  return {
    borderRadius: '10px',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
    outline: 'none',
    border: captured
      ? '1.5px solid rgba(16,185,129,0.5)'
      : captureMode
      ? '1.5px solid rgba(79,142,247,0.45)'
      : editMode
      ? '1.5px dashed rgba(255,255,255,0.12)'
      : '1px solid var(--border-subtle)',
    background: captured
      ? 'rgba(16,185,129,0.07)'
      : captureMode
      ? 'rgba(79,142,247,0.07)'
      : editMode
      ? 'rgba(255,255,255,0.03)'
      : 'rgba(255,255,255,0.03)',
    boxShadow: captured
      ? '0 0 0 3px rgba(16,185,129,0.09)'
      : captureMode
      ? '0 0 0 3px rgba(79,142,247,0.09)'
      : 'none',
    ...extra,
  };
}

// The focal task card — vertical hierarchy, generous spacing, clean fields
function ExpandedTaskCard({
  task,
  phase,
  capturedIds,
  titleChanged,
  assigneeRemoved,
  onCapture,
  onTitleChange,
  onTitleTextChange,
  onAssigneeRemove,
}: ExpandedTaskCardProps) {
  const captureMode = phase === 'capture';
  const editMode = phase === 'change';

  const titleCaptured = capturedIds.has('task-title');
  const statusCaptured = capturedIds.has('task-status');
  const assigneeCaptured = capturedIds.has('task-assignee');
  const anyCaptured = titleCaptured || statusCaptured || assigneeCaptured;

  const [editableTitle, setEditableTitle] = useState(task.title);

  return (
    <div
      data-testid={`task-card-${task.id}`}
      className="rounded-2xl mb-2"
      style={{
        background: 'var(--bg-elevated)',
        border: '1.5px solid rgba(79,142,247,0.28)',
        boxShadow: '0 0 0 4px rgba(79,142,247,0.07), 0 12px 40px rgba(0,0,0,0.35)',
        padding: '18px 16px 16px',
      }}
    >
      {/* ── Card header: tag badge + muted label on separate line ── */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: PRIORITY_COLORS[task.priority] }} />
          <span
            className="text-xs px-2 py-0.5 rounded-md font-medium"
            style={{ background: `${task.tagColor}18`, color: task.tagColor, border: `1px solid ${task.tagColor}28` }}
          >
            {task.tag}
          </span>
        </div>
        <p className="text-xs pl-3.5" style={{ color: 'var(--text-muted)' }}>
          Focused task
        </p>
      </div>

      {/* ── FIELD 1: Title ── */}
      <div className="mb-4">
        <p className="text-xs font-medium mb-1.5 pl-1" style={{ color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
          Title
        </p>
        {captureMode ? (
          <button
            data-testid="task-title"
            onClick={() => !titleCaptured && onCapture('task-title')}
            className="w-full text-left text-sm font-semibold leading-snug"
            style={{
              ...fieldStyle(titleCaptured, captureMode, editMode),
              padding: '9px 12px',
              cursor: titleCaptured ? 'default' : 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            {editableTitle}
          </button>
        ) : editMode ? (
          <div
            data-testid="task-title"
            contentEditable
            suppressContentEditableWarning
            onInput={e => {
              const newVal = (e.target as HTMLElement).innerText.trim();
              setEditableTitle(newVal);
              if (newVal !== task.title) onTitleChange();
            }}
            onBlur={e => {
              const newVal = (e.target as HTMLElement).innerText.trim();
              if (newVal) onTitleTextChange(newVal);
            }}
            className="w-full text-sm font-semibold leading-snug"
            style={{
              ...fieldStyle(false, false, editMode, {
                border: titleChanged ? '1.5px solid rgba(16,185,129,0.45)' : undefined,
                background: titleChanged ? 'rgba(16,185,129,0.06)' : undefined,
              }),
              padding: '9px 12px',
              cursor: 'text',
              minHeight: '36px',
              color: 'var(--text-primary)',
            }}
          >
            {task.title}
          </div>
        ) : (
          <div
            data-testid="task-title"
            className="text-sm font-semibold leading-snug"
            style={{ padding: '9px 12px', color: 'var(--text-primary)', ...fieldStyle(false, false, false) }}
          >
            {editableTitle}
          </div>
        )}
      </div>

      {/* ── FIELD 2: Status (full width) ── */}
      <div className="mb-3">
        <p className="text-xs font-medium mb-1.5 pl-1" style={{ color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
          Status
        </p>
        {captureMode ? (
          <button
            data-testid="task-status"
            onClick={() => !statusCaptured && onCapture('task-status')}
            className="w-full flex items-center gap-2 text-xs font-semibold"
            style={{
              ...fieldStyle(statusCaptured, captureMode, editMode),
              padding: '9px 12px',
              cursor: statusCaptured ? 'default' : 'pointer',
              color: STATUS_COLORS[task.column],
            }}
          >
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_COLORS[task.column] }} />
            {STATUS_LABELS[task.column]}
          </button>
        ) : (
          <div
            data-testid="task-status"
            className="w-full flex items-center gap-2 text-xs font-semibold"
            style={{
              ...fieldStyle(false, false, false),
              padding: '9px 12px',
              color: STATUS_COLORS[task.column],
            }}
          >
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_COLORS[task.column] }} />
            {STATUS_LABELS[task.column]}
          </div>
        )}
      </div>

      {/* ── FIELD 3: Assignee (full width) ── */}
      <div className="mb-1">
        <p className="text-xs font-medium mb-1.5 pl-1" style={{ color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
          Assignee
        </p>
        {assigneeRemoved ? (
          <div
            data-testid="task-assignee"
            className="w-full flex items-center gap-2 text-xs"
            style={{
              padding: '9px 12px',
              borderRadius: '10px',
              border: '1px dashed rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.04)',
              color: 'var(--text-muted)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
              <circle cx="6" cy="6" r="5" stroke="#ef4444" strokeWidth="1.2" strokeOpacity="0.45" />
              <path d="M4 4l4 4M8 4L4 8" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.45" />
            </svg>
            Unassigned
          </div>
        ) : captureMode ? (
          <button
            data-testid="task-assignee"
            onClick={() => !assigneeCaptured && onCapture('task-assignee')}
            className="w-full flex items-center gap-2 text-xs font-medium"
            style={{
              ...fieldStyle(assigneeCaptured, captureMode, editMode),
              padding: '9px 12px',
              cursor: assigneeCaptured ? 'default' : 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0"
              style={{ background: '#8b5cf6', color: 'white', fontSize: '8px' }}
            >
              SR
            </div>
            Sam Rivera
          </button>
        ) : editMode ? (
          <div
            data-testid="task-assignee"
            className="w-full flex items-center gap-2 text-xs font-medium"
            style={{
              ...fieldStyle(false, false, editMode),
              padding: '8px 12px',
              color: 'var(--text-primary)',
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0"
              style={{ background: '#8b5cf6', color: 'white', fontSize: '8px' }}
            >
              SR
            </div>
            <span className="flex-1">Sam Rivera</span>
            <button
              onClick={onAssigneeRemove}
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors"
              style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.25)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.12)'}
              title="Remove assignee"
            >
              <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                <path d="M1 1l5 5M6 1L1 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ) : (
          <div
            data-testid="task-assignee"
            className="w-full flex items-center gap-2 text-xs font-medium"
            style={{ ...fieldStyle(false, false, false), padding: '9px 12px', color: 'var(--text-primary)' }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0"
              style={{ background: '#8b5cf6', color: 'white', fontSize: '8px' }}
            >
              SR
            </div>
            Sam Rivera
          </div>
        )}
      </div>

      {/* ── Hint: only in capture mode, clearly separated ── */}
      {captureMode && !anyCaptured && (
        <div
          className="mt-4 text-xs text-center py-2 rounded-lg"
          style={{
            color: 'var(--accent-blue)',
            background: 'rgba(79,142,247,0.05)',
            border: '1px dashed rgba(79,142,247,0.2)',
            opacity: 0.9,
          }}
        >
          Click each field above to capture it
        </div>
      )}
    </div>
  );
}

// Compact card for non-highlighted tasks
function CompactCard({ task, isDragging = false }: { task: Task; isDragging?: boolean }) {
  return (
    <div
      data-testid={`task-card-${task.id}`}
      className="rounded-xl p-3.5 mb-2"
      style={{
        background: isDragging ? 'var(--bg-surface)' : 'var(--bg-elevated)',
        border: isDragging ? '1px solid var(--border-bright)' : '1px solid var(--border-subtle)',
        boxShadow: isDragging ? '0 12px 40px rgba(0,0,0,0.5)' : 'none',
        opacity: isDragging ? 0.95 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-medium leading-tight" style={{ color: 'var(--text-primary)' }}>
          {task.title}
        </span>
        <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ background: PRIORITY_COLORS[task.priority] }} />
      </div>
      <div className="flex items-center justify-between">
        <span
          className="text-xs px-2 py-0.5 rounded-md"
          style={{ background: `${task.tagColor}18`, color: task.tagColor, border: `1px solid ${task.tagColor}28` }}
        >
          {task.tag}
        </span>
      </div>
    </div>
  );
}

function SortableCompactCard({ task, phase }: { task: Task; phase: 'capture' | 'change' | 'detect' }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: phase !== 'change',
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 }}
      {...(phase === 'change' ? { ...attributes, ...listeners } : {})}
    >
      <CompactCard task={task} />
    </div>
  );
}

export interface DemoTaskBoardProps {
  phase: 'capture' | 'change' | 'detect';
  focusedTaskId?: string;
  capturedIds: Set<string>;
  onCapture: (id: string) => void;
  onTitleChange: () => void;
  onTaskMoved: () => void;
  onAssigneeRemove: () => void;
}

export function DemoTaskBoard({
  phase,
  focusedTaskId = 't3',
  capturedIds,
  onCapture,
  onTitleChange,
  onTaskMoved,
  onAssigneeRemove,
}: DemoTaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [titleChanged, setTitleChanged] = useState(false);
  const [assigneeRemoved, setAssigneeRemoved] = useState(() => loadExtra().assigneeRemoved);

  // Persist tasks whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  // Persist assigneeRemoved whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(EXTRA_KEY, JSON.stringify({ assigneeRemoved }));
    } catch {
      // ignore
    }
  }, [assigneeRemoved]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const fromTask = tasks.find(t => t.id === active.id);
    const toTask = tasks.find(t => t.id === over.id);
    if (!fromTask || !toTask) return;

    if (fromTask.column !== toTask.column) {
      setTasks(prev => prev.map(t => t.id === fromTask.id ? { ...t, column: toTask.column } : t));
      onTaskMoved();
    } else {
      const colTasks = tasks.filter(t => t.column === fromTask.column);
      const oldIdx = colTasks.findIndex(t => t.id === active.id);
      const newIdx = colTasks.findIndex(t => t.id === over.id);
      if (oldIdx !== newIdx) {
        const reordered = arrayMove(colTasks, oldIdx, newIdx);
        setTasks([...tasks.filter(t => t.column !== fromTask.column), ...reordered]);
        if (Math.abs(oldIdx - newIdx) >= 1) onTaskMoved();
      }
    }
  }

  const handleAssigneeRemove = () => {
    setAssigneeRemoved(true);
    onAssigneeRemove();
  };

  const handleTitleChange = () => {
    setTitleChanged(true);
    onTitleChange();
  };

  // Called on blur to persist the edited title text into the tasks array
  const handleTitleTextChange = (newTitle: string) => {
    setTasks(prev => prev.map(t => t.id === focusedTaskId ? { ...t, title: newTitle } : t));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Wider middle column for the focused (expanded) task card */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: '1fr 1.45fr 1fr' }}
        data-testid="task-board"
      >
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.column === col.id);
          return (
            <div key={col.id} data-testid={`column-${col.id}`}>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {col.label}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                  {colTasks.length}
                </span>
              </div>
              <div
                className="rounded-xl p-2 min-h-20"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}
              >
                <SortableContext items={colTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {colTasks.map(task =>
                    task.id === focusedTaskId ? (
                      // The focused task gets the expanded detail view
                      <div
                        key={task.id}
                        {...(phase === 'change'
                          ? { style: { cursor: 'grab' } }
                          : {})}
                      >
                        {phase === 'change' ? (
                          // In change mode, focused card is also draggable
                          <SortableCompactCardWrapper taskId={task.id} phase={phase}>
                            <ExpandedTaskCard
                              task={task}
                              phase={phase}
                              capturedIds={capturedIds}
                              titleChanged={titleChanged}
                              assigneeRemoved={assigneeRemoved}
                              onCapture={onCapture}
                              onTitleChange={handleTitleChange}
                              onTitleTextChange={handleTitleTextChange}
                              onAssigneeRemove={handleAssigneeRemove}
                            />
                          </SortableCompactCardWrapper>
                        ) : (
                          <ExpandedTaskCard
                            task={task}
                            phase={phase}
                            capturedIds={capturedIds}
                            titleChanged={titleChanged}
                            assigneeRemoved={assigneeRemoved}
                            onCapture={onCapture}
                            onTitleChange={handleTitleChange}
                            onTitleTextChange={handleTitleTextChange}
                            onAssigneeRemove={handleAssigneeRemove}
                          />
                        )}
                      </div>
                    ) : (
                      <SortableCompactCard key={task.id} task={task} phase={phase} />
                    )
                  )}
                </SortableContext>
              </div>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? <CompactCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}

// Wrapper to make the expanded card draggable in change mode
function SortableCompactCardWrapper({
  taskId,
  phase,
  children,
}: {
  taskId: string;
  phase: 'capture' | 'change' | 'detect';
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: taskId,
    disabled: phase !== 'change',
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...(phase === 'change' ? { ...attributes, ...listeners } : {})}
    >
      {children}
    </div>
  );
}
