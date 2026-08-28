'use client';

import Link from 'next/link';

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Solvear home">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary font-display text-lg font-bold text-primary-foreground shadow-pink">
        S
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-lg font-bold tracking-tight ${
            inverted ? 'text-navy-foreground' : 'text-foreground'
          }`}
        >
          Solvear
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
          CPaaS
        </span>
      </span>
    </Link>
  );
}
