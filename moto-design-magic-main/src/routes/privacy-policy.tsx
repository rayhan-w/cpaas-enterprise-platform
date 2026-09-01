import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "./privacy";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Solvear — Data Security & Protection" },
      {
        name: "description",
        content:
          "Privacy Policy of Solvear. Read how we protect personal information, secure data transmission, and handle electronic messaging communications.",
      },
      { property: "og:title", content: "Privacy Policy — Solvear" },
    ],
  }),
  component: PrivacyPage,
});
