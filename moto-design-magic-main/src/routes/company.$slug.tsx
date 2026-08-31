import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getPageData } from "@/data/allPagesData";
import { DedicatedPageTemplate } from "@/components/site/DedicatedPageTemplate";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/company/$slug")({
  loader: ({ params }) => {
    const page = getPageData(params.slug);
    if (!page || page.category !== "Company") {
      throw notFound();
    }
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const page = getPageData(params.slug);
    if (!page) {
      return {
        meta: [{ title: "Company Page Not Found — Solvear" }],
      };
    }
    return {
      meta: [
        { title: `${page.name} | Solvear` },
        { name: "description", content: page.intro.slice(0, 160) },
        { property: "og:title", content: `${page.name} | Solvear` },
        { property: "og:description", content: page.intro.slice(0, 160) },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-28 text-center">
      <h1 className="font-display text-3xl font-bold">Page Not Found</h1>
      <p className="mt-3 text-muted-foreground">The company section you are looking for does not exist.</p>
      <Button asChild className="mt-8">
        <Link to="/about">About Solvear</Link>
      </Button>
    </div>
  ),
  component: CompanyPage,
});

function CompanyPage() {
  const { slug } = Route.useLoaderData();
  const page = getPageData(slug)!;
  return <DedicatedPageTemplate page={page} />;
}
