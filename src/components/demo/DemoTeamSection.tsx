const MEMBERS = [
  { id: 'm1', name: 'Alex Chen', role: 'PM', avatar: 'AC', color: '#4f8ef7' },
  { id: 'm2', name: 'Sam Rivera', role: 'Writer', avatar: 'SR', color: '#8b5cf6' },
  { id: 'm3', name: 'Jordan Lee', role: 'QA', avatar: 'JL', color: '#10b981' },
  { id: 'm4', name: 'Taylor Park', role: 'Dev', avatar: 'TP', color: '#f59e0b' },
];

interface DemoTeamSectionProps {
  phase: 'capture' | 'change' | 'detect';
}

export function DemoTeamSection({ phase: _phase }: DemoTeamSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Team Members
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{MEMBERS.length} active</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {MEMBERS.map(m => (
          <div
            key={m.id}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center font-bold"
              style={{ background: m.color, color: 'white', fontSize: '8px' }}
            >
              {m.avatar}
            </div>
            <span style={{ color: 'var(--text-primary)' }}>{m.name}</span>
            <span style={{ color: 'var(--text-muted)' }}>· {m.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
