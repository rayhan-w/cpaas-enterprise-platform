import React from 'react';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="bg-navy-deep text-navy-foreground py-20 md:py-28 text-center px-6">
      <div className="mx-auto max-w-4xl space-y-4">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl text-white leading-[1.12]">
          {title}
        </h1>
        {description && (
          <p className="mx-auto max-w-2xl text-base text-navy-foreground/80 md:text-xl font-normal leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
