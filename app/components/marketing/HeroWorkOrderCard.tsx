function StampMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <path id="stampCirclePath" d="M 10,60 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" />
      </defs>
      <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="43" fill="none" stroke="currentColor" strokeWidth="1" />
      <text fontSize="8.4" letterSpacing="2.5" fill="currentColor">
        <textPath href="#stampCirclePath" startOffset="2%">
          GARAGE PRO • INTERVENTION VÉRIFIÉE •
        </textPath>
      </text>
      <path
        d="M42 61 L54 73 L80 45"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const FIELDS = [
  { label: "CLIENT", value: "J. Martin" },
  { label: "VÉHICULE", value: "Peugeot 308 · AB-123-CD" },
  { label: "INTERVENTION", value: "Plaquettes avant" },
];

/** Accent flottant, posé sur la photo du hero — pas l'élément central. */
export function HeroWorkOrderCard({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-64 select-none sm:w-72 ${className}`}>
      <div className="absolute -inset-3 -z-10 rounded-2xl bg-ink/30 blur-xl" aria-hidden="true" />
      <div className="rotate-2 rounded-lg border border-ink/10 bg-paper p-5 pl-6 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)]">
        <svg
          className="absolute left-1.5 top-5 bottom-5 h-[calc(100%-2.5rem)] text-ink/20"
          width="2"
          aria-hidden="true"
        >
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="100%"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="3 4"
          />
        </svg>

        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
            Fiche d&apos;intervention
          </p>
          <p className="font-mono text-[10px] text-ink/40">N° 00214</p>
        </div>

        <div className="mt-3 space-y-2.5">
          {FIELDS.map((field) => (
            <div key={field.label}>
              <p className="font-mono text-[9px] uppercase tracking-wider text-ink/40">
                {field.label}
              </p>
              <p className="font-display text-sm text-ink">{field.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-dashed border-ink/20 pt-3">
          <span className="rounded-full bg-chalk/10 px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-chalk">
            Terminé
          </span>
          <StampMark className="h-11 w-11 text-brass/80" />
        </div>
      </div>
    </div>
  );
}
