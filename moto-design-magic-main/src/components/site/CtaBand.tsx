import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ctaBg from "@/assets/cta-bg.jpg";

export function CtaBand({
  title = "Ready to turn conversations into revenue?",
  description = "Book a 30-minute walkthrough and see broadcasts, chatbots and the shared inbox running on your own numbers.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-deep text-navy-foreground">
      <img
        src={ctaBg}
        alt=""
        aria-hidden
        loading="lazy"
        width={1920}
        height={800}
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
      />
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
          <p className="mt-3 text-navy-foreground/75">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="shadow-pink">
            <Link to="/contact">Request a Demo</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
          >
            <Link to="/pricing">
              View Pricing <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
