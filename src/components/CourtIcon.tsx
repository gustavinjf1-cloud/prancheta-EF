// Mini "quadra tática" — mesma identidade visual usada nos posts do Instagram:
// quadra vertical, metade azul (em cima) e metade laranja (embaixo), com círculo
// central + bola, traves nas duas pontas — ou rede no meio, pra atividades de vôlei.
export function CourtIcon({ net = false, className = "" }: { net?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={className} aria-hidden>
      <rect x="4" y="4" width="112" height="152" rx="14" fill="#378ADD" />
      <path d="M4 82H116V142C116 150.837 108.837 158 100 158H20C11.1634 158 4 150.837 4 142V82Z" fill="#D85A30" />
      <rect x="4" y="4" width="112" height="152" rx="14" stroke="#232B38" strokeWidth="2.5" fill="none" />
      <line x1="10" y1="82" x2="110" y2="82" stroke="#232B38" strokeWidth="2.5" />

      {net ? (
        <>
          <line x1="30" y1="70" x2="30" y2="94" stroke="#232B38" strokeWidth="4" />
          <line x1="90" y1="70" x2="90" y2="94" stroke="#232B38" strokeWidth="4" />
          <line x1="30" y1="70" x2="90" y2="70" stroke="#232B38" strokeWidth="2" />
          <line x1="30" y1="94" x2="90" y2="94" stroke="#232B38" strokeWidth="2" />
          {Array.from({ length: 7 }).map((_, i) => (
            <line
              key={i}
              x1={30 + (i * (90 - 30)) / 6}
              y1={70}
              x2={30 + (i * (90 - 30)) / 6}
              y2={94}
              stroke="#B4B2AC"
              strokeWidth="1"
            />
          ))}
        </>
      ) : (
        <>
          <circle cx="60" cy="82" r="20" stroke="#232B38" strokeWidth="2.5" fill="none" />
          <circle cx="60" cy="82" r="4" fill="#EF9F27" />
          <rect x="42" y="-4" width="36" height="8" stroke="#232B38" strokeWidth="2.5" fill="none" />
          <rect x="42" y="156" width="36" height="8" stroke="#232B38" strokeWidth="2.5" fill="none" />
        </>
      )}
    </svg>
  );
}
