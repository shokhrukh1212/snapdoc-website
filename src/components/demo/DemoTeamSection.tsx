import { useState } from 'react';

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
}

const INITIAL_MEMBERS: Member[] = [
  { id: 'm1', name: 'Alex Chen', role: 'Product Manager', avatar: 'AC', color: '#4f8ef7' },
  { id: 'm2', name: 'Sam Rivera', role: 'Technical Writer', avatar: 'SR', color: '#8b5cf6' },
  { id: 'm3', name: 'Jordan Lee', role: 'QA Engineer', avatar: 'JL', color: '#10b981' },
  { id: 'm4', name: 'Taylor Park', role: 'Frontend Dev', avatar: 'TP', color: '#f59e0b' },
];

interface DemoTeamSectionProps {
  highlightMemberId?: string | null;
  onMemberRemoved?: (memberId: string) => void;
  editMode?: boolean;
}

export function DemoTeamSection({ highlightMemberId, onMemberRemoved, editMode = false }: DemoTeamSectionProps) {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const handleRemove = (id: string) => {
    if (!editMode) return;
    setRemovedIds(prev => new Set([...prev, id]));
    setTimeout(() => {
      setMembers(prev => prev.filter(m => m.id !== id));
      onMemberRemoved?.(id);
    }, 300);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Team Members
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {members.length} active
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {members.map(member => (
          <div
            key={member.id}
            data-testid={`member-${member.id}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300"
            style={{
              background: removedIds.has(member.id)
                ? 'rgba(255,255,255,0.01)'
                : highlightMemberId === member.id
                ? `${member.color}18`
                : 'rgba(255,255,255,0.04)',
              border: highlightMemberId === member.id
                ? `1px solid ${member.color}40`
                : '1px solid var(--border-subtle)',
              opacity: removedIds.has(member.id) ? 0 : 1,
              transform: removedIds.has(member.id) ? 'scale(0.85)' : 'scale(1)',
              outline: highlightMemberId === member.id ? `2px dashed ${member.color}50` : 'none',
              outlineOffset: '3px',
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: member.color, color: 'white', fontSize: '9px' }}
            >
              {member.avatar}
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              {member.name}
            </span>
            <span className="text-xs hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
              · {member.role}
            </span>
            {editMode && (
              <button
                onClick={() => handleRemove(member.id)}
                className="ml-1 w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-150"
                style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)';
                  (e.currentTarget as HTMLElement).style.color = '#ef4444';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                }}
                title={`Remove ${member.name}`}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
