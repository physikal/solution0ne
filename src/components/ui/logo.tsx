interface LogoProps {
  /** Render the wordmark alongside the logomark */
  showText?: boolean;
  /** Height in pixels (width scales proportionally) */
  size?: number;
}

function Logomark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Hexagonal outline */}
      <polygon
        points="32,4 57,18 57,46 32,60 7,46 7,18"
        stroke="#00f0ff"
        strokeWidth="1.2"
        strokeOpacity="0.25"
        fill="none"
      />

      {/* Connecting edges between nodes */}
      <g stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.6" filter="url(#logo-glow)">
        <line x1="32" y1="16" x2="46" y2="42" />
        <line x1="46" y1="42" x2="18" y2="42" />
        <line x1="18" y1="42" x2="32" y2="16" />
      </g>

      {/* Node: top */}
      <circle cx="32" cy="16" r="4.5" fill="#00f0ff" filter="url(#logo-glow)" />
      <circle cx="32" cy="16" r="2" fill="#ffffff" />

      {/* Node: bottom-right */}
      <circle cx="46" cy="42" r="4.5" fill="#00f0ff" filter="url(#logo-glow)" />
      <circle cx="46" cy="42" r="2" fill="#ffffff" />

      {/* Node: bottom-left */}
      <circle cx="18" cy="42" r="4.5" fill="#00f0ff" filter="url(#logo-glow)" />
      <circle cx="18" cy="42" r="2" fill="#ffffff" />
    </svg>
  );
}

export function Logo({ showText = true, size = 32 }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <Logomark size={size} />
      {showText && (
        <span
          className="text-lg font-bold tracking-tight text-[var(--foreground)]"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          Solution
          <span className="text-[var(--accent-cyan)]">0</span>
          ne
        </span>
      )}
    </span>
  );
}
