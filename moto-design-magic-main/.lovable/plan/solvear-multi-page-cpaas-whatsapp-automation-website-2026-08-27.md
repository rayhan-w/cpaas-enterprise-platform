# Solvear — Multi-Page CPaaS / WhatsApp Automation Website

A marketing website with the same product story as solvear.in (WhatsApp + multi-channel automation platform, white-label reseller), styled in the Turain-style visual language: dark navy corporate surfaces, hot-pink accent, full-bleed photographic hero, credibility badge strip, dense feature grids.

Brand: **Solvear** — tagline "Conversations that convert." Placeholder contact details (email, phone, address) will be used and can be swapped later.

## Pages

- `/` — Home: full-bleed hero with photo background, headline "Turn WhatsApp Into Your #1 Sales Channel", two CTAs (Request a Demo / Talk to Expert), trust badge strip, stats counters (310K+ users, projects, clients, team), channels section, about block with image, integrations logo grid, testimonials, FAQ teaser, CTA band.
- `/products` — Channel products: WhatsApp Business API, Bulk SMS, Messenger, Instagram, Telegram, Webchat, Voice/IVR. Each as a card with icon, description, feature bullets.
- `/features` — Platform capabilities: broadcasts, drag-and-drop chatbot builder, shared inbox, abandoned cart recovery, COD verification, appointment scheduling, sequence messaging, AI tokens (OpenAI/Gemini), commerce catalog, analytics.
- `/white-label` — Reseller solution: custom domain, rebranding, pricing control, add-on selling, reseller dashboard; "how it works" steps and a reseller CTA.
- `/integrations` — Searchable/filterable grid of integration cards (payments, SMS gateways, Sheets, SMTP, CRMs) with category chips.
- `/pricing` — Three plans (Starter / Growth / Agency) plus white-label tier, monthly/yearly toggle, feature comparison table, pricing FAQ.
- `/about` — Company story, mission, stats, team grid, certifications/values.
- `/contact` — Contact form (name, email, phone, company, message), sales phone/email cards, office info, WhatsApp CTA. Form is front-end only with a success toast (no backend in this scope).

Shared header (top utility bar with sales phone + Help Desk/Login links, main nav with dropdown-style grouping, pink "Schedule a Consultation" button, mobile drawer) and a dark multi-column footer live in the root layout.

## Design system

- Dark navy `#0E1330` base, deep navy `#1B2455` surfaces, hot pink `#FF2E86` accent, near-white `#F5F6FA` — all defined as oklch semantic tokens in `src/styles.css` (light + dark), no hardcoded color classes in components.
- Typography: geometric sans (Poppins-alternative such as Sora/Manrope pairing) loaded via a `<link>` in the root head.
- Rounded-medium cards, soft elevation shadows, pink circular arrow buttons, subtle section gradients, restrained fade/slide-in on scroll.
- Hero and section imagery generated as assets (business/communication photography matching the reference's tone), plus simple SVG/lucide icons for channels and features.

## Technical notes

- TanStack Start file routes under `src/routes/` (one file per page), shared chrome in `src/routes/__root.tsx`, reusable section components in `src/components/`.
- Each route gets its own `head()` with unique title, description, og:title, og:description; `og:image`/`twitter:image` added on the home route once the hero asset has an absolute URL.
- Design tokens added to `src/styles.css` `@theme inline`, `:root`, `.dark`; shadcn button/card variants extended rather than ad-hoc classes.
- Fully responsive down to mobile; semantic HTML, single H1 per page, alt text on all images.
- No database or auth — static marketing content. Contact form submission handling can be added later with Lovable Cloud if wanted.
