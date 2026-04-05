export function GradientOrb() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Primary orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: '700px',
          height: '700px',
          top: '-200px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(79,142,247,0.18) 0%, rgba(139,92,246,0.12) 50%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'orbFloat 25s ease-in-out infinite',
        }}
      />
      {/* Secondary orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: '400px',
          height: '400px',
          top: '100px',
          right: '-100px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'orbFloat2 30s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          33% { transform: translateX(-50%) translateY(-40px) translateX(30px); }
          66% { transform: translateX(-50%) translateY(20px) translateX(-20px); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-60px); }
        }
      `}</style>
    </div>
  );
}
