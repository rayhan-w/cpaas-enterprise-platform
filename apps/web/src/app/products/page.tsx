import CategoryPage from '@/app/category/[slug]/page';

interface ProductsPageProps {
  searchParams: Promise<{ search?: string; sort?: string; sub?: string; offer?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;
  return CategoryPage({
    params: Promise.resolve({ slug: 'all' }),
    searchParams: Promise.resolve(sp || {}),
  });
}
