import { useState } from "react";
import type { LucideIcon } from "lucide-react";

const LOGO_TOKEN = import.meta.env["VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY"] as
  | string
  | undefined;

export function ChannelLogo({
  name,
  domain,
  icon: Icon,
  size = "md",
}: {
  name: string;
  domain?: string | undefined;
  icon: LucideIcon;
  size?: "md" | "lg";
}) {
  const [failed, setFailed] = useState(false);
  const showLogo = domain && LOGO_TOKEN && !failed;
  const box = size === "lg" ? "h-16 w-16 rounded-xl" : "h-12 w-12 rounded-lg";
  const inner = size === "lg" ? "h-9 w-9" : "h-7 w-7";

  return (
    <span className={`grid place-items-center overflow-hidden bg-accent text-primary ${box}`}>
      {showLogo ? (
        <img
          src={`https://img.logo.dev/${domain}?token=${LOGO_TOKEN}&size=128&format=png`}
          alt={`${name} logo`}
          width={36}
          height={36}
          loading="lazy"
          className={`${inner} object-contain`}
          onError={() => setFailed(true)}
        />
      ) : (
        <Icon className={size === "lg" ? "h-8 w-8" : "h-6 w-6"} aria-hidden />
      )}
    </span>
  );
}
