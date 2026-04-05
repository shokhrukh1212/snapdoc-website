import { useState } from 'react';
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

export interface Task {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  priority: 'high' | 'medium' | 'low';
  column: string;
}

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#6b7280',
};

function TaskCard({
  task,
  isDragging = false,
  isHighlighted = false,
}: {
  task: Task;
  isDragging?: boolean;
  isHighlighted?: boolean;
}) {
  return (
    <div
      data-testid={`task-card-${task.id}`}
      className="rounded-xl p-3.5 mb-2.5 cursor-grab active:cursor-grabbing transition-all duration-200"
      style={{
        background: isDragging ? 'var(--bg-surface)' : 'var(--bg-elevated)',
        border: isHighlighted
          ? '1px solid rgba(79,142,247,0.5)'
          : isDragging
          ? '1px solid var(--border-bright)'
          : '1px solid var(--border-subtle)',
        boxShadow: isDragging ? '0 12px 40px rgba(0,0,0,0.5)' : isHighlighted ? '0 0 0 3px rgba(79,142,247,0.15)' : 'none',
        opacity: isDragging ? 0.95 : 1,
        outline: isHighlighted ? '2px dashed rgba(79,142,247,0.4)' : 'none',
        outlineOffset: '3px',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <span
          className="text-xs font-medium leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {task.title}
        </span>
        <div
          className="w-2 h-2 rounded-full shrink-0 mt-0.5"
          style={{ background: PRIORITY_COLORS[task.priority] }}
          title={`${task.priority} priority`}
        />
      </div>
      <div className="flex items-center justify-between">
        <span
          className="text-xs px-2 py-0.5 rounded-md"
          style={{
            background: `${task.tagColor}18`,
            color: task.tagColor,
            border: `1px solid ${task.tagColor}28`,
          }}
        >
          {task.tag}
        </span>
        <div
          className="w-5 h-5 rounded-full text-xs flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}
        >
          {task.id.slice(-1)}
        </div>
      </div>
    </div>
  );
}

function SortableTask({
  task,
  isHighlighted,
}: {
  task: Task;
  isHighlighted: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} isHighlighted={isHighlighted} />
    </div>
  );
}

interface DemoTaskBoardProps {
  highlightTaskId?: string | null;
  onTaskMoved?: (taskId: string) => void;
}

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Update onboarding guide screenshots', tag: 'Docs', tagColor: '#4f8ef7', priority: 'high', column: 'todo' },
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

export function DemoTaskBoard({ highlightTaskId, onTaskMoved }: DemoTaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    const overTask = tasks.find(t => t.id === over.id);

    if (!activeTask) return;

    if (overTask && activeTask.column !== overTask.column) {
      // Move to different column
      const oldCol = activeTask.column;
      setTasks(prev =>
        prev.map(t =>
          t.id === activeTask.id ? { ...t, column: overTask.column } : t
        )
      );
      if (oldCol !== overTask.column) {
        onTaskMoved?.(activeTask.id);
      }
    } else if (activeTask.column === overTask?.column) {
      // Reorder within same column
      const colTasks = tasks.filter(t => t.column === activeTask.column);
      const oldIdx = colTasks.findIndex(t => t.id === active.id);
      const newIdx = colTasks.findIndex(t => t.id === over.id);

      if (oldIdx !== newIdx) {
        const reordered = arrayMove(colTasks, oldIdx, newIdx);
        const otherTasks = tasks.filter(t => t.column !== activeTask.column);
        const newTasks = [...otherTasks];
        // Interleave back in order
        setTasks([...tasks.filter(t => t.column !== activeTask.column), ...reordered]);

        const verticalDelta = Math.abs(oldIdx - newIdx) * 80;
        if (verticalDelta >= 50) {
          onTaskMoved?.(activeTask.id);
        }
        void newTasks; // suppress unused var
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-3 gap-4 h-full" data-testid="task-board">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.column === col.id);
          return (
            <div key={col.id} className="flex flex-col" data-testid={`column-${col.id}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {col.label}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}
                >
                  {colTasks.length}
                </span>
              </div>
              <div
                className="flex-1 rounded-xl p-2 min-h-24"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <SortableContext items={colTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {colTasks.map(task => (
                    <SortableTask
                      key={task.id}
                      task={task}
                      isHighlighted={highlightTaskId === task.id}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
