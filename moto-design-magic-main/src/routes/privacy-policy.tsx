import { createFileRoute } from "@tanstack/react-router";
import { Route as PrivacyRoute } from "./privacy";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED" },
      {
        name: "description",
        content:
          "Privacy Policy and Data Protection standards of SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED. Learn how we collect, protect, and process user data across our CPaaS platforms.",
      },
    ],
  }),
  component: PrivacyRoute.options.component,
});
