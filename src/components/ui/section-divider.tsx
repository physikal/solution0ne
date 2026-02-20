export function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-4">
      <div
        className={
          "h-px flex-1 max-w-xs " +
          "bg-gradient-to-r from-transparent to-[var(--accent-cyan)]"
        }
      />
      <div
        className={
          "mx-4 w-2 h-2 rotate-45 " +
          "bg-[var(--accent-cyan)] shadow-[var(--glow-cyan)]"
        }
      />
      <div
        className={
          "h-px flex-1 max-w-xs " +
          "bg-gradient-to-l from-transparent to-[var(--accent-cyan)]"
        }
      />
    </div>
  );
}
