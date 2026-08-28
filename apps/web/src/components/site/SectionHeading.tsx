import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  inverted?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  inverted = false,
  className = '',
}: SectionHeadingProps) {
  const isCenter = align === 'center';
  return (
    <div className={`space-y-3 ${isCenter ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'} ${className}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display text-3xl font-bold tracking-tight md:text-5xl leading-[1.15] ${
          inverted ? 'text-white' : 'text-foreground'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-base leading-relaxed md:text-lg font-normal ${
            inverted ? 'text-navy-foreground/80' : 'text-muted-foreground'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
