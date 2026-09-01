import { Link } from "@tanstack/react-router";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group" aria-label="Solvear Home">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border shadow-sm transition-transform duration-200 group-hover:scale-105">
        <img
          src="/logo.png"
          alt="Solvear Logo"
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex items-center">
        <span
          className={`font-display text-lg font-extrabold tracking-tight transition-colors ${
            inverted ? "text-navy-foreground" : "text-foreground group-hover:text-primary"
          }`}
        >
          Solvear
        </span>
      </div>
    </Link>
  );
}
