import { createFileRoute } from "@tanstack/react-router";
import { Route as TermsRoute } from "./terms";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions — SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED" },
      {
        name: "description",
        content:
          "Terms of Service and Master Service Agreement for Solvear CPaaS, Bulk SMS, WhatsApp Business API, and Digital Marketing platforms.",
      },
    ],
  }),
  component: TermsRoute.options.component,
});
