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
      <div
        aria-hidden
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-navy-soft/60 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base text-navy-foreground/75 md:text-lg">{description}</p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
