import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "./terms";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions | Solvear — Master Service Agreement" },
      {
        name: "description",
        content:
          "Terms and Conditions of Solvear. Read our Master Service Agreement, communication consent, copyright stipulations, and data protection policies.",
      },
      { property: "og:title", content: "Terms and Conditions — Solvear" },
    ],
  }),
  component: TermsPage,
});
