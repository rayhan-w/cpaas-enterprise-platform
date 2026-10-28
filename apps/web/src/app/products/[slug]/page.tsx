import React from 'react';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { dbService } from '@/lib/db-service';
import ProductView from '@/components/product/ProductView';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ variant?: string; color?: string; [key: string]: string | undefined }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await dbService.getProductBySlug(slug);

  if (!product) {
    const group = await dbService.getGroupBySlug(slug);
    if (group) {
      return {
        title: `${group.name} Collection | Jawata Mart`,
        description: group.description.slice(0, 160),
      };
    }
    return { title: 'Product Not Found | Jawata Mart' };
  }

  return {
    title: `${product.name} | Jawata Mart`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const variantParam = sp?.variant;

  // 1. If variant query param is passed (e.g. ?variant=SKU), check if it maps to an independent split product
  if (variantParam) {
    const matchedBySku = await dbService.findProductBySku(variantParam);
    if (matchedBySku && matchedBySku.slug !== slug) {
      redirect(`/products/${matchedBySku.slug}`);
    }
  }

  const product = await dbService.getProductBySlug(slug);

  // 2. If product not found, check if it was converted into a Group / Collection
  if (!product) {
    const group = await dbService.getGroupBySlug(slug);
    if (group) {
      redirect(`/group/${group.slug}`);
    }
    notFound();
  }

  // 3. If product itself is marked as a Group placeholder
  if (product.isGroupPlaceholder || (product.stock === 0 && !product.variants?.length && product.groupSlug)) {
    redirect(`/group/${product.groupSlug || slug}`);
  }

  // 4. Redirect if this slug was merged into a parent product
  if (product.slug !== slug) {
    const matchedVariant = product.variants?.find(
      (v) => (v as any).mergedFromSlug === slug || v.sku === slug
    );
    const redirectUrl = matchedVariant
      ? `/products/${product.slug}?variant=${encodeURIComponent(matchedVariant.sku)}`
      : `/products/${product.slug}`;
    redirect(redirectUrl);
  }

  const relatedProducts = await dbService.getProducts({
    categorySlug: product.categorySlug,
    limit: 6,
  });

  const filteredRelated = relatedProducts.filter((p) => p.id !== product.id);

  return <ProductView product={product} relatedProducts={filteredRelated} />;
}
