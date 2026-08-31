import type { LucideIcon } from "lucide-react";

export function ChannelLogo({
  name,
  icon: Icon,
  size = "md",
}: {
  name: string;
  domain?: string | undefined;
  icon: LucideIcon;
  size?: "md" | "lg";
}) {
  const box = size === "lg" ? "h-16 w-16 rounded-2xl" : "h-12 w-12 rounded-xl";

  return (
    <span
      className={`grid place-items-center bg-primary/10 text-primary border border-primary/20 shadow-xs ${box}`}
      aria-label={name}
    >
      <Icon className={size === "lg" ? "h-8 w-8" : "h-6 w-6"} aria-hidden />
    </span>
  );
}
