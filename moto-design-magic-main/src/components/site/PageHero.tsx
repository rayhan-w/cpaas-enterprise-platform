import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-deep text-navy-foreground">
      {/* High-Performance Hardware-Accelerated Ambient Glow without heavy blur convolution */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-30 [background:radial-gradient(circle,oklch(0.65_0.25_3/0.6)_0%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/4 h-80 w-80 rounded-full opacity-25 [background:radial-gradient(circle,oklch(0.34_0.09_274/0.8)_0%,transparent_70%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 md:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
        <h1 className="mt-3.5 max-w-3xl font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-navy-foreground/80 leading-relaxed">
          {description}
        </p>
        {children && <div className="mt-7 sm:mt-8">{children}</div>}
      </div>
    </section>
  );
}
