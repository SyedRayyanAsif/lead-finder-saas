// A small, one-time burst of falling confetti. Pure CSS, decorative only, and
// hidden entirely for people who prefer reduced motion (see styles.css).
const PIECES = Array.from({ length: 18 }, (_, i) => ({
  left: 8 + ((i * 53) % 84), // spread across the header, deterministic
  delay: (i % 6) * 0.08,
  drift: ((i % 5) - 2) * 14,
  color: ['#6366f1', '#10b981', '#f59e0b', '#38bdf8', '#f472b6'][i % 5],
  tilt: (i * 37) % 360,
}))

export default function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {PIECES.map((p, i) => (
        <i
          key={i}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            background: p.color,
            '--drift': `${p.drift}px`,
            '--tilt': `${p.tilt}deg`,
          }}
        />
      ))}
    </div>
  )
}
