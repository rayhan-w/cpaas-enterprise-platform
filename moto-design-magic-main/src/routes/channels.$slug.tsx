import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CtaBand } from "@/components/site/CtaBand";
import { ChannelLogo } from "@/components/site/ChannelLogo";
import { CHANNELS, getChannel } from "@/lib/channels";

export const Route = createFileRoute("/channels/$slug")({
  loader: ({ params }) => {
    const channel = getChannel(params.slug);
    if (!channel) throw notFound();
    return { slug: channel.slug };
  },
  head: ({ params }) => {
    const channel = getChannel(params.slug);
    if (!channel) {
      return {
        meta: [{ title: "Channel not found — Solvear" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${channel.name} — Solvear`;
    return {
      meta: [
        { title },
        { name: "description", content: channel.intro.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: channel.intro.slice(0, 155) },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ChannelNotFound,
  component: ChannelPage,
});

function ChannelNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-28 text-center">
      <h1 className="font-display text-3xl font-bold">Channel not found</h1>
      <p className="mt-3 text-muted-foreground">The channel you are looking for does not exist.</p>
      <Button asChild className="mt-8">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
}

function ChannelPage() {
  const { slug } = Route.useLoaderData();
  const channel = getChannel(slug)!;
  const others = CHANNELS.filter((c) => c.slug !== channel.slug);

  return (
    <div>
      <section className="bg-navy text-navy-foreground">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <nav className="text-xs font-semibold uppercase tracking-[0.22em] text-navy-foreground/60">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>{" "}
            / Channels / {channel.name}
          </nav>
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center">
            <ChannelLogo name={channel.name} domain={channel.domain} icon={channel.icon} size="lg" />
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                {channel.eyebrow}
              </p>
              <h1 className="mt-3 text-3xl font-bold md:text-5xl">{channel.headline}</h1>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-navy-foreground/75">{channel.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="shadow-pink">
              <Link to="/contact">
                Request a Demo <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
            >
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Capabilities"
            title={`What you can do with ${channel.name}`}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {channel.features.map((f) => (
              <article key={f.title} className="rounded-xl border border-border bg-card p-7">
                <h3 className="font-display text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface section-y">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Use cases" title="Built for real business workflows" />
            <ul className="mt-7 space-y-4">
              {channel.useCases.map((u) => (
                <li key={u} className="flex gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {u}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading align="left" eyebrow="FAQ" title="Common questions" />
            <div className="mt-7 space-y-5">
              {channel.faqs.map((f) => (
                <div key={f.q} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-display text-base font-bold">{f.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="More channels" title="Explore other channels" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((c) => (
              <Link
                key={c.slug}
                to="/channels/$slug"
                params={{ slug: c.slug }}
                className="group rounded-xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-elevated"
              >
                <ChannelLogo name={c.name} domain={c.domain} icon={c.icon} />
                <h3 className="mt-5 font-display text-lg font-bold">{c.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.copy}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
