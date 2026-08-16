export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <rect x="1.5" y="1.5" width="25" height="25" rx="5" fill="#378ADD" />
        <path d="M1.5 14H26.5V21.5C26.5 24.2614 24.2614 26.5 21.5 26.5H6.5C3.73858 26.5 1.5 24.2614 1.5 21.5V14Z" fill="#D85A30" />
        <rect x="1.5" y="1.5" width="25" height="25" rx="5" stroke="white" strokeWidth="1.5" />
        <line x1="1.5" y1="14" x2="26.5" y2="14" stroke="white" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="3.4" stroke="white" strokeWidth="1.3" fill="none" />
      </svg>
      <span className="font-bold text-lg leading-none">
        <span className="text-brand-blue">Prancheta</span>{" "}
        <span className="text-brand-orange">EF</span>
      </span>
    </span>
  );
}
